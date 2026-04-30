'use client'; // ✅ add this

import CourseImage from '@/app/components/CourseImg';
import BackButton from '@/app/components/BackBtn';
import ExpandableText from '@/app/components/EcalpsedTxt';
import Link from 'next/link';
import LoadingComp from '@/app/components/LoadingComp';
import { useCourseById } from '@/app/hooks/queries/useCourses';
import { useParams } from 'next/navigation'; 

export default function CoursePage() { 
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: course, isLoading, isError, refetch } = useCourseById(id ?? '');

  if (isLoading) return <LoadingComp />;

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-red-500">حدث خطأ أثناء تحميل الكورس</p>
      <button onClick={() => refetch()} className="px-4 py-2 bg-blue-500 text-white rounded">
        إعادة المحاولة
      </button>
    </div>
  );

  if (!course) return <h1>لم يتم العثور على الكورس</h1>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-row-reverse items-center justify-between">
        <BackButton route="/user/courses" />
        <h1 className="text-3xl font-bold my-4">{course.title}</h1>
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
  return (
    <div className="space-y-8 mt-12">
      <div className="bg-[#1C1C18] border-2 border-[#e6d3a3]/50 p-8 rounded-2xl flex flex-col items-center justify-center">
        <div className="relative  pt-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#e6d3a3]">
            المحتوى مقفل
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            قم بشراء الكورس للوصول إلى جميع الدروس والمواد
          </p>
          <div className="flex justify-center items-center w-full">
            <Link href={`/user/courses/${course.id}/data`}>
              <button className="px-12 py-4 mx-auto bg-[#e6d3a3]/20 hover:bg-[#e6d3a3]/30 border-2 border-[#e6d3a3] text-[#e6d3a3] font-bold text-lg rounded-full shadow-lg hover:shadow-[#e6d3a3]/25 transform hover:scale-105 transition-all">
                شراء الكورس
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
