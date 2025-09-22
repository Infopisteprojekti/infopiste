import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './utils/config.js';
import logger from './utils/logger.js';
import middleware from './utils/middleware.js';

import filesRouter from './controllers/files.js';
import roomsRouter from './controllers/rooms.js';

const app = express();

mongoose.set('strictQuery', false);

logger.info('Connecting to', config.MONGO_DB_URL);

mongoose.connect(config.MONGO_DB_URL)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(error => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/files', filesRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/uploads', express.static('uploads'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(middleware.unknownEndpoint);

export default app;