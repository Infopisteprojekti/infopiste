import mongoose from 'mongoose';
import logger from './logger.js';
import { MONGO_DB_URL } from './config.js';

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', false);
  logger.info('Connecting to database');

  try {
    await mongoose.connect(MONGO_DB_URL);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
  }
};
