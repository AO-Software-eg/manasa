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
      <div className="absolute left-0 top-0 h-full w-24 md:w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 md:w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

      <motion.div
        className="flex flex-nowrap gap-6 pr-6"
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
            className="w-70 md:w-100 shrink-0 p-6 md:p-8 rounded-3xl border border-border bg-card shadow-xs text-right flex flex-col justify-between"
          >
            <p className="text-base md:text-lg italic mb-6 text-foreground/90 leading-relaxed font-sans font-medium">
              "{t.quote}"
            </p>
            <div>
              <div className="font-bold text-primary text-sm md:text-base">
                {t.author}
              </div>
              <div className="text-[10px] md:text-xs text-muted-foreground mt-1 uppercase tracking-widest">
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
    <section className="w-full py-24 bg-background border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">آراء الطلاب</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
          ماذا يقول طلاب السلطان؟
        </h3>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mt-4">
          قصص نجاح وتفوق حقيقية لطلابنا في امتحانات التاريخ للثانوية العامة.
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-6 md:gap-8">
          <MarqueeRow testimonials={testimonialsStudents} duration={40} />
          <MarqueeRow
            testimonials={testimonialsStudents}
            reverse
            duration={50}
          />
        </div>
      </div>
    </section>
  );
}
