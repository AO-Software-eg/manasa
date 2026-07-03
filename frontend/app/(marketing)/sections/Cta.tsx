'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { annotate } from 'rough-notation';
import { useMe } from '@/app/hooks/queries/useMe';

function Cta() {
  const { data: userData, isError } = useMe();
  const loggedIn = !isError && !!userData;
  const isLoggedIn = loggedIn === true;

  return (
    <section className="w-full py-24 px-6 flex flex-col items-center bg-background border-t border-border">
      <div className="w-full max-w-5xl px-8 py-16 rounded-3xl bg-secondary/40 border border-border flex flex-col items-center text-center gap-8 shadow-xs backdrop-blur-xs relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />

        <h3 className="text-3xl md:text-5xl font-bold text-foreground leading-tight max-w-3xl relative z-10">
          {isLoggedIn ? (
            <>
              استكمل رحلتك مع <span className="text-primary underline decoration-wavy decoration-primary/40 underline-offset-8">زملائك</span> في منصة السلطان
            </>
          ) : (
            <>
              انضم الآن إلى <span className="text-primary underline decoration-wavy decoration-primary/40 underline-offset-8">زملائك</span> في منصة السلطان
            </>
          )}
        </h3>

        <p className="text-muted-foreground text-sm md:text-base max-w-xl relative z-10">
          سجل حسابك مجاناً اليوم، وتصفح المحاضرات المجانية والمدفوعة، وتابع تحصيلك الدراسي خطوة بخطوة.
        </p>

        <Link href={isLoggedIn ? '/home/courses' : '/signup'} className="relative z-10 w-full sm:w-auto mt-2">
          <button className="w-full sm:w-auto px-10 py-4 rounded-xl text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/95 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            {isLoggedIn ? 'اذهب إلى الكورسات' : 'انشئ حسابك الآن مجاناً'}
          </button>
        </Link>
      </div>
    </section>
  );
}

export default Cta;