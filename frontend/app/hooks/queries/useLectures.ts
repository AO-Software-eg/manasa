import { api } from '@/app/hooks/api';
import { useQuery } from '@tanstack/react-query';
import { lectureVideoSchema } from '@/types/lecture';
import { progressSchema } from '@/types';


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
export function useLectureProgress(userId?: number, courseId?: number, enabled = true) {
  return useQuery<progressSchema>({
    queryKey: ['progress', userId, courseId],
    enabled: enabled && !!userId && !!courseId,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await api.get(`/users/${userId}/progress/${courseId}`);
      console.log(res.data);

      if (!res.data) {
        throw new Error('لا يوجد نشاط');
      }


      return res.data
    }
  })
}