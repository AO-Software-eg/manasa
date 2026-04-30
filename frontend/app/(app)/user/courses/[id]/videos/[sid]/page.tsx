"use client";

import VideoPlayer from '@/app/components/VideoPlayer';
import { useVideo } from '@/app/hooks/queries/useLectures';
import { useParams } from 'next/navigation';
import LoadingComp from '@/app/components/LoadingComp';



export default function Page() {
  const params = useParams();
  const sid = Array.isArray(params.sid) ? params.sid[0] : params.sid;

  const { data: videoData, isLoading, isError, error, refetch } = useVideo(sid ?? '');

  if (!sid) return null;

  if (isLoading) return <LoadingComp />;

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-red-500">
        {error instanceof Error ? error.message : 'فشل تحميل الفيديو'}
      </p>
      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        أعد المحاولة
      </button>
    </div>
  );

  if (!videoData) return null;

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col gap-8">
      <h1>video page</h1>
      <VideoPlayer videoData={videoData} />
    </div>
  );
}
