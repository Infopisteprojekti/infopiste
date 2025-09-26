import { Router } from 'express';
import { generateRooms } from '../mockdata/generate-room-data.js';

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
  const { date } = request.query;

  const room = rooms.find(r => r.id === id);
  if (!room) {
    return response.status(404).json({ error: 'room not found' });
  }

  let { reservations } = room;

  if (date) {
    reservations = reservations.filter(r =>
      r.start.dateTime.startsWith(date));
  }

  response.json(reservations);
});

export default router;
