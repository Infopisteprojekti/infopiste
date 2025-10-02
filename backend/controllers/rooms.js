import { Router } from 'express';
import {
  fetchRoomReservations,
  fetchReservationsById,
} from '../services/rooms.js';
import { getRedis } from '../services/redis-client.js';
import { TTL_SECONDS } from '../utils/config.js';

const router = Router();

const ROOMIDS = ['b233', 'a214', 'a218b', 'a307', 'c231'];

router.get('/', async (request, response) => {
  const cacheKey = 'rooms:reservations';
  const redis = getRedis();

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

  const redis = getRedis();
  const cacheKey = `rooms:reservations:${id}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('FETCHED FROM CACHE');
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

export default router;
