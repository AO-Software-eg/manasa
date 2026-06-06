'use client';

import VideoPlayer from '@/app/components/VideoPlayer';
import { useVideo } from '@/app/hooks/queries/useLectures';
import { useParams } from 'next/navigation';
import LoadingComp from '@/app/components/LoadingComp';
import { PlayCircle } from 'lucide-react';

export default function Page() {
  const params = useParams();

  const lid = Array.isArray(params.lid)
    ? params.lid[0]
    : params.lid;

  const sid = Array.isArray(params.sid)
    ? params.sid[0]
    : params.sid;

  if (!sid || !lid) return null;

  const {
    data: videoData,
    isLoading,
    isError,
    error,
    refetch,
  } = useVideo(Number(lid), Number(sid));

  if (isLoading) return <LoadingComp />;

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[#111827] border border-red-500/30 rounded-3xl p-8 text-center">
          <p className="text-red-500 mb-4">
            {error instanceof Error
              ? error.message
              : 'فشل تحميل الفيديو'}
          </p>

          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );

  if (!videoData) return null;

  return (
    <section className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-blue-400">
            <PlayCircle size={22} />
            <span>Lecture Video</span>
          </div>

     

          <p className="text-gray-400">
            شاهد المحاضرة كاملة ثم أكمل المحتوى التعليمي.
          </p>
        </div>

        {/* Video Card */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
          <VideoPlayer videoData={videoData} />
        </div>

        {/* Optional Info */}
        <div className="mt-6 bg-[#111827] border border-gray-800 rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-3">
            معلومات المحاضرة
          </h2>

          <div className="text-gray-400 space-y-2">
            <p>Lecture ID: {lid}</p>
            <p>Section ID: {sid}</p>
          </div>
        </div>
      </div>
    </section>
  );
}