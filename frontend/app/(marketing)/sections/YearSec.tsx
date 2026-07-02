'use client';

import { useEffect, useRef } from 'react';
import { annotate } from 'rough-notation';
import YearBox from '../../components/YearBox';
import { ScrollArea, ScrollBar } from '../../../ui/scroll-area';

function YearSec() {
  return (
    <section
      className="w-full relative bg-background py-16 md:py-24 border-t border-border"
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground leading-tight">
          السنوات الدراسية
        </h3>

        <ScrollArea className="w-full lg:w-11/12 mx-auto rounded-2xl border border-border bg-card/45 shadow-lg transition-all duration-300">
          <div className="flex gap-6 md:gap-8 p-6 md:p-8 pb-6 md:pb-8">
            <div className="shrink-0">
              <YearBox year="الصف الأول الثانوي" link="g1" />
            </div>
            <div className="shrink-0">
              <YearBox year="الصف الثاني الثانوي" link="g2" />
            </div>
            <div className="shrink-0">
              <YearBox year="الصف الثالث الثانوي" link="g3" />
            </div>
          </div>

          <ScrollBar
            orientation="horizontal"
            className="[&_track]:bg-secondary/40 [&_thumb]:bg-primary/60 hover:[&_thumb]:bg-primary/85 h-2 rounded-full transition-all duration-200"
          />
        </ScrollArea>
      </div>
    </section>
  );
}

export default YearSec;