'use client';

import CourseImage from '@/app/components/CourseImg';
import BackButton from '@/app/components/BackBtn';
import ExpandableText from '@/app/components/EcalpsedTxt';
import Link from 'next/link';
import LoadingComp from '@/app/components/LoadingComp';
import { useCourseById } from '@/app/hooks/queries/useCourses';
import { useParams, useRouter } from 'next/navigation';
import { useEnroll } from '@/app/hooks/queries/useEnroll';
import { useMe } from '@/app/hooks/queries/useMe';
import { useGetEnrollments } from '@/app/hooks/queries/useEnroll';
import { toast } from 'sonner';


export default function CoursePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: course, isLoading, isError, refetch } = useCourseById(id ?? '');

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

  if (!course) return <h3 className="text-xl font-bold text-center mt-20">لم يتم العثور على الكورس</h3>;

  return (
    <div className="max-w-4xl mx-auto p-4 text-foreground">
      <div className="flex flex-row-reverse items-center justify-between">
        <BackButton route="/home/courses" />
        <h1 className="text-2xl md:text-3xl font-bold my-4">{course.title}</h1>
      </div>
      <CourseImage title={course.title} />
      <ExpandableText text={course.description} />
      <CourseData course={course} />
    </div>
  );
}

interface CourseDataProps {
  course: {
    title: string;
    id: string;
  };
}

function CourseData({ course }: CourseDataProps) {
  const { data: userData } = useMe();

  const enrollMutation = useEnroll();
  const router = useRouter();

  const handleEnroll = () => {
    if (!userData?.id) return;

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
  };

  const {
    data: enrollments,
  } = useGetEnrollments(userData?.id?.toString() ?? '');

  const enrolledCourseIds = new Set(
    enrollments?.map((e: any) => Number(e.course.id)) ?? [],
  );

  const isPurchased = enrolledCourseIds.has(Number(course.id));

  return (
    <div className="mt-12">
      <div className="bg-card border border-border p-8 rounded-2xl flex flex-col items-center text-center shadow-xs">
        {isPurchased ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
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
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
              المحتوى مقفل
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              قم بشراء الكورس للوصول إلى جميع الدروس والمواد التعليمية.
            </p>

            <button
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
              className="px-12 py-4 bg-primary text-primary-foreground hover:bg-primary/95 border-2 border-transparent font-bold text-lg rounded-full shadow-md hover:shadow-lg hover:scale-102 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {enrollMutation.isPending ? 'جاري الانضمام...' : 'شراء الكورس'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
