// components/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();

    return (
        <button onClick={() => router.back()} className="py-2 px-4 my-2 flex gap-2 items-center justify-center bg-[#e6d3a3]/20 text-white rounded-full">
            <p>العودة</p>
            <ArrowLeft className="inline-block" />

        </button>
    );
}
