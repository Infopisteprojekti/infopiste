import { Router } from 'express';
import {
  fetchRoomReservations,
  fetchReservationsById,
} from '../services/rooms.js';

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

  try {
    const reservations = await fetchReservationsById(id.toLowerCase());
    response.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    response.status(500).json({
      error: `Failed to fetch reservations for room: ${id}, error: ${err}`,
    });
  }
});

export default router;
