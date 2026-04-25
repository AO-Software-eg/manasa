'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { annotate } from 'rough-notation';

function Cta() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const annotation = annotate(textRef.current, {
      type: 'highlight',
      color: '#e6d3a3',
      padding: 4,
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          annotation.show();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-[80%] min-h-fit flex mt-20 flex-col gap-20 p-8 rounded-4xl items-center justify-center bg-[#e6d3a3]/10"
    >
      <h1 className="text-5xl md:text-6xl font-bold text-center mt-10 mb-5 text-[#E5E5E5] leading-tight">
        انضم الآن إلى{' '}
        <span ref={textRef}>زملائك</span>{' '}
        في منصة السلطان
      </h1>

      <Link href={'/signup'}>
        <button className="w-full px-6 mb-5 py-4 rounded-xl text-xl font-semibold bg-[#e6d3a3] hover:bg-[#d4c38c] text-[#1C1C18] shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer max-w-md mx-auto">
          انشئ حسابك الآن !
        </button>
      </Link>
    </section>
  );
}

export default Cta;