import graphClient from '../utils/graphClient.js';
import logger from '../utils/logger.js';

function createBatchRequest(roomIds) {
  const { nowUtc, weekAheadUtc } = getUtcNowAndWeekAhead();

  const batchRequest = roomIds.map(roomId => {
    const roomEmail = `exactum.${roomId.toLowerCase()}@helsinki.fi`;

    return {
      id: roomId,
      method: 'GET',
      url:
        `/users/${roomEmail}/calendar/events?` +
        `$select=start,end,location&` +
        `$filter=end/dateTime ge '${nowUtc}' and start/dateTime le '${weekAheadUtc}'&` +
        `$orderby=start/dateTime`,
    };
  });
  return batchRequest;
}

function filterBatchResponse(roomIds, batchResponse) {
  const result = roomIds.map(roomId => {
    const res = batchResponse.responses.find(r => r.id === roomId);
    if (!res || res.status !== 200) {
      const errorMsg = res?.body?.error?.message || 'Unknown error';
      throw new Error(
        `Failed to fetch reservations for room ${roomId}: ${errorMsg}`
      );
    }

    const reservations = res.body.value.map(mapEventToReservation);
    return { id: roomId, reservations };
  });

  return result;
}

function mapEventToReservation(event) {
  return {
    start: event.start,
    end: event.end,
    location: {
      locationType: event.location?.locationType,
      displayName: event.location?.displayName || null,
    },
  };
}

function getUtcNowAndWeekAhead() {
  const now = new Date();
  const nowUtc = now.toISOString();
  const weekAheadUtc = new Date(
    now.getTime() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  return { nowUtc, weekAheadUtc };
}

export async function fetchRoomReservations(roomIds) {
  try {
    logger.graph(`fetching room reservations for ${roomIds}`);

    const batchRequest = createBatchRequest(roomIds);
    const batchResponse = await graphClient
      .api('/$batch')
      .post({ requests: batchRequest });

    return filterBatchResponse(roomIds, batchResponse);
  } catch (err) {
    console.error('fetchRoomReservations failed: ', err);
    throw new Error(`Could not fetch room reservations: ${err.message}`);
  }
}

export async function fetchReservationsById(roomId) {
  const roomEmail = `exactum.${roomId.toLowerCase()}@helsinki.fi`;

  try {
    const { nowUtc, weekAheadUtc } = getUtcNowAndWeekAhead();

    logger.graph(`fetching reservations by id for ${roomId}`);

    const results = await graphClient
      .api(`/users/${roomEmail}/calendar/events`)
      .select(['start', 'end', 'location'])
      .filter(
        `end/dateTime ge '${nowUtc}' and start/dateTime le '${weekAheadUtc}'`
      )
      .orderby('start/dateTime')
      .get();

    return results.value.map(mapEventToReservation);
  } catch (err) {
    throw new Error(err);
  }
}

export { createBatchRequest, filterBatchResponse, mapEventToReservation };
