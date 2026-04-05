import React from 'react'
import CourseComp from '../components/CourseComp'


export default function Courses() {
  return (
    <section className='w-full min-h-screen flex mt-20 flex-col gap-20 p-5 items-center justify-center'> 
    <h1 className='text-6xl font-bold text-center mt-10 mb-5 text-[#E5E5E5]'>
        الكورسات
    </h1>
    <div className='w-full flex flex-col lg:flex-row items-center justify-center gap-10'>
        <CourseComp />
        <CourseComp />
        <CourseComp />
    </div>
    
    </section> 
  )
}


