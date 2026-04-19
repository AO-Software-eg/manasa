'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CourseAssetAccordion, {
  CourseAsset,
} from '@/app/components/CourseAssetAccordion';
import { courses } from '@/data/courses';
import BackButton from '@/app/components/BackBtn';

interface CourseData {
  id: string;
  title: string;
  assets: CourseAsset[];
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('معرف الكورس غير صحيح');
      setLoading(false);
      return;
    }

    // Verify that the course exists
    const courseExists = courses.find((c) => c.id === courseId);
    if (!courseExists) {
      setError('الكورس غير موجود');
      setLoading(false);
      return;
    }

    // Mock course assets data - In production, this would come from your API
    const courseAssets: CourseAsset[] = [
      {
        id: '1',
        title: 'الحصة الأولى',
        type: 'lesson',
        duration: '45 دقيقة',
        description: 'مقدمة عن موضوع الدرس الأول وأهم المفاهيم الأساسية',
        content:
          'يتناول هذا الدرس الأساسيات المهمة التي ستحتاجها في هذا الكورس. سنغطي المفاهيم الأساسية والمصطلحات الرئيسية.',
        videoUrl: `/user/courses/${courseId}/videos/1`,
      },
      {
        id: '2',
        title: 'واجب الحصة الأولى',
        type: 'homework',
        description: 'مجموعة من الأسئلة التفاعلية لتقييم فهمك للمادة',
        fileUrl: '#',
      },
      {
        id: '3',
        title: 'ملف الحصة الأولى',
        type: 'file',
        description: 'الملخص الشامل والقطع الرسومية التوضيحية',
        fileUrl: '#',
      },
      {
        id: '4',
        title: 'الحصة الثانية',
        type: 'lesson',
        duration: '50 دقيقة',
        description: 'تطبيق عملي للمفاهيم التي تم تعلمها في الحصة الأولى',
        content:
          'في هذا الدرس سنطبق ما تعلمناه عمليًا من خلال أمثلة واقعية وتمارين تفاعلية.',
        videoUrl: `/user/courses/${courseId}/videos/2`,
      },
      {
        id: '5',
        title: 'واجب الحصة الثانية',
        type: 'homework',
        description: 'تمارين متقدمة لاختبار استيعابك العملي',
        fileUrl: '#',
      },
      {
        id: '6',
        title: 'ملف الحصة الثانية',
        type: 'file',
        description: 'الموارد الإضافية والروابط المرجعية',
        fileUrl: '#',
      },
    ];

    setCourse({
      id: courseId,
      title: courseExists.title,
      assets: courseAssets,
    });
    setLoading(false);
  }, [courseId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center ">
        <div className="text-[#e6d3a3] text-2xl">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6  p-5">
        <div className="text-[#e6d3a3] text-2xl text-center">{error}</div>
        <button
          onClick={() => router.push('/user/courses')}
          className="px-8 py-3 bg-[#e6d3a3] hover:bg-[#d4c38c] text-white rounded-lg font-semibold transition-colors duration-200"
        >
          العودة إلى الكورسات
        </button>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="w-full min-h-screen p-5 md:p-8">
      <div className="max-w-4xl mx-auto mt-20">
        {/* Header Section */}
        <div className="mb-12">
          <BackButton />
          <h1 className="text-4xl md:text-5xl font-bold text-[#e6d3a3] text-right leading-tight">
            {course.title}
          </h1>
        </div>

        {/* Course Assets Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#E5E5E5] text-right mb-8">
            محتوى الكورس
          </h2>
          <CourseAssetAccordion assets={course.assets} />
        </div>
      </div>
    </div>
  );
}
