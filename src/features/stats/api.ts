import type { StatsResponse } from './types';

const API_BASE = '/api/stats';

export const statsApi = {
  async getStats(): Promise<StatsResponse> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  },
};
