import { Router } from 'express';
import redis from '../utils/redisClient.js';

import { fetchMenuData } from '../services/unicafe.js';
import { UNICAFE_TLL_SECONDS } from '../utils/config.js';

const router = Router();

router.get('/menus', async (request, response) => {
  const cacheKey = 'unicafe:menus';

  const cached = await redis.get(cacheKey);
  if (cached) {
    return response.status(200).json(JSON.parse(cached));
  }

  try {
    const menus = await fetchMenuData();
    await redis.set(cacheKey, JSON.stringify(menus), {
      EX: UNICAFE_TLL_SECONDS,
    });

    response.status(200).json(menus);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: err });
  }
});

export default router;
