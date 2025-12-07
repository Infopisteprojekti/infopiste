import { Router } from 'express';
import redis from '../utils/redisClient.js';
import fetch from 'node-fetch';

import graphClient from '../utils/graphClient.js';

const router = Router();

const SUBMISSIONS_TTL_SECONDS = 30 * 60;
const MAX_ACTIVE_PER_EMAIL = 3;

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

    const [submissions, files] = await Promise.all([
      graphClient.getFormSubmissions(),
      graphClient.getDriveItems(),
    ]);

    // Match the two results by the webUrl.
    // Not ideal but seems to be the only shared value.
    const fileMap = new Map();
    files.forEach(file => {
      if (file.webUrl && file.downloadUrl) {
        fileMap.set(file.webUrl, file.downloadUrl);
      }
    });

    const countByEmail = new Map();

    // TODO: Should probably be refactored. Too much logic in one place.
    const result = submissions
      .sort((a, b) => new Date(a['Aloituspvm']) - new Date(b['Aloituspvm']))
      .map(row => {
        const excelUrl = row['Ilmoitus pdf-muodossa'];
        if (!excelUrl) return null;

        const downloadUrl = fileMap.get(excelUrl);
        if (!downloadUrl) return null;

        const email = row['Email'];
        if (!email) return null;

        // Max active check
        const current = countByEmail.get(email) || 0;
        if (current >= MAX_ACTIVE_PER_EMAIL) return null;
        countByEmail.set(email, current + 1);

        const proxyUrl = downloadUrl.startsWith('http')
          ? `/api/forms/proxy-pdf?url=${encodeURIComponent(downloadUrl)}`
          : null;

        return {
          id: row['Id'],
          title: row['Ilmoituksen otsikko'] || null,
          fileUrl: proxyUrl,
          startDate: row['Aloituspvm'] || null,
          endDate: row['Lopetuspvm'] || null,
        };
      })
      .filter(Boolean);

    if (result.length > 0) {
      await redis.set(cacheKey, JSON.stringify(result));
      await redis.expire(cacheKey, SUBMISSIONS_TTL_SECONDS);
    }

    response.status(200).json({
      source: 'graph',
      data: result,
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
