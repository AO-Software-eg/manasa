'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, GraduationCap, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

function HeroSec() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-screen overflow-hidden flex flex-col items-center justify-center pt-24 pb-12 px-6">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-30 z-0 pointer-events-none" />

      {/* LEFT EGYPTIAN ARTWORK */}
      <motion.div
        initial={{ x: -80, rotate: -6, opacity: 0 }}
        animate={{ x: 0, rotate: -2, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block absolute left-[-80px] lg:left-[-30px] bottom-[-20px] w-[350px] lg:w-[450px] h-[75%] z-0 select-none pointer-events-none"
      >
        <Image
          src="https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dp1shd90KwUDA5opdgTfPIL06ybWnh9ZEjYKxQ"
          alt="Statue Silhouette Left"
          fill
          sizes="350px"
          className="object-contain object-bottom opacity-15 dark:opacity-35 transition-opacity duration-500"
          priority
        />
      </motion.div>

      {/* RIGHT EGYPTIAN ARTWORK */}
      <motion.div
        initial={{ x: 80, rotate: 6, opacity: 0 }}
        animate={{ x: 0, rotate: 2, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="hidden md:block absolute right-[-80px] lg:right-[-30px] bottom-[-20px] w-[350px] lg:w-[450px] h-[75%] z-0 select-none pointer-events-none"
      >
        <Image
          src="https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dp6oypcPXLHlyXdUMO8LsW2ihoY0mfVAbF6G3j"
          alt="Obelisk Silhouette Right"
          fill
          sizes="350px"
          className="object-contain object-bottom opacity-20 dark:opacity-40 transition-opacity duration-500"
          priority
        />
      </motion.div>

      {/* CENTER CONTENT */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto flex-1 mt-6 lg:mt-12"
      >
        {/* Sub-badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-secondary/80 text-primary text-xs md:text-sm font-semibold mb-6 shadow-xs backdrop-blur-xs"
        >
          <GraduationCap className="h-4 w-4" />
          <span>رحلتك نحو الدرجة النهائية في التاريخ تبدأ هنا</span>
        </motion.div>

        {/* Brand Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold mb-4 font-sans tracking-tight text-foreground leading-tight"
        >
          منصة السلطان
        </motion.h1>

        {/* Subject Subheading */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-5xl font-semibold mb-6 text-primary tracking-wide"
        >
          في مادة التاريخ
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8 font-sans font-medium"
        >
          نقدم تجربة تعليمية فريدة ومبسطة لطلاب الثانوية العامة، تجمع بين الشرح التفصيلي، والربط التحليلي للأحداث، ومتابعة الأداء الذكية لتضمن تفوقك الأكاديمي.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center mb-16"
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-8 py-6 text-base bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md duration-300 gap-2 cursor-pointer group">
              ابدأ الآن مجاناً
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>
          <Link href="/courses" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto px-8 py-6 text-base border-border text-foreground hover:bg-secondary font-semibold rounded-xl transition-all duration-300 cursor-pointer">
              تصفح الكورسات
            </Button>
          </Link>
        </motion.div>

        {/* Quick Stats Grid - Minimal and elegant */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-6 md:gap-12 py-6 border-y border-border/80 w-full max-w-2xl mx-auto text-center"
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-primary mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xl md:text-2xl font-bold font-sans">١٠,٠٠٠+</span>
            </div>
            <span className="text-[11px] md:text-xs text-muted-foreground font-medium">طالب مسجل</span>
          </div>

          <div className="flex flex-col items-center border-x border-border/80">
            <div className="flex items-center gap-1.5 text-primary mb-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-xl md:text-2xl font-bold font-sans">٥٠٠+</span>
            </div>
            <span className="text-[11px] md:text-xs text-muted-foreground font-medium">محاضرة تفاعلية</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-primary mb-1">
              <Award className="h-4 w-4" />
              <span className="text-xl md:text-2xl font-bold font-sans">٩٨٪</span>
            </div>
            <span className="text-[11px] md:text-xs text-muted-foreground font-medium font-sans">نسبة النجاح والتفوق</span>
          </div>
        </motion.div>
      </motion.div>

      {/* CSS Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 opacity-70">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">اسحب لأسفل</span>
        <div className="w-5 h-8 border-2 border-muted-foreground/60 rounded-full p-1 flex justify-center">
          <motion.div 
            animate={{ 
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1 h-2 bg-primary rounded-full" 
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSec;
