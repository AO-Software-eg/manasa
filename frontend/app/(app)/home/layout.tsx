'use client';

import SideNav from '../../components/SideNav';
import '../../globals.css';
import { Cairo } from 'next/font/google';
import Script from 'next/script';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isExamPage = pathname.includes('/exams/');

  return (
    <div
      className={`${isExamPage ? '' : 'min-h-screen flex'}  bg-[#0d0d0d] text-white ${cairo.className}`}
    >
      {!isExamPage && (
        <>
          <SideNav collapsed={collapsed} setCollapsed={setCollapsed} />
          {/* <Chatbot /> */}
        </>
      )}

        {/* Main */}
        <main
          className={`${isExamPage ? '' : 'flex-1  mt-16 p-4 lg:h-[calc(102dvh-5rem)] lg:overflow-y-auto overflow-x-hidden'}`}
        >
          {children}

        <Script
          src="https://player.vdocipher.com/v2/api.js"
          strategy="afterInteractive"
        />
        </main>
    
    </div>
  );
}
