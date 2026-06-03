import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    retry: false,
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      try {
        const res = await api.get('/me');
        console.log('status:', res.status);
        console.log('full response:', res.data);
        // Guard against undefined — return null if no user data
        return res.data ?? null;

      } catch (err: unknown) {
        if (err instanceof Error && (err as any).response?.status === 401) {
          return null;
        }
        throw err;
      }
    },
  });
}