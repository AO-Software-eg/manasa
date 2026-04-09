import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function CourseComp({ imageUrl }: { imageUrl: string | null }) {
  return (
    <div className="w-full flex flex-col text-right rounded-2xl bg-[#e6d3a3]/20 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] border border-[#e6d3a3]/20">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Course Image"
          width={500}
          height={350}
          className="w-full h-64 object-cover rounded-t-2xl brightness-90 hover:brightness-100 transition-all duration-300"
        />
      )}
      <div className="p-6 md:p-8 space-y-6 bg-[#e6d3a3]/10 backdrop-blur-md">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#e6d3a3] leading-tight">
          كورس الشهر الأول
        </h1>
        <h2 className="text-lg md:text-xl text-[#e6d3a3]/90 leading-relaxed mb-6">
          هذا الكورس مخصص لطلاب الثانوية العامة، ويغطي جميع المواضيع المتعلقة
          بالتاريخ المصري والعالمي. يتضمن الكورس دروس فيديو، ملخصات، وتمارين
          تفاعلية لمساعدتك على فهم المادة بشكل أفضل.
        </h2>
        <p className="text-2xl font-bold text-white mb-6">150 جنيه</p>
        <Link href={'/courses'}>
          <button className="w-full px-6 mb-5 py-4 rounded-xl text-xl font-semibold bg-[#e6d3a3] hover:bg-[#d4c38c] text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
            اشترك الآن
          </button>
        </Link>
        <div className="flex flex-wrap gap-3">
          <span className="bg-[#e6d3a3]/10 backdrop-blur-md text-[#e6d3a3] border border-[#e6d3a3]/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-[#e6d3a3]/20 hover:scale-105 transition-all duration-200">
            تاريخ مصري
          </span>
          <span className="bg-[#e6d3a3]/10 backdrop-blur-md text-[#e6d3a3] border border-[#e6d3a3]/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-[#e6d3a3]/20 hover:scale-105 transition-all duration-200">
            تاريخ عالمي
          </span>
          <span className="bg-[#e6d3a3]/10 backdrop-blur-md text-[#e6d3a3] border border-[#e6d3a3]/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-[#e6d3a3]/20 hover:scale-105 transition-all duration-200">
            ثانوية عامة
          </span>
        </div>
      </div>
    </div>
  );
}

export default CourseComp;
