import { eq, and, lt, sql } from 'drizzle-orm';
import { db, todos } from '@/db';

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

export const statsService = {
  async getStats(): Promise<TodoStats> {
    const allTodos = await db.select().from(todos);

    const now = new Date().toISOString();

    const total = allTodos.length;
    const completed = allTodos.filter(t => t.completed).length;
    const active = allTodos.filter(t => !t.completed).length;
    const overdue = allTodos.filter(t =>
      !t.completed && t.dueDate && t.dueDate < now
    ).length;

    const byPriority = {
      low: allTodos.filter(t => t.priority === 'low').length,
      medium: allTodos.filter(t => t.priority === 'medium').length,
      high: allTodos.filter(t => t.priority === 'high').length,
    };

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      overdue,
      byPriority,
      completionRate,
    };
  },
};
