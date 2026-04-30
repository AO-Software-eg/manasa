'use client';
import CourseComp from '../../components/CourseComp';
import { useCourses } from '../../hooks/queries/useCourses';
import CoursesLoading from '@/app/components/CoursesLoading';
import {courses} from '@/types' 

export default function Courses() {
  const {data: courses, isLoading, isError, error , refetch} = useCourses();

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
        {courses && courses.map((course: courses) => (
          <CourseComp
            key={course.id}
            id={course.id}
            title={course.title}
            description={course.description}
            price={course.price}
            imageUrl={course.image_url}
          />
        ))}
      </div>
    </section>
  );
}
