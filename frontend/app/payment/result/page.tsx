// app/payment/result/page.tsx
'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetEnrollments } from '@/app/hooks/queries/useEnroll';
import { useMe } from '@/app/hooks/queries/useMe';
import { Enrollment } from '@/types';
import CardLayout from '@/app/components/CardLayout';

const MAX_POLL_ATTEMPTS = 6; // ~ 6 * 2.5s = 15s of grace for webhook lag
const POLL_INTERVAL_MS = 2500;

function PaymentResultInner() {
  const router = useRouter();
  const params = useSearchParams();

  const type = params.get('type'); // 'course' or 'wallet'
  const courseIdParam = params.get('courseId');
  const courseId = courseIdParam ? Number(courseIdParam) : null;
  const paidAmountCents = Number(params.get('amount_cents') ?? params.get('amount') ?? 0);

  const { data: me, isLoading: meLoading, isError: meError } = useMe();

  const {
    data: enrollments,
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
    refetch,
  } = useGetEnrollments(me?.id?.toString() ?? '');

  const attemptsRef = useRef(0);
  const [failedTimeout, setFailedTimeout] = useState(false);

  useEffect(() => {
    // Wallet top-ups don't have a course to check enrollment against —
    // treat them as an immediate success redirect instead of running
    // the course-enrollment check below.
    if (type === 'wallet') {
      router.replace('/payment/success?type=wallet');
      return;
    }

    if (!courseId || Number.isNaN(courseId)) {
      // course flow but no valid courseId — nothing to verify
      router.replace('/payment/failed');
      return;
    }

    if (meLoading || meError) return; // wait for user, or bail via effect below on error
    if (enrollmentsLoading) return;

    if (enrollmentsError) {
      // transient error — retry a few times before giving up
      if (attemptsRef.current < MAX_POLL_ATTEMPTS) {
        attemptsRef.current += 1;
        const t = setTimeout(() => refetch(), POLL_INTERVAL_MS);
        return () => clearTimeout(t);
      }
      router.replace('/payment/failed');
      return;
    }

    if (!enrollments) return;

    const enrolled = enrollments.some((e: Enrollment) => {
      const isSameCourse = Number(e.course.id) === courseId;
      if (!isSameCourse) return false;

      if (!paidAmountCents) return true;

      const expectedAmountCents = Math.round((e.course.price ?? 0) * 100);
      return expectedAmountCents === paidAmountCents;
    });

    if (enrolled) {
      router.replace(`/home/courses/${courseId}/lectures`);
      return;
    }

    // Not enrolled yet — this is likely a webhook that hasn't landed.
    // Poll a few times before treating it as a real failure.
    if (attemptsRef.current < MAX_POLL_ATTEMPTS) {
      attemptsRef.current += 1;
      const t = setTimeout(() => refetch(), POLL_INTERVAL_MS);
      return () => clearTimeout(t);
    }

    setFailedTimeout(true);
    router.replace('/payment/failed');
  }, [
    type,
    courseId,
    paidAmountCents,
    me,
    meLoading,
    meError,
    enrollments,
    enrollmentsLoading,
    enrollmentsError,
    refetch,
    router,
  ]);

  return (
    <div className="min-h-screen bg-[#090908] px-4 py-10 mt-20 text-white" dir="rtl">
      <div className="container mx-auto max-w-3xl">
        <CardLayout classname="mx-auto flex flex-col items-center gap-6 text-center bg-[#121212] border-[#3b3b34]/50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1C1C18] text-[#e6d3a3] shadow-lg shadow-[#0000001a]">
            <svg className="h-10 w-10 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-[#e6d3a3]">جاري التحقق من الدفع</h1>
            <p className="mt-3 text-sm leading-7 text-[#e6d3a3]/70">
              {failedTimeout
                ? 'استغرق التحقق وقتاً أطول من المتوقع، جاري تحويلك...'
                : 'نراجع حالة الدفع وحالة التسجيل في الدورة. سيتم التوجيه تلقائياً بعد الانتهاء.'}
            </p>
          </div>

          <div className="rounded-3xl border border-[#3b3b34] bg-[#1a1a1a] px-6 py-5 text-right text-sm text-[#c4c4c4]">
            <p className="font-semibold text-[#e6d3a3]">ملاحظة</p>
            <p className="mt-2">
              إذا استمرت العملية لفترة طويلة، تحقق من اتصال الإنترنت وأعد المحاولة.
            </p>
          </div>
        </CardLayout>
      </div>
    </div>
  );
}

export default function PaymentResult() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090908] flex items-center justify-center px-4 text-white" dir="rtl">
          <div className="rounded-3xl border border-[#3b3b34] bg-[#121212] px-8 py-6 text-center shadow-xl shadow-[#00000020]">
            <p className="text-sm text-[#c4c4c4]">جارٍ تحميل الصفحة…</p>
          </div>
        </div>
      }
    >
      <PaymentResultInner />
    </Suspense>
  );
}