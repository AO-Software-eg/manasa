'use client';
import { useParams, useRouter } from 'next/navigation';
import { courses } from '@/types';
import BackButton from '@/app/components/BackBtn';
import { lecture } from '@/types';
import { useCourses } from '@/app/hooks/queries/useCourses';
import { useLectures } from '@/app/hooks/queries/useLectures';
import LoadingComp from '@/app/components/LoadingComp';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

  // ✅ hooks before any return
  const { data: courses, isLoading: coursesLoading, isError: coursesError } = useCourses();
  const { data: assets = [], isLoading: assetsLoading, isError: assetsError, refetch } = useLectures(courseId ?? '');

  if (!courseId) return null;

  if (coursesLoading || assetsLoading) return <LoadingComp />;

  if (coursesError || assetsError) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-red-500">حدث خطأ أثناء تحميل البيانات</p>
      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        إعادة المحاولة
      </button>
    </div>
  );

  const course = courses?.find((c: courses) => c.id === courseId);
  if (!course) return null;

  return (
    <div className="w-full min-h-screen p-5 md:p-8">
      <div className="max-w-4xl mx-auto mt-20">
        <div className="mb-12">
          <BackButton route="/" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#e6d3a3] text-right leading-tight">
            {course.title}
          </h1>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#E5E5E5] text-right mb-8">
            محتوى الكورس
          </h2>
          <div>
            {assets.length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                لا توجد مواد متاحة
              </p>
            ) : (
              assets.map((asset: lecture) => (
                <div key={asset.id}>
                  <h1>{asset.title}</h1>
                  <button
                    onClick={() =>
                      router.push(`/user/courses/${courseId}/videos/${asset.id}`)
                    }
                  >
                    video of {asset.title}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}