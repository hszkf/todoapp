import app from './api';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3020;

console.log(`Starting server on port ${port}...`);

export default {
  port,
  fetch: app.fetch,
};
