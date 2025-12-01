import app from './app.js';
import logger from './utils/logger.js';
import { PORT, LOAD_MOCK_DATA } from './utils/config.js';
import { connectToDatabase } from './utils/dbConnection.js';
import redis from './utils/redisClient.js';
import graphClient from './utils/graphClient.js';
import { syncExactumRooms, syncTodaysEvents } from './utils/graphHelper.js';
import { scheduleCronJobs } from './utils/cron.js';
import { insertMockForms } from './mockdata/mock-forms-in-db.js';

const start = async () => {
  await connectToDatabase();
  await redis.connect();
  await graphClient.initialize();

  if (LOAD_MOCK_DATA) {
    await insertMockForms();
  }

  await syncExactumRooms();
  await syncTodaysEvents();
  await scheduleCronJobs();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start();
