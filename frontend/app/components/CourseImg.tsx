'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from './../hooks/api';

export default function CourseImage({ title }: { title: string }) {
  const [courseImg, setCourseImg] = useState<string | null>(null);

  useEffect(() => {
    async function getCourseImg() {
      try {
        const res = await api.get('/images/course_image');

        if (res.data.imageUrl) {
          setCourseImg(res.data.imageUrl);
        } else {
          setCourseImg(null);
        }
      } catch (err) {
        console.error(err);
        setCourseImg(null);
      }
    }

    getCourseImg();
  }, []);
  return (
    <Image
      src={courseImg ? courseImg : '/default-course-image.jpg'}
      alt={title}
      width={600}
      height={400}
      className="w-full h-64 object-cover rounded-t-2xl"
    />
  );
}
