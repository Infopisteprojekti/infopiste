import { Router } from 'express';
import redis from '../utils/redisClient.js';

import { fetchMenuData } from '../services/unicafe.js';
import { getSecondsUntilTomorrow } from '../utils/date.js';

const router = Router();

const MENU_LANGS = ['fi', 'en', 'sv'];

router.get('/menus', async (request, response) => {
  const cacheKey = 'unicafe:menus';

  const lang = request.query.lang;
  if (lang && !MENU_LANGS.includes(lang)) {
    return response.status(400).json({ error: 'Invalid language' });
  }

  const cached = await redis.get(cacheKey);
  if (cached) {
    const cachedMenus = JSON.parse(cached);
    const menus = lang ? cachedMenus[lang] : cachedMenus;

    return response.status(200).json({ source: 'cache', data: menus });
  }

  const unicafe_tll_seconds = getSecondsUntilTomorrow();
  try {
    const menusData = await fetchMenuData();
    await redis.set(cacheKey, JSON.stringify(menusData), {
      EX: unicafe_tll_seconds,
    });

    const menus = lang ? menusData[lang] : menusData;
    response.status(200).json({ source: 'unicafe', data: menus });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: err.message || err });
  }
});

export default router;
