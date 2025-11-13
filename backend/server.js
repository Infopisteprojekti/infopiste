import app from './app.js';
import logger from './utils/logger.js';
import { PORT } from './utils/config.js';
import { connectToDatabase } from './utils/dbConnection.js';
import redis from './utils/redisClient.js';
import graphClient from './utils/graphClient.js';
// import { insertMockForms } from './mockdata/mock-forms-in-db.js';

const start = async () => {
  await connectToDatabase();
  await redis.connect();
  await graphClient.initialize();
  // await insertMockForms();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start();
