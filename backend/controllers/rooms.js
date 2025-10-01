import { Router } from 'express';
import { generateRooms } from '../mockdata/generate-room-data.js';
import { getAppClient } from '../services/graph_auth.js';
import { fetchRoomReservations } from '../services/rooms.js';

const router = Router();

const ROOMIDS = ['b233', 'a214', 'a218b', 'a307', 'c231'];

router.get('/', async (request, response) => {
  try {
    const reservations = await fetchRoomReservations(ROOMIDS);
    response.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: err });
  }
});

router.get('/:id/reservations', async (request, response) => {
  const { id } = request.params;

  if (!ROOMIDS.includes(id.toLowerCase())) {
    console.log(`Unsupported room: ${id}`);
    response.status(404).json({ error: `Room not supported: ${id}` });
  }

  const roomEmail = `exactum.${id.toLowerCase()}@helsinki.fi`;

  try {
    const client = getAppClient();

    // Filter events from current time to max week ahead
    const now = new Date();
    const nowUtc = now.toISOString();
    const weekAheadUtc = new Date(
      now.getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const results = await client
      .api(`/users/${roomEmail}/calendar/events`)
      .select(['start', 'end', 'location'])
      .filter(
        `end/dateTime ge '${nowUtc}' and start/dateTime le '${weekAheadUtc}'`
      )
      .orderby('start/dateTime')
      .get();

    const events = results.value.map(e => ({
      start: e.start,
      end: e.end,
      displayName: e.location?.displayName || null,
    }));

    response.json(events);
  } catch (err) {
    console.error(err);
    response
      .status(500)
      .json({ error: `Failed to fetch reservations for room: ${id}` });
  }
});

export default router;
