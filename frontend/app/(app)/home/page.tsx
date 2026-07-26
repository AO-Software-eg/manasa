'use client';
import LearningJourney from '@/app/components/LearningJourney';
import { useGetEnrollments } from '@/app/hooks/queries/useEnroll';
import { useMe } from '@/app/hooks/queries/useMe';
import CardLayout from '@/app/components/CardLayout';
import { ChevronLeft } from 'lucide-react';
import { courses } from '@manasa/shared';
import Link from 'next/link';

type Enrollment = {
  course: courses;
};

export default function page() {
  const { data: userData } = useMe();
  const { data: subscribedCourses } = useGetEnrollments();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 col-span-1 gap-4 w-full p-4">
      <LearningJourney
        certificatesCount={3}
        certificatesChange="+١ جديدة"
        coursesCount={subscribedCourses?.length ?? 0}
        progressPercent={68}
      />
      <div className="flex flex-col gap-6 lg:col-span-1">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">كورساتي المسجل بها</h1>

          <Link
            href={`/home/mycourses`}
            className="flex flex-row-reverse items-center gap-1 hover:underline group cursor-pointer"
          >
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            عرض الكل
          </Link>
        </div>
        <div className="flex flex-row gap-4 max-h-80 overflow-x-scroll">
          {subscribedCourses?.length > 0 ? (
            subscribedCourses?.map((enrollment: Enrollment) => (
              <Link
                key={enrollment.course.id}
                href={`/home/courses/${enrollment.course.id}`}
              >
                <CardLayout classname="flex flex-col items-center justify-between p-4 rounded-2xl bg-card hover:bg-secondary/80 transition">
                  {/* Right side (image) */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-card/70 flex items-center justify-center">
                    <img
                      src={enrollment.course.imageUrl}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Middle content */}
                  <div className="px-4 text-right flex items-center justify-center">
                    <h2 className="text-sm font-semibold leading-snug">
                      {enrollment.course.title}
                    </h2>
                    <div className="text-muted-foreground">
                      <ChevronLeft />
                    </div>
                  </div>
                </CardLayout>
              </Link>
            ))
          ) : (
            <div className="w-full text-center flex items-center justify-center flex-col gap-10 bg-secondary/80 px-2 py-4">
              <h1 className="text-2xl font-semibold">
                لم يتم الاشتراك في أي كورس
              </h1>
              <Link
                href={`/home/courses`}
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                الذهاب لشراء الكورسات
              </Link>
            </div>
          )}
        </div>
      </div>{' '}
    </div>
  );
}
