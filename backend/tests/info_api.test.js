import { describe, test, expect, vi } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../app.js';
import * as redisClient from '../services/redis-client.js';

const mockRooms = [
  {
    id: 'b233',
    name: 'Room B233',
    reservations: [
      {
        id: 'res1',
        start: '',
        end: '',
        location: '',
      },
    ],
  },
  { id: 'a214', name: 'Room A214', reservations: [] },
];

const mockRedis = {
  get: vi.fn().mockResolvedValue(JSON.stringify(mockRooms)),
  set: async () => null,
  del: async () => null,
};

vi.mock('../services/rooms.js', () => ({
  fetchRoomReservations: vi.fn(async () => mockRooms),
  fetchReservationsById: vi.fn(async id => {
    const room = mockRooms.find(r => r.id.toLowerCase() === id);
    return room ? room.reservations : [];
  }),
}));

const app = createApp({ redisClient: mockRedis });
const api = supertest(app);

describe('backend endpoint tests', () => {
  test('health check returns ok', async () => {
    const res = await api.get('/health').expect(200);

    expect(res.body.status).toBe('ok');
  });

  test('hello endpoint returns hello message', async () => {
    const res = await api.get('/api/hello').expect(200);

    expect(res.body).toStrictEqual({ message: 'hello from backend server' });
  });

  test('rooms are returned', async () => {
    const res = await api
      .get('/api/rooms')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('cached rooms are returned if present', async () => {
    const res = await api.get('/api/rooms');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockRooms);
  });

  test('reservations for specific room are returned', async () => {
    const res = await api.get('/api/rooms/b233/reservations').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('reservations for non-existent room returns 404', async () => {
    // Here, the cache is ensured to be empty, as otherwise the test returns 200.
    const mockRedisEmpty = {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn(),
      del: vi.fn(),
    };

    const appNoCache = createApp({ redisClient: mockRedisEmpty });
    const apiNoCache = supertest(appNoCache);

    const res = await apiNoCache
      .get('/api/rooms/nonexistent/reservations')
      .expect(404);

    expect(res.body).toStrictEqual({
      error: 'Room not supported: nonexistent',
    });
  });
});
