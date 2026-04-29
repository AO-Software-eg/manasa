'use client';

import SideNav from '../../components/SideNav';
import '../../globals.css';
import { Cairo } from 'next/font/google';
import Chatbot from '@/app/components/Chatbot';
import { useState } from 'react';

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

  return (
    <div
      className={`min-h-screen flex bg-[#0d0d0d] text-white ${cairo.className}`}
    >
   
        <SideNav collapsed={collapsed} setCollapsed={setCollapsed} />

        <Chatbot />

        {/* Main */}
        <main
          className="flex-1  mt-16 p-4 lg:h-[calc(102dvh-5rem)] lg:overflow-y-auto overflow-x-hidden"
        >
          {children}
        </main>
    
    </div>
  );
}
