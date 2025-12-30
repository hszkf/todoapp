import { useQuery } from '@tanstack/react-query';
import { statsApi } from './api';

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await statsApi.getStats();
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
