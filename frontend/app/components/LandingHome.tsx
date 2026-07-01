'use client';

import { lazy } from 'react';
import HeroSec from '../(marketing)/sections/HeroSec';

const Courses = lazy(() => import('../(marketing)/sections/Courses'));
const Testimonials = lazy(() => import('../(marketing)/sections/Testimonials'));
const YearSec = lazy(() => import('../(marketing)/sections/YearSec'));
const Faq = lazy(() => import('../(marketing)/sections/Faq'));
const Cta = lazy(() => import('../(marketing)/sections/Cta'));
const WhyUs = lazy(() => import('../(marketing)/sections/WhyUs'));

export default function LandingHome() {
  return (
    <main className="w-full flex flex-col items-center justify-between">
      <HeroSec />
      <WhyUs />
      <Testimonials />
      <YearSec />
      <Courses />
      <Faq />
      <Cta />
    </main>
  );
}
