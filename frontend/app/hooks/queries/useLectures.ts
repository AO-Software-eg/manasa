import { api } from '@/app/hooks/api';
import { useQuery } from '@tanstack/react-query';

export function useLectures(courseID: string) {
  return useQuery({
    queryKey: ['lecture', courseID],
    enabled: !!courseID,
    queryFn: async () => {
      const res = await api.get(`/courses/${courseID}/lectures`);
      if (!res.data.data) throw new Error('لم يتم الحصول على محتوى الكورس');
      return res.data.data;
    },
  });
}

export function useVideo(vidID: string) {
  return useQuery({
    queryKey: ['video', vidID],
    enabled: !!vidID,
    queryFn: async () => {
      const res = await api.get(`/lectures/${vidID}/videos`);
      const videoId = res.data.data[0]?.video_id;
      if (!videoId) throw new Error('لم يتم العثور على الفيديو');
      const vidRes = await api.get(`/videos/${videoId}`);
      return {
        otp: vidRes.data.otp,
        playbackInfo: vidRes.data.playbackInfo,
      };
    },
  });
}
