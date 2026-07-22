import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/hooks/api';

export const useEnroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({

      courseId,
    }: {
      studentId: number;
      courseId: number;
    }) => {
      const response = await api.post('/user/enroll', {
        courseId,
      });

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['enrollments'],
      });
    },
  });
};

export const useGetEnrollments = () => {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const response = await api.get(`/user/enrollments`);
      return response.data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};