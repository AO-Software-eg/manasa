'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CardLayout from '@/app/components/CardLayout';

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen mt-20 bg-[#090908] px-4 py-10 text-white"
      dir="rtl"
    >
      <div className="container mx-auto max-w-3xl">
        <CardLayout classname="mx-auto flex flex-col items-center gap-6 text-center bg-[#121212] border-[#3b3b34]/50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-950/30 text-red-400 shadow-lg shadow-[#0000001a]">
            <span className="text-5xl">✕</span>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-[#e6d3a3]">
              فشل عملية الدفع
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#e6d3a3]/70">
              لم تكتمل عملية الدفع بنجاح. يمكنك إعادة المحاولة أو التواصل مع
              الدعم إذا استمرت المشكلة.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push('/home/wallet')}
              className="rounded-full bg-[#e6d3a3] px-6 py-3 font-semibold text-[#121212] transition hover:bg-[#d9c38b]"
            >
              إعادة المحاولة
            </button>

            <Link
              href="/home"
              className="rounded-full border border-[#3b3b34] px-6 py-3 font-semibold text-[#e6d3a3] transition hover:bg-[#1c1c18]"
            >
              العودة للرئيسية
            </Link>
          </div>

          <div className="w-full rounded-3xl border border-[#3b3b34] bg-[#1a1a1a] px-6 py-5 text-right text-sm text-[#c4c4c4]">
            <p className="font-semibold text-[#e6d3a3]">ماذا يمكنك أن تفعل؟</p>

            <p className="mt-2">
              تأكد من صحة بيانات البطاقة أو وسيلة الدفع، ثم أعد المحاولة. إذا تم
              خصم المبلغ ولم يتم تسجيلك في الدورة، يرجى التواصل مع فريق الدعم.
            </p>
          </div>
        </CardLayout>
      </div>
    </div>
  );
}