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
      <h1 className="text-6xl font-bold text-center mt-10 mb-5 text-[#E5E5E5]">
       لا يوجد اي اشتراكات
      </h1>
    )
  }


  
  if (isLoading) {
    return <CoursesLoading />;
  }

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-red-500">
        {error instanceof Error ? error.message : 'فشل تحميل الكورسات'}
      </p>
      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        أعد المحاولة
      </button>
    </div>
  );

  return (
    <section className="w-full min-h-screen flex mt-20 flex-col gap-20 p-5 items-center justify-center">
      <h1 className="text-6xl font-bold text-center mt-10 mb-5 text-[#E5E5E5]">
        الكورسات الملتحق بها
      </h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {enrollments?.map((enrollment: Enrollment, i: number) => (
          <CourseComp
            key={enrollment.course.id}
            index={i}
            id={enrollment.course.id.toString()}
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
