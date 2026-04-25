"use client";
import HeroSec from './sections/HeroSec';
const Lottie = lazy(() => import('lottie-react'));
import { lazy ,useEffect } from 'react';
 import { useAuth } from '../hooks/useAuth';
const Courses = lazy(() => import('./sections/Courses'));
const Testimonials = lazy(() => import('./sections/Testimonials'));
const YearSec = lazy(() => import('./sections/YearSec'));
const Cta = lazy(() => import('./sections/Cta'));
const WhyUs = lazy(() => import('./sections/WhyUs'));

export default function Home() {
  const { loggedIn, isLoading } = useAuth();

  // on loading go to top of the page
  useEffect(() => {
    if (isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full" >
        <Lottie
          animationData={require('@/public/Spinner.json')}
          loop
          autoplay
          style={{ width: 100, height: 100 }}
        />
      </div>
    )
  }
  return (
    <main className="flex min-h-screen relative overflow-x-clip flex-col items-center justify-between ">
      {!loggedIn && (
        <><HeroSec />
          <WhyUs />
          <Testimonials /></>
      )}
      <YearSec />
      <Courses />
      <Cta />
    </main>
  );
}
