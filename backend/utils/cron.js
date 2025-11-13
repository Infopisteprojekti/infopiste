import cron from 'node-cron';
import logger from './logger.js';
import { syncExactumRooms, syncTodaysEvents } from './graphHelper.js';

const startRoomSyncCron = () => {
  // every day at 03:00
  cron.schedule('0 3 * * *', async () => {
    logger.info('Running scheduled room sync');
    try {
      await syncExactumRooms();
      logger.info('Scheduled room sync completed');
    } catch (error) {
      logger.error('Scheduled room sync failed', error);
    }
  });
};

const startEventSyncCron = () => {
  // every 30 min
  cron.schedule('*/30 * * * *', async () => {
    logger.info('Running scheduled event sync');
    try {
      await syncTodaysEvents();
      logger.info('Scheduled event sync completed');
    } catch (error) {
      logger.error('Scheduled event sync failed', error);
    }
  });
};

export const scheduleCronJobs = async () => {
  startRoomSyncCron();
  startEventSyncCron();
};
