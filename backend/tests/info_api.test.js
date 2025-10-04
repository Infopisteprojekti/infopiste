import { describe, test, expect, vi } from 'vitest';
import assert from 'node:assert';
import supertest from 'supertest';
import { createApp } from '../app.js';
import * as roomsService from '../services/rooms.js';

const mockRedis = {
  get: async () => null,
  set: async () => null,
  del: async () => null,
};

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

  test('rooms are returned', async () => {
    const res = await api
      .get('/api/rooms')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('reservations for specific room are returned', async () => {
    const res = await api.get('/api/rooms/b233/reservations').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('reservations for non-existent room returns 404', async () => {
    const res = await api
      .get('/api/rooms/nonexistent/reservations')
      .expect(404);

    expect(res.body).toStrictEqual({
      error: 'Room not supported: nonexistent',
    });
  });
});
