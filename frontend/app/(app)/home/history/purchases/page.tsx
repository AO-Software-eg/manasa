'use client';

import { useGetEnrollments } from '@/app/hooks/queries/useEnroll';
import { useMe } from '@/app/hooks/queries/useMe';

import { courses } from '@/types';


type Enrollment = {
  course: courses;
  createdAt: string;
};

export default function HistoryPage() {
  const {data: userData } = useMe()
  const { data: enrollments, isLoading, isError } = useGetEnrollments(userData?.id ?? '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        جاري تحميل سجل المشتريات...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        حدث خطأ أثناء تحميل السجل
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto p-6 mt-24">
      <h1 className="text-3xl font-bold mb-8 text-center">
        سجل المشتريات
      </h1>

      {!enrollments?.length ? (
        <div className="text-center text-gray-500">
          لا توجد أي كورسات تم شراؤها بعد
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment: Enrollment) => (
            <div
              key={enrollment.course.id}
              className="bg-black  dark:bg-zinc-900 rounded-xl shadow p-5 border"
            >
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    {enrollment.course?.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    تم شراء الكورس بتاريخ:
                  </p>

                  <p className="font-medium">
                    {new Date(
                      enrollment.createdAt
                    ).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  تم الاشتراك
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}