'use client';
import CourseComp from '../../components/CourseComp';
import { useCourses } from '../../hooks/useCourses';
import CoursesLoading from '@/app/components/CoursesLoading';

export default function Courses() {
  const { courses, loading } = useCourses();

  if (loading) {
    return <CoursesLoading />;
  }

  return (
    <section className="w-full min-h-screen flex mt-20 flex-col gap-20 p-5 items-center justify-center">
      <h1 className="text-6xl font-bold text-center mt-10 mb-5 text-[#E5E5E5]">
        الكورسات
      </h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {courses && courses.map((course) => (
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
