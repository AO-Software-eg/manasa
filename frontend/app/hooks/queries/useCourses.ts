import { api } from '@/app/hooks/api';
import { useQuery } from '@tanstack/react-query';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await api.get(`/courses`);
      if (!res.data.data) throw new Error('جدث خطأ اثناء تحميل الكورسات');
      return res.data.data;
    },
  });
}

export function useCourseById(id: string) {
  return useQuery({
    queryKey: ['course', id],
    enabled: !!id,
    staleTime: 0,
    queryFn: async () => {
      const res = await api.get(`/courses/${id}`);
      if (!id) throw new Error('لم يتم العثور على الكورس');
      return res.data.data;
    },
  });
}
