'use client';

import React from 'react';
import {
  BookOpen,
  Headphones,
  DollarSign,
  RefreshCcw,
  Sparkles,
  Users,
  Target,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const reasons = [
  {
    title: 'محتوى عالي الجودة',
    description:
      'نقدم محتوى تعليمي عالي الجودة يغطي جميع المواضيع المتعلقة بالتاريخ المصري والعالمي.',
    icon: BookOpen,
  },
  {
    title: 'دعم مستمر متواصل',
    description: 'فريق الدعم متاح دائمًا لمساعدتك في أي استفسار أو مشكلة تواجهك.',
    icon: Headphones,
  },
  {
    title: 'أسعار مناسبة للجميع',
    description: 'خطط أسعار مرنة واشتراكات مناسبة لجميع الطلاب بجميع المراحل.',
    icon: DollarSign,
  },
  {
    title: 'محتوى محدث باستمرار',
    description: 'نقوم بتحديث المحتوى باستمرار لضمان مواكبة أحدث نظم الامتحانات والتقييم.',
    icon: RefreshCcw,
  },
  {
    title: 'تعلم تفاعلي ذكي',
    description: 'فيديوهات شرح وتمارين تفاعلية تجعل تجربة التعلم ممتعة وسهلة الفهم.',
    icon: Sparkles,
  },
  {
    title: 'مجتمع طلابي متكامل',
    description: 'تواصل مع زملائك وشارك المعرفة والاستفسارات في مساحات نقاش مخصصة.',
    icon: Users,
  },
];

function WhyUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="features"
      className="relative w-full py-24 px-6 flex flex-col items-center border-t border-border bg-background"
    >
      {/* Title / Header */}
      <div className="text-center max-w-3xl mb-16">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">ميزات المنصة</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight">
          لماذا تختار منصة السلطان؟
        </h3>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          منصة تعليمية متكاملة تساعدك على فهم مادة التاريخ بطريقة حديثة ومبتكرة، بعيداً عن الحفظ التقليدي وبأعلى درجات الكفاءة.
        </p>
      </div>

      {/* Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full"
      >
        {reasons.map((reason, index) => {
          const Icon = reason.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative bg-card text-foreground border border-border hover:border-primary/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon size={22} className="transition-transform duration-300" />
                </div>

                <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {reason.title}
                </h4>

                <p className="text-muted-foreground leading-relaxed text-sm">
                  {reason.description}
                </p>
              </div>

              <div className="flex justify-end mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight size={18} className="text-primary" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

export default WhyUs;
