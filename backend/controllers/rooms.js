import { Router } from 'express';
import redis from '../utils/redisClient.js';
import Room from '../models/room.js';
import { TTL_SECONDS } from '../utils/config.js';

const router = Router();

router.get('/', async (request, response) => {
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
