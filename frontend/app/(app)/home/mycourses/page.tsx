'use client';
import { useGetEnrollments } from '@/app/hooks/queries/useEnroll';
import { useMe } from '@/app/hooks/queries/useMe';
import CourseComp from '@/app/components/CourseComp';
import { courses } from '@/types';
import CoursesLoading from '@/app/components/CoursesLoading';

type Enrollment = {
  course: courses;
};

function page() {
  const { data: userData } = useMe();
  const {
    data: enrollments,
    isLoading,
    isError,
    error ,
    refetch
  } = useGetEnrollments(userData?.id ?? '');


  if (enrollments?.length < 1) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-muted-foreground mt-10 mb-5">
         لا يوجد أي اشتراكات حالية
        </h3>
      </div>
    )
  }

  if (isLoading) {
    return <CoursesLoading />;
  }

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-destructive">
        {error instanceof Error ? error.message : 'فشل تحميل الكورسات'}
      </p>
      <button
        onClick={() => refetch()}
        className="px-5 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm"
      >
        أعد المحاولة
      </button>
    </div>
  );

  return (
    <section className="w-full min-h-screen flex mt-20 flex-col gap-12 p-5 items-center justify-start">
      <h3 className="text-4xl md:text-5xl font-bold text-center mt-10 mb-5 text-foreground">
        الكورسات الملتحق بها
      </h3>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {enrollments?.map((enrollment: Enrollment, i: number) => (
          <CourseComp
            key={enrollment.course.id}
            index={i}
            id={enrollment.course.id}
            title={enrollment.course.title}
            description={enrollment.course.description}
            price={enrollment.course.price}
            imageUrl={enrollment.course.imageUrl}
            userData={userData}
            isPriority={i < 3}
            isMyCoursesPage={true}
            progress={100}
          />
        ))}
      </div>
    </section>
  );
}

export default page;
