'use client';
import CardLayout from '@/app/components/CardLayout';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from './../../../hooks/useAuth';
import RecentActivityCard from '@/app/components/RecentActivityCard';
import { Span } from 'next/dist/trace';

const activityData = [
  {
    id: 1,
    text: 'سارة محمود أكملت اختبار الفلسفة بنجاح',
    time: 'منذ 5 دقائق',
  },
  {
    id: 2,
    text: 'طالب جديد انضم لكورس تاريخ مصر القديمة',
    time: 'منذ 10 دقائق',
  },
  {
    id: 3,
    text: 'ليلى عمر سجلت في كورس جديد',
    time: 'منذ ساعة',
  },
];

const popularCourses = [
  {
    id: 1,
    title: 'الفلسفة اليونانية: العقل والمنطق',
    lessons: 12,
    level: 'المستوى المتقدم',
    image: '/images/philosophy.png',
  },
  {
    id: 2,
    title: 'تاريخ مصر القديمة: عصر الأهرام',
    lessons: 30,
    level: 'المستوى المتوسط',
    image: '/images/pyramids.png',
  },
  {
    id: 3,
    title: 'الفلسفة اليونانية: العقل والمنطق',
    lessons: 12,
    level: 'المستوى المتقدم',
    image: '/images/philosophy.png',
  },
  {
    id: 4,
    title: 'تاريخ مصر القديمة: عصر الأهرام',
    lessons: 30,
    level: 'المستوى المتوسط',
    image: '/images/pyramids.png',
  },
];

export const dashboardData = {
  stats: [
    {
      id: 'revenue',
      title: 'الأرباح',
      value: '٢٠٠ ج.م',
      change: '+23%',
      icon: 'money',
      className: 'col-span-1',
    },
    {
      id: 'courses',
      title: 'عدد الكورسات',
      value: '٢٤',
      change: 'نشاطك',
      icon: 'courses',
      className: 'col-span-1',
    },
    {
      id: 'students',
      title: 'الطلاب',
      value: '١,٢٨٤',
      change: '+12%',
      icon: 'users',
      className: 'col-span-1',
    },
  ],

  activity: {
    id: 'activity',
    title: 'نشاط الطلاب الأخير',
    className: 'col-span-1 lg:col-span-1',
    items: [
      {
        id: 1,
        text: 'طالب جديد انضم إلى كورس الفيزياء',
        time: 'منذ 5 دقائق',
      },
      {
        id: 2,
        text: 'تم حل واجب كيمياء',
        time: 'منذ 10 دقائق',
      },
      {
        id: 3,
        text: 'تم مشاهدة درس جديد',
        time: 'منذ 30 دقيقة',
      },
    ],
  },

  courses: {
    id: 'coursesList',
    title: 'المقررات الأكثر تفاعلاً',
    className: 'col-span-1 lg:col-span-1',
    items: [
      {
        id: 1,
        title: 'الفلسفة اليونانية: العقل والمنطق',
        lessons: 10,
        students: 120,
        level: 'متوسط',
      },
      {
        id: 2,
        title: 'تاريخ مصر القديمة: عصر الأهرام',
        lessons: 12,
        students: 95,
        level: 'مبتدئ',
      },
    ],
  },
};

function page() {

  const { loggedIn, isLoading, userData } = useAuth();

  return (
    <div className="lg:grid flex flex-col lg:grid-cols-3  lg:col-span-3 gap-4 w-full">
      <CardLayout classname="col-span-1 lg:col-span-3 bg-linear-to-r from-[#1C1C18]/80 via-[#2a2a25]/80 to-[#3b3b34]/80 backdrop-blur-sm border-[#3b3b34]/50 text-transparent bg-clip-text">
        <h1 className="text-3xl font-bold">
            {
        loggedIn && userData ? ( 
          <span className='text-white'>
            مرحباً، <span className='text-[#e6d3a3]'> {userData.name} !</span>
          </span>
         ) : 'لوحة التحكم'
      }
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
            <h1 className="text-2xl font-semibold">المقررات الأكثر تفاعلاً</h1>

            <a className="flex flex-row-reverse items-center gap-1 hover:underline group cursor-pointer">
              <ChevronLeft className="group-hover:-translate-x-1 transition-all" />
              عرض الكل
            </a>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-4 max-h-80 overflow-y-scroll ">
            {popularCourses.map((course) => (
              <CardLayout
                key={course.id}
                classname="flex items-center  justify-between p-4 rounded-2xl bg-[#1a1a1a] hover:bg-[#222] transition"
              >
                {/* Right side (image) */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/30 flex items-center justify-center">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Middle content */}
                <div className="flex-1 px-4 text-right">
                  <h2 className="text-sm font-semibold leading-snug">
                    {course.title}
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    {course.lessons} حلقة مسجل - {course.level}
                  </p>
                </div>

                {/* Left arrow */}
                <div className="text-gray-400">
                  <ChevronLeft />
                </div>
              </CardLayout>
            ))}
          </div>
        </div>

        <RecentActivityCard title="نشاط الطلاب الأخير" items={activityData} />
      </div>
    </div>
  );
}

export default page;
