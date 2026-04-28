"use client";
import VideoPlayer from '@/app/components/VideoPlayer';
import { useEffect, useState } from 'react';
import { api } from '@/app/hooks/api';
import { useParams } from 'next/navigation';
import { lectureVideoSchema } from '@/types';


function page() {
  const [videoData, setVideoData] = useState<lectureVideoSchema | null>(null);
  const { sid } = useParams();

  useEffect(() => {
    async function loadVideo() {
      const res = await api.get(`/lectures/${sid}/videos`);
      const data = res.data.data[0].video_id;
      const vidData = await api.get(`/videos/${data}`)
      console.log('video data:', vidData.data);

      setVideoData(vidData.data);
    }

    loadVideo();
  }, []);


  return (
    <div className=" w-full min-h-screen flex items-center justify-center flex-col gap-8">
      <h1>video page</h1>
      <VideoPlayer videoData={videoData} />
    </div>
  );
}

export default page;
