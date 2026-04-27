'use client';
import HeroSec from '../(marketing)/sections/HeroSec';
const Lottie = lazy(() => import('lottie-react'));
import { lazy, useEffect } from 'react';

const Courses = lazy(() => import('../(marketing)/sections/Courses'));
const Testimonials = lazy(() => import('../(marketing)/sections/Testimonials'));
const YearSec = lazy(() => import('../(marketing)/sections/YearSec'));
const Cta = lazy(() => import('../(marketing)/sections/Cta'));
const WhyUs = lazy(() => import('../(marketing)/sections/WhyUs'));

export default function LandingHome() {
  return (
    <main className="flex min-h-screen relative overflow-x-clip flex-col items-center justify-between ">
      <HeroSec />
      <WhyUs />
      <Testimonials />
      <YearSec />
      <Courses />
      <Cta />
    </main>
  );
}
