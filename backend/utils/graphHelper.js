import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import graphClient from './graphClient.js';
import logger from './logger.js';
import Room from '../models/room.js';
import Reservation from '../models/reservation.js';

dayjs.extend(utc);

export const syncExactumRooms = async () => {
  try {
    logger.info('Fetching rooms from Graph API');
    const response = await graphClient.getExactumRooms();
    const rooms = response.value || [];

    logger.info(`Found ${rooms.length} rooms`);

    if (!rooms.length) return;

    const operations = rooms.map(room => {
      // extract displayId (e.g. A123b or DK123) from displayName using regex
      const displayId = room.displayName
        ? room.displayName.match(/\b([A-Za-z]{1,2}\d{3}[A-Za-z]?)\b/)?.[1]
        : null;

      return {
        updateOne: {
          filter: { roomEmail: room.emailAddress },
          update: {
            $set: {
              roomEmail: room.emailAddress,
              displayId: displayId,
              displayName: room.displayName,
              floorNumber: room.floorNumber,
              capacity: room.capacity,
              isWheelChairAccessible: room.isWheelChairAccessible,
              tags: Array.isArray(room.tags) ? room.tags : [],
            },
          },
          upsert: true,
        },
      };
    });

    await Room.bulkWrite(operations);
  } catch (error) {
    throw new Error(`Room sync failed: ${error.message}`);
  }
};

export const syncTodaysEvents = async () => {
  try {
    logger.info('Fetching events from Graph API');

    const rooms = await Room.find({}, { roomEmail: 1, id: 1 });
    if (!rooms.length) return;

    const roomMap = new Map(rooms.map(r => [r.roomEmail, r.id]));
    const roomEmails = rooms.map(r => r.roomEmail);

    const startOfDay = dayjs.utc().startOf('day');
    const endOfDay = dayjs.utc().endOf('day');

    // graph api limit is 20 rooms per request so we need to create chunks
    const chunk = (arr, size) =>
      arr.reduce(
        (acc, _, i) =>
          i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc,
        []
      );

    const roomEmailChunks = chunk(roomEmails, 20);

    // use Promise.all to run chunks concurrently for speed
    const chunkPromises = roomEmailChunks.map(group =>
      graphClient
        .getRoomEventsBatch(
          group,
          startOfDay.toISOString(),
          endOfDay.toISOString()
        )
        .catch(err => {
          logger.error(`chunk failed: ${err.message}`);
          return [];
        })
    );

    const results = await Promise.all(chunkPromises);
    const allEvents = results.flat();

    logger.info(`Found ${allEvents.length} events`);

    const operations = allEvents
      .filter(event => roomMap.has(event.roomEmail))
      .map(event => ({
        updateOne: {
          filter: { eventId: event.id },
          update: {
            $set: {
              room: roomMap.get(event.roomEmail),
              start: event.startTime,
              end: event.endTime,
              eventId: event.id,
            },
          },
          upsert: true,
        },
      }));

    if (operations.length > 0) {
      await Reservation.bulkWrite(operations);
    }

    const validEventIds = new Set(allEvents.map(e => e.id));

    await Reservation.deleteMany({
      $or: [
        // delete reservations that ended before today
        { end: { $lt: startOfDay.toDate() } },

        // delete reservations starting today that were deleted
        {
          start: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
          end: { $gte: startOfDay.toDate() },
          eventId: { $nin: Array.from(validEventIds) },
        },
      ],
      room: { $in: Array.from(roomMap.values()) },
    });
  } catch (error) {
    logger.error(`Event sync failed: ${error.message}`);
  }
};
