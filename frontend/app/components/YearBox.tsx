import React from 'react';

type Props = {
  year: 'اولى ثانوي' | 'تانية ثانوي' | 'ثالثة ثانوي';
};

function YearBox({ year }: Props) {
  return (
    <div className="w-full sm:w-80 shrink-0 h-48 md:h-56 bg-[#e6d3a3]/10 hover:bg-[#e6d3a3]/20 text-[#e6d3a3] rounded-2xl flex items-center justify-center text-center p-6 md:p-8 border border-[#e6d3a3]/20 hover:border-[#e6d3a3]/40 hover:shadow-2xl hover:shadow-[#e6d3a3]/30 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 overflow-hidden backdrop-blur-md">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mx-auto leading-tight">
        {year}
      </h1>
    </div>
  );
}

export default YearBox;
