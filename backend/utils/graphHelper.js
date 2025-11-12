import graphClient from './graphClient.js';
import logger from './logger.js';
import Room from '../models/room.js';
import Reservation from '../models/reservation.js';
import { AVAILABLE_ROOMS } from './config.js';

export const syncExactumRooms = async () => {
  try {
    logger.info('Fetching rooms from Graph API');
    const response = await graphClient.getExactumRooms();
    const rooms = response.value || [];

    logger.info(`Found ${rooms.length} rooms`);

    if (!rooms.length) {
      return;
    }

    const operations = rooms.map(room => ({
      updateOne: {
        filter: { roomEmail: room.emailAddress },
        update: {
          $set: {
            roomEmail: room.emailAddress,
            displayId:
              room.displayName
                .match(/\b([A-Za-z]{1,2}\d{3}[A-Za-z]?)\b/)?.[1]
                .toUpperCase() || null,
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
  } catch (error) {
    logger.error('Error syncing rooms', error.message);
    throw error;
  }
};

export const syncTodaysEvents = async () => {
  try {
    logger.info('Fetching events from Graph API');

    const roomEmails = AVAILABLE_ROOMS.map(room => `${room}@helsinki.fi`);
    const startDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const endDate = new Date(new Date().setHours(24, 0, 0, 0)).toISOString();

    const events = await graphClient.getRoomEventsBatch(
      roomEmails,
      startDate,
      endDate
    );

    logger.info(`Found ${events.length} events`);

    if (!events.length) {
      return;
    }

    const rooms = await Room.find({});
    const roomMap = new Map(rooms.map(r => [r.roomEmail, r.id]));

    const operations = events.map(event => {
      const roomId = roomMap.get(event.roomEmail);

      return {
        updateOne: {
          filter: {
            room: roomId,
            start: event.startTime,
            end: event.endTime,
          },
          update: {
            $set: {
              room: roomId,
              start: event.startTime,
              end: event.endTime,
            },
          },
          upsert: true,
        },
      };
    });

    const result = await Reservation.bulkWrite(operations);

    logger.info(
      `Events synced: ${result.upsertedCount} new, ${result.modifiedCount} updated`
    );
  } catch (error) {
    logger.error('Error syncing events', error.message);
    throw error;
  }
};
