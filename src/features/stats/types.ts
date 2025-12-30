export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  completionRate: number;
}

export interface StatsResponse {
  data: TodoStats;
}
