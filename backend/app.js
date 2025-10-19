import express from 'express';
import cors from 'cors';

import { TEST } from './utils/config.js';
import { requestLogger, unknownEndpoint } from './utils/middleware.js';
import { initRedis, getRedis } from './services/redis-client.js';
import { connectToDatabase } from './utils/dbConnection.js';
import graphClient from './utils/graphClient.js';

import roomsRouter from './controllers/rooms.js';

export function createApp({ redisClient } = {}) {
  const app = express();

  let redis;
  if (redisClient) {
    redis = redisClient;
  } else {
    redis = getRedis();
  }

  app.use((req, res, next) => {
    req.redisClient = redis;
    next();
  });

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.use('/api/rooms', roomsRouter);

  app.get('/', (req, res) => res.send('infonäyttö backend'));
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
  app.get('/api/hello', async (req, res) => {
    res.json({ message: 'hello from backend server' });
  });

  app.use(unknownEndpoint);

  return app;
}

export async function initApp() {
  await connectToDatabase();

  if (!TEST) {
    console.log('Initializing Redis and Graph');
    await initRedis();
    await graphClient.initialize();
  } else {
    console.log('RUNNING IN TESTING MODE (MSGRAPH AND REDIS SKIPPED)');
  }
}
