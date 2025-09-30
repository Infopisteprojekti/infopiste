import { Router } from 'express';
import { generateRooms } from '../mockdata/generate-room-data.js';
import { getAppClient } from '../services/graph_auth.js';

const router = Router();
const rooms = generateRooms();

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

  try {
    const client = getAppClient();

    const results = await client
      .api(`/users/${id}/calendar/events`)
      .select(['start', 'end', 'location'])
      .orderby('start/dateTime')
      .top(20)
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
