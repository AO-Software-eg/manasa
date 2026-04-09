'use client';

import React, { useEffect, useState } from 'react'
import CourseComp from '../components/CourseComp'


export default function Courses() {
  const [courseImg, setCourseImg] = useState<string | null>(null);

  useEffect(() => {
    async function getCourseImg() {
      try {
          const response = await fetch("http://localhost:5000/images/course_image");
          const data = await response.json();

          if (data["imageUrl"]) {
            setCourseImg(data["imageUrl"]);
          }
          else {
            setCourseImg(null);
          }
      } 
      catch (err) {
          console.error(err);
      }
    }

    getCourseImg();
  });

  return (
    <section className='w-full min-h-screen flex mt-20 flex-col gap-20 p-5 items-center justify-center'> 
    <h1 className='text-6xl font-bold text-center mt-10 mb-5 text-[#E5E5E5]'>
        الكورسات
    </h1>
    <div className='w-full flex flex-col lg:flex-row items-center justify-center gap-10'>
        <CourseComp imageUrl={courseImg}/>
        <CourseComp imageUrl={courseImg}/>
        <CourseComp imageUrl={courseImg}/>
    </div>
    
    </section> 
  )
}


