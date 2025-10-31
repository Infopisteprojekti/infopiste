import { Router } from 'express';
import Form from '../models/form.js';
import redis from '../utils/redisClient.js';
import { TTL_SECONDS } from '../utils/config.js';

const router = Router();

router.get('/', async (request, response) => {
  const cacheKey = 'forms:all';

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return response.status(200).json({
        source: 'cache',
        data: JSON.parse(cached),
      });
    }

    const forms = await Form.find({});

    if (forms.length > 0) {
      await redis.set(cacheKey, JSON.stringify(forms));
      await redis.expire(cacheKey, TTL_SECONDS);
    }

    response.status(200).json({
      source: 'database',
      data: forms,
    });
  } catch (err) {
    response.status(500).json({ error: err });
  }
});

export default router;
