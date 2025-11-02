import { Router } from 'express';
import Form from '../models/form.js';
import redis from '../utils/redisClient.js';
import { TTL_SECONDS } from '../utils/config.js';
import fetch from 'node-fetch';

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

    const proxiedForms = forms.map(data => ({
      ...data._doc,
      fileUrl: data.fileUrl.startsWith('http')
        ? `${request.protocol}://${request.get('host')}/api/forms/proxy-pdf?url=${encodeURIComponent(data.fileUrl)}`
        : data.fileUrl,
    }));

    response.status(200).json({
      source: 'database',
      data: proxiedForms,
    });
  } catch (err) {
    response.status(500).json({ error: err });
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
