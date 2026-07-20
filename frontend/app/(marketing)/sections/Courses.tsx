'use client';
import CourseComp from '../../components/CourseComp';
import { useCourses } from '../../hooks/queries/useCourses';
import CoursesLoading from '@/app/components/CoursesLoading';
import { courses } from '@/types';
import { useMe } from '@/app/hooks/queries/useMe';
import { useGetEnrollments } from '@/app/hooks/queries/useEnroll';
import { Enrollment } from '@/types';
import { useEffect, useState } from 'react';

export default function Courses() {
  const { data: courses, isLoading, isError, error, refetch } = useCourses();
  const { data: userData } = useMe();
  const [search, setSearch] = useState('');

  const {
    data: enrollments,
    isLoading: enrollLoading,
    isError: enrollError,
  } = useGetEnrollments(userData?.id?.toString() ?? '');

  const enrolledCourseIds = new Set<number>(
    enrollments?.map((e: Enrollment) => Number(e.course.id)) ?? [],
  );

  console.log(enrollError, enrolledCourseIds);

  const filteredCourses = courses?.filter((course: courses) =>
    course.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return <CoursesLoading />;
  }

  if (isError)
    return (
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
    <section
      id="courses"
      className="w-full py-24 px-6 flex flex-col items-center bg-background border-t border-border"
    >
      <div className="text-center max-w-3xl mb-18">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
          دوراتنا الدراسية
        </h2>
        <h3 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
          تصفح الكورسات المتاحة
        </h3>
        <p className="text-muted-foreground text-base md:text-lg mt-4 max-w-xl mx-auto">
          اختر الصف الدراسي الخاص بك وابدأ رحلتك التعليمية فوراً مع نخبة من أفضل
          الشروح التعليمية.
        </p>
        <input
          type="text"
          placeholder="ابحث عن كورس..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md my-8 rounded-lg border px-4 py-2"
        />
      </div>

      <div className="w-full max-w-5xl mx-auto">
        {filteredCourses && filteredCourses.length < 1 ? (
          <div className=" items-center justify-center ">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-muted-foreground mt-10 mb-5">
              لا يوجد أي كورسات بهذا الاسم
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            {filteredCourses.map((course: courses, i: number) => (
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
        )}
      </div>
    </section>
  );
}
