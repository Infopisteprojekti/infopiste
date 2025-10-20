import express from 'express';
import { Form } from '../models/formModel.js';
import { getRedis } from '../services/redis-client.js';
import { TTL_SECONDS } from '../utils/config.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const cacheKey = 'forms';
  const redis = req.redisClient;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const forms = await Form.find();
    await redis.set(cacheKey, JSON.stringify(forms), {
      EX: TTL_SECONDS,
    });
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

export default router;
