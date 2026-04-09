'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const testimonialsStudents: Testimonial[] = [
  {
    quote:
      'أستاذ السلطان يجعل دروس التاريخ ممتعة ومثيرة! نجحت في الامتحان بدرجات عالية بفضله.',
    author: 'سارة أحمد',
    role: 'طالبة - أولى ثانوي',
  },
  {
    quote: 'شرح رائع ومبسط يغطي كل التفاصيل. أصبحت أحب مادة التاريخ حقاً!',
    author: 'محمد علي',
    role: 'طالب - ثانية ثانوي',
  },
  {
    quote: 'دروس تفاعلية تجعلك تشعر وكأنك تعيش الأحداث التاريخية. أفضل أستاذ!',
    author: 'فاطمة سالم',
    role: 'طالبة - ثالثة ثانوي',
  },
  {
    quote:
      'يساعدنا على فهم العلاقات بين الأحداث بطريقة منطقية. شكراً أستاذ السلطان!',
    author: 'عمر خالد',
    role: 'طالب - أولى ثانوي',
  },
  {
    quote: 'تمارين واختبارات ممتازة ساعدتني على التفوق في التقييمات الدورية.',
    author: 'نورا حسن',
    role: 'طالبة - ثانية ثانوي',
  },
  {
    quote: 'عاطفة حقيقية تجاه التاريخ تنتقل إلينا. منصة رائعة ومنظمة.',
    author: 'أحمد محمود',
    role: 'طالب - ثالثة ثانوي',
  },
];

interface MarqueeRowProps {
  testimonials: Testimonial[];
  reverse?: boolean;
  duration?: number;
}

function MarqueeRow({
  testimonials,
  reverse = false,
  duration = 40,
}: MarqueeRowProps) {
  const content = [...testimonials, ...testimonials, ...testimonials]; // for not cutting the animation

  return (
    <div
      className="relative flex overflow-hidden py-4"
      style={{ direction: 'ltr' }}
    >
      {/* Edge Fades */}
      <div className="absolute left-0 top-0 h-full w-24 md:w-32 bg-linear-to-r from-[#0d0d0d] to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 md:w-32 bg-linear-to-l from-[#0d0d0d] to-transparent z-20 pointer-events-none" />

      <motion.div
        className="flex flex-nowrap gap-6 pr-6"
        // FIXED: Only one animate prop.
        // We move -33.33% because the array is tripled; this resets the position
        // to the start of the next identical set of cards.
        animate={{ x: reverse ? ['-33.33%', '0%'] : ['0%', '-33.33%'] }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ willChange: 'transform' }}
      >
        {content.map((t, i) => (
          <div
            key={`${t.author}-${i}`}
            className="w-70 md:w-100 shrink-0 p-6 md:p-8 rounded-3xl border border-[#e6d3a3]/10 bg-[#e6d3a3]/5 backdrop-blur-sm text-right flex flex-col justify-between"
          >
            <p className="text-base md:text-xl italic mb-6 text-white/90 leading-relaxed">
              "{t.quote}"
            </p>
            <div>
              <div className="font-bold text-[#e6d3a3] text-sm md:text-base">
                {t.author}
              </div>
              <div className="text-[10px] md:text-xs text-[#e6d3a3]/40 mt-1 uppercase tracking-widest">
                {t.role}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="w-full py-20 bg-[#0d0d0d] overflow-hidden">
      <div className="max-w-400 mx-auto">
        <div className="flex flex-col gap-8 md:gap-12">
          <MarqueeRow testimonials={testimonialsStudents} duration={35} />
          <MarqueeRow
            testimonials={testimonialsStudents}
            reverse
            duration={45}
          />
        </div>
      </div>
    </section>
  );
}
