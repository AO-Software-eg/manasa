'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const faqItems = [
  {
    question: 'هل المنصة تغطي منهج التاريخ بالكامل للثانوية العامة؟',
    answer: 'نعم، نوفر شرحاً تفصيلياً وافياً لكل فصول المنهج (مصر وتاريخ العرب الحديث، وتاريخ العالم المعاصر) مع ربط الأحداث ببعضها وخرائط ذهنية شاملة.',
  },
  {
    question: 'كيف يمكنني الاشتراك في الكورسات؟',
    answer: 'يمكنك إنشاء حساب مجاني بالكامل على المنصة، ثم تصفح الكورسات المتاحة واختيار الكورس المناسب لصفك الدراسي والاشتراك الفوري عبر وسائل الدفع الإلكترونية المتاحة.',
  },
  {
    question: 'هل توجد اختبارات دورية لمتابعة المستوى؟',
    answer: 'بالتأكيد، بعد كل محاضرة يوجد اختبار تفاعلي لقياس مدى فهمك، بالإضافة إلى امتحانات شاملة نهاية كل فصل مع تحليل فوري للأخطاء ونقاط الضعف لتفاديها.',
  },
  {
    question: 'هل يمكنني التواصل مع المعلم لحل استفساراتي؟',
    answer: 'نعم، توفر المنصة نظام أسئلة تفاعلي أسفل كل فيديو محاضرة، حيث يمكنك طرح أي سؤال وسيقوم فريق الدعم العلمي والمعلم بالرد الوافي عليك في أسرع وقت.',
  },
  {
    question: 'هل المحاضرات مسجلة أم بث مباشر؟',
    answer: 'جميع محاضرات الشرح الأساسية مسجلة ومرفوعة بأعلى جودة ليتسنى لك مشاهدتها ومراجعتها في أي وقت وبأي مكان، إلى جانب تنظيم حصص مراجعة دورية عبر البث المباشر قبل الامتحانات.',
  },
];

export default function Faq() {
  return (
    <section id="faq" className="w-full py-24 px-6 flex flex-col items-center bg-background border-t border-border">
      <div className="text-center max-w-3xl mb-16">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">الأسئلة الشائعة</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
          لديك أسئلة؟ لدينا إجابات
        </h3>
        <p className="text-muted-foreground text-base md:text-lg mt-4 max-w-xl mx-auto">
          كل ما تود معرفته عن منصة السلطان ونظام التعلم الذكي.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-border/70 py-3 last:border-b-0">
              <AccordionTrigger className="text-right text-base md:text-lg font-bold text-foreground hover:text-primary hover:no-underline transition-colors py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                  <span>{item.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-right text-sm md:text-base text-muted-foreground leading-relaxed pt-2 pb-4 pr-8">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
