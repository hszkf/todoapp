import app from './api';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3020;

// Server starting on configured port

export default {
  port,
  fetch: app.fetch,
};
