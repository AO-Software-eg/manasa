// components/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="py-2 px-4 my-2 flex gap-2 items-center justify-center bg-primary/10 text-primary rounded-full"
    >
      <p>العودة</p>
      <ArrowLeft className="inline-block" />
    </button>
  );
}
