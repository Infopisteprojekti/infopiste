const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const filesRouter = require('./controllers/files');
const roomsRouter = require('./controllers/rooms');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

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

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);

module.exports = app;
