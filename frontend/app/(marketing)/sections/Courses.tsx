'use client';
import CourseComp from '../../components/CourseComp';
import { useCourses } from '../../hooks/queries/useCourses';
import CoursesLoading from '@/app/components/CoursesLoading';
import { courses } from '@/types'
import { useMe } from '@/app/hooks/queries/useMe';
import { useGetEnrollments } from '@/app/hooks/queries/useEnroll';
import { Enrollment } from '@/types';


export default function Courses() {
  const { data: courses, isLoading, isError, error, refetch } = useCourses();
  const { data: userData } = useMe();


  const { data: enrollments, isLoading: enrollLoading, isError: enrollError } = useGetEnrollments(userData?.id?.toString() ?? '');

  const enrolledCourseIds = new Set<number>(
    enrollments?.map((e: Enrollment) => Number(e.course.id)) ?? []
  )

  console.log(
    enrollError,
    enrolledCourseIds
  )

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
        الكورسات
      </h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {courses && courses.map((course: courses, i: number) => (
          <CourseComp
            key={course.id}
            enrolledCourseIds={enrolledCourseIds}
            index={i}
            id={course.id}
            title={course.title}
            description={course.description}
            price={course.price}
            imageUrl={course.imageUrl}
            userData={userData}
            isPriority={i < 3}
            progress={100}
          />
        ))}
      </div>
    </section>
  );
}
