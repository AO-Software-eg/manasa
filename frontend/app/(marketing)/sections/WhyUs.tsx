'use client';

import React, { useEffect, useRef } from 'react';
import {
  BookOpen,
  Headphones,
  DollarSign,
  RefreshCcw,
  Sparkles,
  Users,
  Target,
} from 'lucide-react';
import { annotate } from 'rough-notation';

const reasons = [
  {
    title: 'محتوى عالي الجودة',
    description:
      'نقدم محتوى تعليمي عالي الجودة يغطي جميع المواضيع المتعلقة بالتاريخ المصري والعالمي.',
    icon: BookOpen,
  },
  {
    title: 'دعم مستمر',
    description: 'فريق الدعم متاح دائمًا لمساعدتك في أي استفسار أو مشكلة.',
    icon: Headphones,
  },
  {
    title: 'أسعار مناسبة',
    description: 'خطط أسعار مرنة تناسب جميع الطلاب.',
    icon: DollarSign,
  },
  {
    title: 'محتوى محدث',
    description: 'نقوم بتحديث المحتوى باستمرار لضمان أحدث المعلومات.',
    icon: RefreshCcw,
  },
  {
    title: 'تعلم تفاعلي',
    description: 'فيديوهات وتمارين تفاعلية لتجربة تعلم ممتعة.',
    icon: Sparkles,
  },
  {
    title: 'مجتمع داعم',
    description: 'تواصل مع طلاب آخرين وشارك المعرفة.',
    icon: Users,
  },
  {
    title: 'توجيه شخصي',
    description: 'نساعدك بخطة مخصصة لتحقيق أهدافك.',
    icon: Target,
  },
];

function WhyUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !descRef.current) return;

    const titleAnnotation = annotate(titleRef.current, {
      type: 'underline',
      color: '#e6d3a3',
      strokeWidth: 3,
    });

    const descAnnotation = annotate(descRef.current, {
      type: 'highlight',
      color: '#e6d3a3',
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          titleAnnotation.show();
          setTimeout(() => descAnnotation.show(), 300); // sequence
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
      className="w-full py-24 px-6 flex flex-col items-center"
    >
      {/* Title */}
      <div className="text-center max-w-2xl mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          لماذا{' '}
          <span ref={titleRef}>تختارنا؟</span>
        </h1>

        <p className="text-white/70 text-lg mt-10">
          منصة تعليمية{' '}
          <span ref={descRef}>
            متكاملة تساعدك على فهم التاريخ بطريقة حديثة وفعالة
          </span>{' '}
          ، مع دعم مستمر ومحتوى عالي الجودة يناسب جميع المستويات.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {reasons.map((reason, index) => {
          const Icon = reason.icon;
          return (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 
              hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#e6d3a3]/20 mb-4">
                <Icon className="text-[#e6d3a3]" size={24} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {reason.title}
              </h3>

              <p className="text-gray-400 leading-relaxed text-sm">
                {reason.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WhyUs;