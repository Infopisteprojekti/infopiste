import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import isBetween from 'dayjs/plugin/isBetween.js';
import graphClient from './graphClient.js';
import logger from './logger.js';
import Room from '../models/room.js';
import Reservation from '../models/reservation.js';
import { excelDateToDayjs, isValidSubmissionDateRange } from './date.js';

dayjs.extend(utc);
dayjs.extend(isBetween);

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

export const syncFormSubmissions = async () => {
  const MAX_ACTIVE_PER_EMAIL = 3;
  const [submissions, files, deletionRequests] = await Promise.all([
    graphClient.getFormSubmissions(),
    graphClient.getDriveItems(),
    graphClient.getDeletionRequests(),
  ]);

  const fileMap = createFileMap(files);
  const deletionMap = createDeletionMap(deletionRequests);
  const submissionsToDelete = getSubmissionsToDelete(submissions, deletionMap);

  await Promise.all(
    submissionsToDelete.map(async submission => {
      const excelUrl = submission['Ilmoitus pdf-muodossa'];
      const file = fileMap.get(excelUrl);
      // Assumes that if file id does not exist it has been already deleted
      if (file?.id) {
        await graphClient.deleteDriveItem(file.id);
        logger.info(`Deleted file: ${file.name}`);
      }
    })
  );

  const now = dayjs();
  const validAndActiveSubmssions = submissions.filter(
    row =>
      isValidSubmissionDateRange(row.Aloituspvm, row.Lopetuspvm) &&
      now.isBetween(row.Aloituspvm, row.Lopetuspvm, 'day', '[]')
  );

  const countByEmail = new Map();
  const result = validAndActiveSubmssions
    .sort((a, b) => new Date(a['Aloituspvm']) - new Date(b['Aloituspvm']))
    .map(row => {
      const email = row['Email'];
      if (!email) return null;

      const completionTime = excelDateToDayjs(row['Completion time']);
      const deletionTime = deletionMap.get(email);

      // TODO: Check what happens if this is removed
      if (deletionTime && completionTime.isBefore(deletionTime)) return null;

      const excelUrl = row['Ilmoitus pdf-muodossa'];
      if (!excelUrl) return null;

      const file = fileMap.get(excelUrl);
      if (!file?.downloadUrl) return null;

      // Max active submissions check
      const current = countByEmail.get(email) || 0;
      if (current >= MAX_ACTIVE_PER_EMAIL) return null;
      countByEmail.set(email, current + 1);

      const proxyUrl = file.downloadUrl.startsWith('http')
        ? `/api/forms/proxy-pdf?url=${encodeURIComponent(file.downloadUrl)}`
        : null;

      return {
        id: row['Id'],
        title: row['Ilmoituksen otsikko'] || null,
        fileUrl: proxyUrl,
        startDate: row['Aloituspvm'] || null,
        endDate: row['Lopetuspvm'] || null,
      };
    })
    .filter(Boolean);

  return result;
};

const createFileMap = files => {
  const fileMap = new Map();
  files.forEach(file => {
    if (file.webUrl && file.downloadUrl && file.id) {
      fileMap.set(file.webUrl, file);
    }
  });
  return fileMap;
};

const createDeletionMap = deletionRequests => {
  const deletionMap = new Map();
  deletionRequests.forEach(req => {
    if (!req.email || !req.deletedAt) return;
    const prev = deletionMap.get(req.email);
    const deletedAt = dayjs(req.deletedAt);
    if (!prev || deletedAt.isAfter(prev)) {
      deletionMap.set(req.email, deletedAt);
    }
  });
  return deletionMap;
};

const getSubmissionsToDelete = (submissions, deletionMap) => {
  return submissions.filter(submission => {
    const email = submission['Email'];
    const completionTime = excelDateToDayjs(submission['Completion time']);
    const deletionTime = deletionMap.get(email);
    return deletionTime && completionTime.isBefore(deletionTime);
  });
};
