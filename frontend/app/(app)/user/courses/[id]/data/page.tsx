'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/app/hooks/api';
import BackButton from '@/app/components/BackBtn';
import { lecture } from '@/types';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const courseId = params.id;
  const course = courses.find((c) => c.id === courseId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assets, setAssets] = useState<lecture[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      if (!course) return;
      try {
        const res = await api.get(`/courses/${course.id}/lectures`);
        setAssets(res.data.data || []);
        console.log('res :', res.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, [course]);

  if (!course) {
    return null;
  }

  return (
    <div className="w-full min-h-screen p-5 md:p-8">
      <div className="max-w-4xl mx-auto mt-20">
        {/* Header Section */}
        <div className="mb-12">
          <BackButton route="/" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#e6d3a3] text-right leading-tight">
            {course.title}
          </h1>
        </div>

        {/* Course Assets Section */}
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
              assets.map((asset: any) => (
                <div key={asset.id}>
                  <h1>{asset.title}</h1>
                  <button
                    onClick={() =>
                      router.push(
                        `/user/courses/${courseId}/videos/${asset.id}`,
                      )
                    }
                  >
                    video of {asset.title}
                  </button>
                </div>
              ))
            )}
          </div>
          {/* <CourseAssetAccordion assets={'l'} /> */}
        </div>
      </div>
    </div>
  );
}
