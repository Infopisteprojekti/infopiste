import { getAppClient } from '../services/graph_auth.js';

function createBatchRequest(roomIds, roomEmails) {
  const { nowUtc, weekAheadUtc } = getUtcNowAndWeekAhead();

  const batchRequest = roomEmails.map((email, idx) => {
    const roomId = roomIds[idx];
    return {
      id: roomId,
      method: 'GET',
      url:
        `/users/${email}/calendar/events?` +
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
    displayName: event.location?.displayName || null,
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
    const client = getAppClient();

    const roomEmails = roomIds.map(
      id => `exactum.${id.toLowerCase()}@helsinki.fi`
    );

    const batchRequest = createBatchRequest(roomIds, roomEmails);
    const batchResponse = await client
      .api('/$batch')
      .post({ requests: batchRequest });

    return filterBatchResponse(roomIds, batchResponse);
  } catch (err) {
    console.error('fetchRoomReservations failed: ', err);
    throw new Error('Could not fetch room reservations', err);
  }
}

export async function fetchReservationsById(roomId) {
  const roomEmail = `exactum.${roomId.toLowerCase()}@helsinki.fi`;

  try {
    const client = getAppClient();

    const { nowUtc, weekAheadUtc } = getUtcNowAndWeekAhead();

    const results = await client
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
