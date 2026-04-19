import HeroSec from './sections/HeroSec';
import { lazy } from 'react';
const Courses = lazy(() => import('./sections/Courses'));
const Testimonials = lazy(() => import('./sections/Testimonials'));
const YearSec = lazy(() => import('./sections/YearSec'));
const Cta = lazy(() => import('./sections/Cta'));
const WhyUs = lazy(() => import('./sections/WhyUs'));

export default function Home() {
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
