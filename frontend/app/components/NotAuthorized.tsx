import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function NotAuthorized() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="max-w-md text-center px-4">
        <h1 className="text-6xl mb-4 flex justify-center items-center text-primary">
          <Lock className="h-16 w-16" />
        </h1>
        <h2 className="text-3xl font-bold text-primary">
          هذا المحتوى غير متاح
        </h2>
        <p className="mt-4 text-muted-foreground">
          يجب الاشتراك في الكورس أولاً للوصول إلى المحاضرات والاختبارات.
        </p>
        <Link
          href="/home"
          className="inline-block mt-6 rounded-lg bg-primary px-5 py-2 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-sm"
        >
          تصفح الكورسات
        </Link>
      </div>
    </section>
  );
}