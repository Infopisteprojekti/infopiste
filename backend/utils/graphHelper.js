import graphClient from './graphClient.js';
import logger from './logger.js';
import Room from '../models/room.js';
import { AVAILABLE_ROOMS } from './config.js';

export const syncExactumRooms = async () => {
  try {
    logger.info('Fetching rooms from Graph API');
    const response = await graphClient.getExactumRooms();
    const rooms = response.value;

    logger.info(`Found ${rooms.length} rooms`);

    const operations = rooms.map(room => ({
      updateOne: {
        filter: { roomEmail: room.emailAddress },
        update: {
          $set: {
            roomEmail: room.emailAddress,
            displayName: room.displayName,
            floorNumber: room.floorNumber,
            capacity: room.capacity,
            isWheelChairAccessible: room.isWheelChairAccessible,
            tags: room.tags || [],
          },
        },
        upsert: true,
      },
    }));

    const result = await Room.bulkWrite(operations);

    logger.info(
      `Rooms synced: ${result.upsertedCount} new, ${result.modifiedCount} updated`
    );

    return rooms;
  } catch (error) {
    logger.error('Error syncing rooms', error.message);
    throw error;
  }
};

export const getTodaysEvents = async () => {
  const roomEmails = AVAILABLE_ROOMS.map(room => `${room}@helsinki.fi`);

  logger.info(`Fetching events from Graph API for ${roomEmails.length} rooms`);

  const startDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  const endDate = new Date(new Date().setHours(24, 0, 0, 0)).toISOString();

  const reservations = await graphClient.getRoomEventsBatch(
    roomEmails,
    startDate,
    endDate
  );

  logger.info(`Found ${reservations.length} reservations for today`);
  return reservations;
};