import { Router } from 'express';
import redis from '../utils/redisClient.js';
import fetch from 'node-fetch';

import { syncFormSubmissions } from '../utils/graphHelper.js';

const router = Router();

const SUBMISSIONS_TTL_SECONDS = 30 * 60;

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

    const submissions = await syncFormSubmissions();

    if (submissions.length > 0) {
      await redis.set(cacheKey, JSON.stringify(submissions));
      await redis.expire(cacheKey, SUBMISSIONS_TTL_SECONDS);
    }

    response.status(200).json({
      source: 'graph',
      data: submissions,
    });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

router.get('/proxy-pdf', async (request, response) => {
  const { url } = request.query;
  if (!url) {
    return response.status(400).json({ error: 'Missing URL' });
  }

  try {
    const formUrl = await fetch(url);

    if (!formUrl.ok) {
      return response
        .status(formUrl.status)
        .json({ error: 'Failed to fetch PDF' });
    }

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Cache-Control', 'no-cache');
    formUrl.body.pipe(response);
  } catch (err) {
    response
      .status(500)
      .json({ error: 'Proxy request failed', details: err.message });
  }
});

export default router;
