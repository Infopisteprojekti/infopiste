import supertest from 'supertest';
import { vi, test, describe, beforeEach, afterEach, assert } from 'vitest';
import { syncFormSubmissions } from '../utils/graphHelper.js';
import redisClient from '../utils/redisClient.js';

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

vi.mock('../utils/graphHelper.js', () => ({
  syncFormSubmissions: vi.fn(),
}));

describe('forms api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('returns forms from graph if cache is empty', async () => {
    redisClient.get.mockResolvedValue(null);
    syncFormSubmissions.mockResolvedValue(helper.mockSyncResults);

    redisClient.set.mockResolvedValue('OK');
    redisClient.expire.mockResolvedValue(1);

    const response = await api
      .get('/api/forms')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.source, 'graph');
    assert.deepStrictEqual(response.body.data, helper.mockSyncResults);

    assert.strictEqual(redisClient.get.mock.calls.length, 1);
    assert.strictEqual(syncFormSubmissions.mock.calls.length, 1);
    assert.strictEqual(redisClient.set.mock.calls.length, 1);
    assert.strictEqual(redisClient.expire.mock.calls.length, 1);
  });

  test('returns forms from cache when available', async () => {
    redisClient.get.mockResolvedValue(JSON.stringify(helper.mockSyncResults));

    const response = await api
      .get('/api/forms')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.source, 'cache');
    assert.deepStrictEqual(response.body.data, helper.mockSyncResults);

    assert.strictEqual(redisClient.get.mock.calls.length, 1);
    assert.strictEqual(syncFormSubmissions.mock.calls.length, 0);
    assert.strictEqual(redisClient.set.mock.calls.length, 0);
    assert.strictEqual(redisClient.expire.mock.calls.length, 0);
  });

  test('returns empty array if no forms exist', async () => {
    redisClient.get.mockResolvedValue(null);
    syncFormSubmissions.mockResolvedValue([]);

    const response = await api.get('/api/forms').expect(200);

    assert.strictEqual(response.body.source, 'graph');
    assert.deepStrictEqual(response.body.data, []);

    assert.strictEqual(syncFormSubmissions.mock.calls.length, 1);
  });
});
