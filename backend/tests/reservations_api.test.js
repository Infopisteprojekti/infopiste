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

vi.mock('../models/reservation.js', () => ({
  default: {
    find: vi.fn(),
    deleteMany: vi.fn(),
  },
}));

import redisClient from '../utils/redisClient.js';
import Reservation from '../models/reservation.js';

describe('reservations api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('returns reservations from database if cache is empty', async () => {
    redisClient.get.mockResolvedValue(null);

    Reservation.find.mockResolvedValue(helper.initialReservations);
    redisClient.set.mockResolvedValue('OK');
    redisClient.expire.mockResolvedValue(1);

    const response = await api
      .get('/api/reservations')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.source, 'database');
    assert.strictEqual(
      response.body.data.length,
      helper.initialReservations.length
    );

    assert.strictEqual(redisClient.get.mock.calls.length, 1);
    assert.strictEqual(redisClient.set.mock.calls.length, 1);
    assert.strictEqual(redisClient.expire.mock.calls.length, 1);

    assert.strictEqual(Reservation.find.mock.calls.length, 1);
  });

  test('returns reservations from cache when available', async () => {
    redisClient.get.mockResolvedValue(
      JSON.stringify(helper.initialReservations)
    );

    const response = await api
      .get('/api/reservations')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.source, 'cache');
    assert.strictEqual(
      response.body.data.length,
      helper.initialReservations.length
    );

    assert.strictEqual(redisClient.get.mock.calls.length, 1);
    assert.strictEqual(Reservation.find.mock.calls.length, 0);
    assert.strictEqual(redisClient.set.mock.calls.length, 0);
  });

  test('returns empty array if no reservations exist', async () => {
    redisClient.get.mockResolvedValue(null);
    Reservation.find.mockResolvedValue([]);

    const response = await api.get('/api/reservations').expect(200);

    assert.strictEqual(response.body.source, 'database');
    assert.strictEqual(response.body.data.length, 0);
  });
});
