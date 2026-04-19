import WhyUs from './sections/WhyUs';
import HeroSec from './sections/HeroSec';
import YearSec from './sections/YearSec';

import Cta from './sections/Cta';
import Testimonials from './sections/Testimonials';
import { lazy } from 'react';
const Courses = lazy(() => import('./sections/Courses'));

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
