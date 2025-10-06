import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  createBatchRequest,
  filterBatchResponse,
  mapEventToReservation,
  fetchRoomReservations,
  fetchReservationsById,
} from '../services/rooms.js';
import * as graphAuth from '../services/graph-auth.js';

const mockClient = {
  api: vi.fn().mockReturnThis(),
  post: vi.fn().mockResolvedValue({
    responses: [
      {
        id: 'b233',
        status: 200,
        body: {
          value: [
            {
              start: { dateTime: '2025-01-01T12:00:00Z' },
              end: { dateTime: '2025-01-01T13:00:00Z' },
              location: { displayName: 'Room B233', locationType: 'confRoom' },
            },
          ],
        },
      },
    ],
  }),
  select: vi.fn().mockReturnThis(),
  filter: vi.fn().mockReturnThis(),
  orderby: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
};

vi.mock('../services/graph-auth.js', () => ({
  getAppClient: () => mockClient,
}));

beforeEach(() => {
  vi.clearAllMocks();
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

    const res = filterBatchResponse(roomIds, batchResponse);

    expect(res).toEqual([
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

  test('filterBatchResponse throws error if result is null', async () => {
    const roomIds = ['nonexistent'];
    const batchResponse = { responses: [{ id: 'nonexistent' }] };

    expect(() => filterBatchResponse(roomIds, batchResponse)).toThrow(
      `Failed to fetch reservations for room ${roomIds[0]}: Unknown error`
    );
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

  test('fetchRoomReservations returns filtered response for room that exists', async () => {
    const roomIds = ['b233'];

    const res = await fetchRoomReservations(roomIds);

    expect(res).toEqual([
      {
        id: 'b233',
        reservations: [
          {
            start: { dateTime: '2025-01-01T12:00:00Z' },
            end: { dateTime: '2025-01-01T13:00:00Z' },
            location: { displayName: 'Room B233', locationType: 'confRoom' },
          },
        ],
      },
    ]);

    expect(mockClient.api).toHaveBeenCalledWith('/$batch');
    expect(mockClient.post).toHaveBeenCalled();
  });

  test('fetchRoomReservations throws error for nonexistent room', async () => {
    const roomIds = ['nonexistent'];

    await expect(() => fetchRoomReservations(roomIds)).rejects.toThrow(
      'Could not fetch room reservations: Failed to fetch reservations for room nonexistent: Unknown error'
    );
  });

  test('fetchReservationsById returns reservations for valid room', async () => {
    const mockEvent = [
      {
        start: { dateTime: '2025-01-01T12:00:00Z' },
        end: { dateTime: '2025-01-01T13:00:00Z' },
        location: { displayName: 'Room B233', locationType: 'confRoom' },
      },
    ];

    mockClient.get.mockResolvedValue({ value: mockEvent });

    const res = await fetchReservationsById('b233');

    expect(res).toEqual([
      {
        start: { dateTime: '2025-01-01T12:00:00Z' },
        end: { dateTime: '2025-01-01T13:00:00Z' },
        location: { displayName: 'Room B233', locationType: 'confRoom' },
      },
    ]);
  });

  test('fetchReservationsById throws error for nonexistent room', async () => {
    mockClient.get.mockRejectedValue(new Error('Invalid room'));

    await expect(fetchReservationsById('nonexistent')).rejects.toThrow(
      'Invalid room'
    );
  });
});
