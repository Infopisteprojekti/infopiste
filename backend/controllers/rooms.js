import { Router } from 'express';
import { generateRooms } from '../mockdata/generate-room-data.js';
import { getAppClient } from '../services/graph_auth.js';

const router = Router();
const rooms = generateRooms();

const ROOMIDS = ['b233', 'a214', 'a218b', 'a307', 'c231'];

router.get('/', async (request, response) => {
  response.status(200).json(rooms);
});

router.get('/:id', async (request, response) => {
  const room = rooms.find(r => r.id === request.params.id);
  if (!room) {
    return response.status(404).json({ error: 'room not found' });
  }

  response.status(200).json(room);
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
    console.log(err);
    response
      .status(500)
      .json({ error: `Failed to fetch reservations for room: ${id}` });
  }
});

export default router;
