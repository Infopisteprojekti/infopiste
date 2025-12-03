import { Router } from 'express';
import Form from '../models/form.js';
import redis from '../utils/redisClient.js';
import { TTL_SECONDS } from '../utils/config.js';
import fetch from 'node-fetch';

import graphClient from '../utils/graphClient.js';

const router = Router();

const SUBMISSIONS_TLL_SECONDS = 30 * 60;

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
        ? `/api/forms/proxy-pdf?url=${encodeURIComponent(data.fileUrl)}`
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

router.get('/test', async (request, response) => {
  // const cacheKey = 'form_submissions';

  try {
    const res = await graphClient.getFormSubmissions();
    response.status(200).json({
      source: 'graph',
      data: res,
    });
  } catch (err) {
    response.status(500).json({ error: err });
  }
});

router.get('/test/files', async (request, response) => {
  try {
    const res = await graphClient.getDriveItems();
    response.status(200).json({
      source: 'graph',
      data: res,
    });
  } catch (err) {
    response.status(500).json({ error: err });
  }
});

router.get('/test/forms', async (request, response) => {
  const cacheKey = 'forms:test';

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

    const fileMap = new Map();
    files.forEach(file => {
      if (file.webUrl && file.downloadUrl) {
        fileMap.set(file.webUrl, file.downloadUrl);
      }
    });

    const result = submissions
      .map(row => {
        const excelUrl = row['Ilmoitus pdf-muodossa'];

        if (!excelUrl) return null;

        const downloadUrl = fileMap.get(excelUrl);

        if (!downloadUrl) return null;

        return {
          title: row['Ilmoituksen otsikko'] || null,
          fileUrl: downloadUrl,
          startDate: row['Aloituspvm'] || null,
          endDate: row['Lopetuspvm'] || null,
        };
      })
      .filter(Boolean);

    if (result.length > 0) {
      await redis.set(cacheKey, JSON.stringify(result));
      await redis.expire(cacheKey, SUBMISSIONS_TLL_SECONDS);
    }

    response.status(200).json({
      source: 'graph',
      data: result,
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
