import { api } from '@/app/hooks/api';
import { useQuery } from '@tanstack/react-query';
import { lecture, lectureVideoSchema } from '@/types/lecture';

export function useLectures(courseID: string) {
  return useQuery({
    queryKey: ['lecture', courseID],
    enabled: !!courseID,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await api.get(`/courses/${courseID}/lectures`);
      if (!res.data.data) throw new Error('لم يتم الحصول على محتوى الكورس');
      console.log(res.data.data)
      return res.data.data;
    },
  });
}

export function useVideo(
  lectureId: number,
  videoRecordId: number
) {
  return useQuery({
    queryKey: ['video', lectureId, videoRecordId],
    enabled: !!lectureId && !!videoRecordId,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await api.get(
        `/lectures/${lectureId}/videos`
      );

      const video = res.data.data.find(
        (v: lectureVideoSchema) => Number(v.id) === Number(videoRecordId)
      );
      console.log({
        lectureId,
        videoRecordId,
        videos: res.data.data,
      });

      if (!video) {
        throw new Error('لم يتم العثور على الفيديو');
      }

      const vidRes = await api.get(`/videos/${video.videoId}`);

      return {
        otp: vidRes.data.otp,
        playbackInfo: vidRes.data.playbackInfo,
      };
    },
  });
}