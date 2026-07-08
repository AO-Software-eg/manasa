'use client';

import CourseImage from '@/app/components/CourseImg';
import BackButton from '@/app/components/BackBtn';
import ExpandableText from '@/app/components/EcalpsedTxt';
import Link from 'next/link';
import LoadingComp from '@/app/components/LoadingComp';
import { useEffect, useState } from 'react';
import { useCourseById } from '@/app/hooks/queries/useCourses';
import { useParams, useRouter } from 'next/navigation';
import { useEnroll } from '@/app/hooks/queries/useEnroll';
import { useMe } from '@/app/hooks/queries/useMe';
import { useGetEnrollments } from '@/app/hooks/queries/useEnroll';
import { toast } from 'sonner';
import { usePayment } from '@/app/hooks/queries/usePayment';
import { courses, Enrollment } from '@/types';
import popups from '@/app/components/PopUp';
import PopUp from '@/app/components/PopUp';

export default function CoursePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data, isLoading, isError, refetch } = useCourseById(id ?? '');

  if (isLoading) return <LoadingComp />;

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive font-medium">حدث خطأ أثناء تحميل الكورس</p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
        >
          إعادة المحاولة
        </button>
      </div>
    );

  if (!data) return <h3 className="text-xl font-bold text-center mt-20">لم يتم العثور على الكورس</h3>;

  return (
    <div className="max-w-4xl mx-auto p-4 text-foreground">
      <div className="flex flex-row-reverse items-center justify-between">
        <BackButton />
        <h1 className="text-3xl font-bold my-4">{data.title}</h1>
      </div>
      <CourseImage title={data.title} />
      <ExpandableText text={data.description} />
      <CourseData course={data} />
    </div>
  );
}

function CourseData({ course }: { course: courses }) {
  const { data: userData } = useMe();

  const enrollMutation = useEnroll();
  const router = useRouter();
  const paymentMutation = usePayment();
  const [isopen, setIsOpen] = useState(false);
  const isFree = course.price === 0;


  const handlePurchase = () => {
    if (!userData?.id) return router.push('/login');
          paymentMutation.mutate(
        {
          itemId: Number(course.id),
          phoneNumber: userData?.studentPhone,
        },
        {
          onSuccess: (data) => {
            setIsOpen(false);
            const paymentKey = data.payment_keys[0].key;
            const url = `https://accept.paymob.com/api/acceptance/iframes/1056311?payment_token=${paymentKey}`;
            window.location.href = url;
          },
        },
      );
  }

  const handleEnroll = () => {
    if (!userData?.id) return router.push('/login');
        enrollMutation.mutate(
        {
          studentId: Number(userData.id),
          courseId: Number(course.id),
        },
        {
          onSuccess: () => {
            toast.success('تم الانضمام إلى الكورس بنجاح');
            router.push(`/home/courses/${course.id}/lectures`);
          },
        },
      );
  }

  const {
    data: enrollments,
  } = useGetEnrollments(userData?.id?.toString() ?? '');

  const enrolledCourseIds = new Set(
    enrollments?.map((e: Enrollment) => Number(e.course.id)) ?? [],
  );

  const isPurchased = enrolledCourseIds.has(Number(course.id));

  useEffect(() => {
    if (isPurchased) {
      router.replace(`/home/courses/${course.id}/lectures`);
    }
  }, [isPurchased, course.id, router]);

  return (
    <div className="mt-12">
      <div className="bg-card border border-border p-8 rounded-2xl flex flex-col items-center text-center shadow-xs">
        {isPurchased ? (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-primary mb-3">
                تم شراء هذا الكورس
              </h2>

              <p className="text-muted-foreground text-base md:text-lg">
                يمكنك الآن الوصول إلى جميع المحاضرات والمحتوى.
              </p>
            </div>

            <Link
              href={`/home/courses/${course.id}/lectures`}
              className="px-12 py-4 bg-primary/10 hover:bg-primary/20 border-2 border-primary text-foreground hover:text-primary font-bold text-lg rounded-full shadow-sm hover:shadow-md hover:scale-102 transition-all"
            >
              الدخول إلى المحاضرات
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-4 text-primary">
              المحتوى مقفل
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              قم بشراء الكورس للوصول إلى جميع الدروس والمواد التعليمية.
            </p>

  

            <button onClick={() => isFree ? handleEnroll() : setIsOpen(true)} className="px-12 py-4 bg-primary text-primary-foreground hover:bg-primary/95 border-2 border-transparent font-bold text-lg rounded-full shadow-md hover:shadow-lg hover:scale-102 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              <div className='flex flex-col gap-1'>
                   الانضمام للكورس
              <span className='text-sm text-primary-foreground/70 font-semibold opacity-80'>
                - {course.price > 0 ? ` بسعر ${course.price} جنيه` : ' مجاناً'} -
              </span>
              </div>
            </button>

            <PopUp open={isopen} title={` اختار طريقه الدفع لدفع ${course.price} ج`} onClose={() => setIsOpen(false)} description='اختر طريقة الدفع المناسبة لك'
              buttons={
                <div className="flex flex-col gap-4 mt-4">
                  <button onClick={handlePurchase}
                    disabled={enrollMutation.isPending}
                    className="px-12 py-4 bg-primary text-primary-foreground hover:bg-primary/95 border-2 border-transparent font-bold text-lg rounded-full shadow-md hover:shadow-lg hover:scale-102 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    الدفع عن طريق بوابة الدفع
                  </button>
                  <button className="px-12 py-4 bg-primary text-primary-foreground hover:bg-primary/95 border-2 border-transparent font-bold text-lg rounded-full shadow-md hover:shadow-lg hover:scale-102 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    الدفع عن طريق رصيد المحفظة
                  </button>
                </div>
              }
            />
          </>
        )}

      </div>
    </div>
  );
}
