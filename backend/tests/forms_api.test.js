import supertest from 'supertest';
import { vi, test, describe, beforeEach, afterEach, assert } from 'vitest';

import app from '../app.js';
const api = supertest(app);

import helper from './test_helper.js';

vi.mock('../utils/redisClient.js', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    expire: vi.fn(),
  },
}));

vi.mock('../utils/graphClient.js', () => ({
  default: {
    getFormSubmissions: vi.fn(),
    getDriveItems: vi.fn(),
  },
}));

import redisClient from '../utils/redisClient.js';
import graphClient from '../utils/graphClient.js';

describe('forms api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('returns forms from graph if cache is empty', async () => {
    redisClient.get.mockResolvedValue(null);

    graphClient.getFormSubmissions.mockResolvedValue(helper.mockSubmissions);
    graphClient.getDriveItems.mockResolvedValue(helper.mockFiles);

    redisClient.set.mockResolvedValue('OK');
    redisClient.expire.mockResolvedValue(1);

    const response = await api
      .get('/api/forms')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.source, 'graph');
    assert.ok(Array.isArray(response.body.data));

    assert.strictEqual(redisClient.get.mock.calls.length, 1);
    assert.strictEqual(graphClient.getFormSubmissions.mock.calls.length, 1);
    assert.strictEqual(graphClient.getDriveItems.mock.calls.length, 1);

    assert.strictEqual(redisClient.set.mock.calls.length, 1);
    assert.strictEqual(redisClient.expire.mock.calls.length, 1);
  });

  test('returns forms from cache when available', async () => {
    redisClient.get.mockResolvedValue(JSON.stringify(helper.mockCachedForms));

    const response = await api
      .get('/api/forms')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.source, 'cache');
    assert.strictEqual(
      response.body.data.length,
      helper.mockCachedForms.length
    );

    assert.strictEqual(redisClient.get.mock.calls.length, 1);

    assert.strictEqual(graphClient.getFormSubmissions.mock.calls.length, 0);
    assert.strictEqual(graphClient.getDriveItems.mock.calls.length, 0);

    assert.strictEqual(redisClient.set.mock.calls.length, 0);
  });

  test('returns empty array if no forms exist', async () => {
    redisClient.get.mockResolvedValue(null);

    graphClient.getFormSubmissions.mockResolvedValue([]);
    graphClient.getDriveItems.mockResolvedValue([]);

    const response = await api.get('/api/forms').expect(200);

    assert.strictEqual(response.body.source, 'graph');
    assert.deepStrictEqual(response.body.data, []);
  });
});
