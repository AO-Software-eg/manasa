import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import { Aref_Ruqaa, Geist } from 'next/font/google';
import Footer from './components/Footer';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const arefRuqaa = Aref_Ruqaa({
  subsets: ['arabic'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'منصة السلطان التعليمية',
  description:
    'منصة السلطان التعليمية هي منصة تعليمية شاملة تهدف إلى توفير محتوى تعليمي عالي الجودة ومتنوع للطلاب في جميع المراحل الدراسية. تقدم المنصة مجموعة واسعة من الدروس والمحاضرات والمواد التعليمية في مختلف المواد الدراسية، مما يساعد الطلاب على تحقيق نجاح أكاديمي وتطوير مهاراتهم بشكل فعال.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn(
        'h-full',
        'antialiased',
        arefRuqaa.className,
        'font-sans',
        geist.variable,
      )}
    >
      <body className="min-h-full flex bg-[#1C1C18]  flex-col">
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <Header />

          {children}


          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
