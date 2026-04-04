import React from 'react'
import Image from "next/image";
function CourseComp() {
    return (
        <div className='w-full flex flex-col text-right rounded bg-[#3b3b34]  '>
            <Image src="/course-image.jpg" alt="Course Image" width={200} height={250} />
            <div className='p-5'>
                <h1 className='text-4xl font-bold  mt-10 mb-5 text-[#E5E5E5]'>
                    كورس الشهر الأول
                </h1>
                <h2 className='text-md '>
                    هذا الكورس مخصص لطلاب الثانوية العامة، ويغطي جميع المواضيع المتعلقة بالتاريخ المصري والعالمي. يتضمن الكورس دروس فيديو، ملخصات، وتمارين تفاعلية لمساعدتك على فهم المادة بشكل أفضل.
                </h2>
                <p className=''>
                    150 جنيه
                </p>
                <button className='px-4 cursor-pointer py-2 rounded-lg text-sm bg-[#5a5a52] transition w-full mt-5 '>
                    اشترك الآن
                </button>
                <div className='tags flex gap-2 mt-5 '>
                    <span className='bg-[#E5E5E5] px-2 py-1 rounded'>تاريخ مصري</span>
                    <span className='bg-[#E5E5E5] px-2 py-1 rounded'>تاريخ عالمي</span>
                    <span className='bg-[#E5E5E5] px-2 py-1 rounded'>ثانوية عامة</span>
                </div>
            </div>
        </div>
    )
}

export default CourseComp
