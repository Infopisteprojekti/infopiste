import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  createBatchRequest,
  filterBatchResponse,
  mapEventToReservation,
  fetchRoomReservations,
} from '../services/rooms.js';
import * as graphAuth from '../services/graph-auth.js';

const mockClient = {
  api: vi.fn().mockReturnThis(),
  post: vi.fn(),
  select: vi.fn().mockReturnThis(),
  filter: vi.fn().mockReturnThis(),
  oderby: vi.fn().mockReturnThis(),
  get: vi.fn(),
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(graphAuth, 'getAppClient').mockReturnValue(mockClient);
});

describe('rooms service', () => {
  test('createBatchRequest creates correct request', () => {
    const req = createBatchRequest(['b233']);

    expect(req[0].id).toBe('b233');
    expect(req[0].url).toContain(
      '/users/exactum.b233@helsinki.fi/calendar/events?'
    );
  });

  test('filterBatchResponse returns reservation for valid response', () => {
    const roomIds = ['b233'];
    const batchResponse = {
      responses: [
        {
          id: 'b233',
          status: 200,
          body: {
            value: [
              {
                start: { dateTime: '2025-01-01T10:00:00Z' },
                end: { dateTime: '2025-01-01T11:00:00Z' },
                location: {
                  displayName: 'Room B233',
                  locationType: 'confRoom',
                },
              },
            ],
          },
        },
      ],
    };

    const result = filterBatchResponse(roomIds, batchResponse);

    expect(result).toEqual([
      {
        id: 'b233',
        reservations: [
          {
            start: { dateTime: '2025-01-01T10:00:00Z' },
            end: { dateTime: '2025-01-01T11:00:00Z' },
            location: {
              displayName: 'Room B233',
              locationType: 'confRoom',
            },
          },
        ],
      },
    ]);
  });

  test('mapEventToReservation maps event correctly', () => {
    const event = {
      start: { dateTime: '2025-01-01T12:00:00Z' },
      end: { dateTime: '2025-01-01T13:00:00Z' },
      location: { locationType: 'confRoom', displayName: 'Room B233' },
    };

    const mapTest = mapEventToReservation(event);
    expect(mapTest.location.displayName).toBe('Room B233');
    expect(mapTest.location.locationType).toBe('confRoom');
  });
});
