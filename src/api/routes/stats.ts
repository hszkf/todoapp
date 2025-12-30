import { Hono } from 'hono';
import { statsService } from '../services/stats.service';

const statsRoute = new Hono();

// GET /api/stats - Get todo statistics
statsRoute.get('/', async (c) => {
  try {
    const stats = await statsService.getStats();
    return c.json({ data: stats });
  } catch (error) {
    console.error('Failed to get stats:', error);
    return c.json(
      { error: 'Failed to get statistics' },
      500
    );
  }
});

export { statsRoute };
