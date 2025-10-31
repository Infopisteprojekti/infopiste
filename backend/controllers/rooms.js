import { Router } from 'express';
import {
  fetchRoomReservations,
  fetchReservationsById,
} from '../services/rooms.js';
import redis from '../utils/redisClient.js';
import Room from '../models/room.js';
import { TTL_SECONDS } from '../utils/config.js';

const router = Router();

const ROOMIDS = ['b233', 'a214', 'a218b', 'a307'];

router.get('/', async (request, response) => {
  const cacheKey = 'rooms:reservations';

  const cached = await redis.get(cacheKey);
  if (cached) {
    return response.status(200).json(JSON.parse(cached));
  }

  try {
    const reservations = await fetchRoomReservations(ROOMIDS);
    await redis.set(cacheKey, JSON.stringify(reservations), {
      EX: TTL_SECONDS,
    });

    response.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: err });
  }
});

router.get('/:id/reservations', async (request, response) => {
  const { id } = request.params;

  const cacheKey = `rooms:reservations:${id}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return response.status(200).json(JSON.parse(cached));
  }

  if (!ROOMIDS.includes(id.toLowerCase())) {
    console.log(`Unsupported room: ${id}`);
    return response.status(404).json({ error: `Room not supported: ${id}` });
  }

  try {
    const reservations = await fetchReservationsById(id.toLowerCase());
    await redis.set(cacheKey, JSON.stringify(reservations), {
      EX: TTL_SECONDS,
    });

    response.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    response.status(500).json({
      error: `Failed to fetch reservations for room: ${id}, error: ${err}`,
    });
  }
});

router.get('/allRooms', async (request, response) => {
  const cacheKey = 'rooms:all';

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return response.status(200).json({
        source: 'cache',
        data: JSON.parse(cached),
      });
    }

    const rooms = await Room.find({});

    if (rooms.length > 0) {
      await redis.set(cacheKey, JSON.stringify(rooms));
      await redis.expire(cacheKey, TTL_SECONDS);
    }

    response.status(200).json({
      source: 'database',
      data: rooms,
    });
  } catch (err) {
    response.status(500).json({ error: err });
  }
});

export default router;
