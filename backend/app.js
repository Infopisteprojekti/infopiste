import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import logger from './utils/logger.js';
import { MONGO_DB_URL, MS_SETTINGS, SKIP_GRAPH } from './utils/config.js';
import { requestLogger, unknownEndpoint } from './utils/middleware.js';
import { initializeGraphForAppOnlyAuth } from './services/graph_auth.js';
import { initRedis } from './services/redis-client.js';

import roomsRouter from './controllers/rooms.js';

const app = express();

mongoose.set('strictQuery', false);
logger.info('Connecting to', MONGO_DB_URL);

mongoose
  .connect(MONGO_DB_URL)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(error => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(requestLogger);

await initRedis();
initializeGraphForAppOnlyAuth(MS_SETTINGS, SKIP_GRAPH);

app.use('/api/rooms', roomsRouter);

app.get('/', (req, res) => res.send('infonäyttö backend'));

app.get('/api/hello', async (req, res) => {
  res.json({ message: 'hello from backend server' });
});

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use(unknownEndpoint);

export default app;
