'use client';

import SideNav from '../../components/SideNav';
import '../../globals.css';
import { Cairo } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Chatbot from '@/app/components/Chatbot';
import { useState , useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/hooks/api';

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
    const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/me')
      .then(() => setLoading(false))
      .catch(() => router.replace('/login'));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className={`min-h-screen flex bg-[#0d0d0d] text-white ${cairo.className}`}
    >
      <AuthProvider>
        {/* Sidebar */}
        <SideNav collapsed={collapsed} setCollapsed={setCollapsed} />

        <Chatbot />

        {/* Main */}
        <main
          className="flex-1  mt-16 p-4 lg:h-[calc(105dvh-4rem)] lg:overflow-y-auto overflow-x-hidden"
        >
          {children}
        </main>
      </AuthProvider>
    </div>
  );
}
