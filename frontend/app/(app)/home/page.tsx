'use client';
import CardLayout from '@/app/components/CardLayout';
import { ChevronLeft } from 'lucide-react';
import { useMe } from '@/app/hooks/queries/useMe';
import { useGetEnrollments } from '@/app/hooks/queries/useEnroll';
import RecentActivityCard from '@/app/components/RecentActivityCard';
import { courses } from '@/types';
import Link from 'next/link';




type Enrollment = {
  course: courses;
};


function page() {
  const { data: userData } = useMe();
  const { data: subscribedCourses } = useGetEnrollments(userData?.id ?? '');


  const dashboardData = {
    stats: [
      {
        id: 'progress',
        title: 'نسبة التقدم',
        value: '٦٨٪',
        change: '+5%',
        icon: 'progress',
        className: 'col-span-1',
      },
      {
        id: 'courses',
        title: 'الكورسات المسجلة',
        value: `${subscribedCourses?.length}`,
        change: 'نشاطك',
        icon: 'courses',
        className: 'col-span-1',
      },
      {
        id: 'certificates',
        title: 'الشهادات المكتسبة',
        value: '٣',
        change: '+١ جديدة',
        icon: 'certificate',
        className: 'col-span-1',
      },
    ],
  };



  return (
    <div className="lg:grid flex flex-col lg:grid-cols-3  lg:col-span-3 gap-4 w-full">
      <CardLayout classname="col-span-1 lg:col-span-3 bg-linear-to-r from-[#1C1C18]/80 via-[#2a2a25]/80 to-[#3b3b34]/80  border-[#3b3b34]/50 text-transparent bg-clip-text">
        <h1 className="text-3xl font-bold">
          {userData ? (
            <span className="text-white">
              مرحباً، <span className="text-[#e6d3a3]"> {userData.name} !</span>
            </span>
          ) : (
            'لوحة التحكم'
          )}
        </h1>
      </CardLayout>
      {dashboardData.stats.map((card) => (
        <CardLayout key={card.id}>
          <p>{card.title}</p>
          <h2>{card.value}</h2>
          <span>{card.change}</span>
        </CardLayout>
      ))}

      <div className="grid grid-cols-1 lg:grid-cols-3 col-span-3 gap-4 w-full">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">كورساتي المسجل بها</h1>

            <Link href={`/home/mycourses`} className="flex flex-row-reverse items-center gap-1 hover:underline group cursor-pointer">
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              عرض الكل
            </Link>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-4 max-h-80 overflow-y-scroll ">
            {subscribedCourses?.map((enrollment: Enrollment, i: number) => (
              <Link key={enrollment.course.id} href={`/home/courses/${enrollment.course.id}`}>
                <CardLayout
                  
                  classname="flex items-center  justify-between p-4 rounded-2xl bg-[#1a1a1a] hover:bg-[#222] transition"
                >
                  {/* Right side (image) */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/30 flex items-center justify-center">
                    <img
                      src={enrollment.course.imageUrl}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Middle content */}
                  <div className="flex-1 px-4 text-right">
                    <h2 className="text-sm font-semibold leading-snug">
                      {enrollment.course.title}
                    </h2>

                  </div>

                  {/* Left arrow */}
                  <div className="text-gray-400">
                    <ChevronLeft />
                  </div>
                </CardLayout>
              </Link>
            ))}
          </div>
        </div>

        <RecentActivityCard title="" />
      </div>
    </div>
  );
}

export default page;