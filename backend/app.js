import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import logger from './utils/logger.js';
import { MONGO_DB_URL, MS_SETTINGS, TEST } from './utils/config.js';
import { requestLogger, unknownEndpoint } from './utils/middleware.js';
import { initializeGraphForAppOnlyAuth } from './services/graph-auth.js';
import { initRedis, getRedis } from './services/redis-client.js';
import { insertMockData } from './mockdata/mock-forms-in-db.js';

import roomsRouter from './controllers/rooms.js';
import formsRouter from './controllers/forms.js';

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
  app.use('/api/forms', formsRouter);

  app.get('/', (req, res) => res.send('infonäyttö backend'));
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
  app.get('/api/hello', async (req, res) => {
    res.json({ message: 'hello from backend server' });
  });

  app.use(unknownEndpoint);

  return app;
}

export async function initApp() {
  mongoose.set('strictQuery', false);
  logger.info('Connecting to', MONGO_DB_URL);

  try {
    await mongoose.connect(MONGO_DB_URL);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);
  }

  if (!TEST) {
    console.log('Initializing Redis and Graph');
    await initRedis();
    initializeGraphForAppOnlyAuth(MS_SETTINGS);
  } else {
    console.log('RUNNING IN TESTING MODE (MSGRAPH AND REDIS SKIPPED)');
  }
}