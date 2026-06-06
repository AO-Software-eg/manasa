import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/app/hooks/api';

export const useEnroll = () => {
  return useMutation({
    mutationFn: async ({
      studentId,
      courseId,
    }: {
      studentId: number;
      courseId: number;
    }) => {
      const response = await api.post('/users/enroll', {
        studentId,
        courseId,
      });
      console.log('Enrollment response:', response.data);

      return response.data;
    },
  });
};

export const useGetEnrollments = (userId: string) => {
  return useQuery({
    queryKey: ['enrollments', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}/enrollments`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};