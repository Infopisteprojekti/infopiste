import { Router } from 'express';
import Reservation from '../models/reservation.js';
import redis from '../utils/redisClient.js';
import { TTL_SECONDS } from '../utils/config.js';

const router = Router();

router.get('/', async (request, response) => {
  const cacheKey = 'reservations:all';

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return response.status(200).json({
        source: 'cache',
        data: JSON.parse(cached),
      });
    }

    const reservations = await Reservation.find({}).populate('room', { displayId: 1 });

    if (reservations.length > 0) {
      await redis.set(cacheKey, JSON.stringify(reservations));
      await redis.expire(cacheKey, TTL_SECONDS);
    }

    response.status(200).json({
      source: 'database',
      data: reservations,
    });
  } catch (err) {
    response.status(500).json({ error: err });
  }
});

export default router;
