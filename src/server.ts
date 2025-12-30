import app from './api';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

console.log(`Starting server on port ${port}...`);

export default {
  port,
  fetch: app.fetch,
};
