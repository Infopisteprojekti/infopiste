import { vi, test, describe, beforeEach, afterEach, expect } from 'vitest';
import dayjs from 'dayjs';
import graphClient from '../utils/graphClient.js';
import { syncExactumRooms, syncTodaysEvents } from '../utils/graphHelper.js';
import Room from '../models/room.js';
import Reservation from '../models/reservation.js';

vi.mock('../utils/graphClient.js', () => ({
  default: {
    getExactumRooms: vi.fn(),
    getRoomEventsBatch: vi.fn(),
  },
}));

vi.mock('../models/room.js', () => ({
  default: {
    bulkWrite: vi.fn(),
    find: vi.fn(),
  },
}));

vi.mock('../models/reservation.js', () => ({
  default: {
    deleteMany: vi.fn(),
    bulkWrite: vi.fn(),
  },
}));

describe('Graph API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('syncExactumRooms syncs rooms correctly', async () => {
    const mockRoomsResponse = {
      value: [
        {
          emailAddress: 'test.a123@test.fi',
          displayName: 'Test, A123, Meeting room (1)',
          floorNumber: 1,
          capacity: 1,
          isWheelChairAccessible: true,
          tags: ['CS'],
        },
        {
          emailAddress: 'test.b234@test.fi',
          displayName: 'Test, B234, Meeting Room (2)',
          floorNumber: 2,
          capacity: 2,
          isWheelChairAccessible: false,
          tags: ['MATHSTAT'],
        },
      ],
    };

    graphClient.getExactumRooms.mockResolvedValue(mockRoomsResponse);
    Room.bulkWrite.mockResolvedValue({ ok: 1 });

    await syncExactumRooms();

    expect(graphClient.getExactumRooms).toHaveBeenCalledTimes(1);
    expect(Room.bulkWrite).toHaveBeenCalledTimes(1);

    const bulkWriteArg = Room.bulkWrite.mock.calls[0][0];
    expect(bulkWriteArg).toHaveLength(2);
    expect(bulkWriteArg[0].updateOne.update.$set.displayId).toBe('A123');
    expect(bulkWriteArg[1].updateOne.update.$set.displayId).toBe('B234');
  });

  test('syncTodaysEvents syncs events correctly', async () => {
    const mockRooms = [
      { id: 'room-id-1', roomEmail: 'test.a123@test.fi' },
      { id: 'room-id-2', roomEmail: 'test.b234@test.fi' },
    ];

    const mockEventsResponse = [
      {
        id: '1',
        roomEmail: 'test.a123@test.fi',
        startTime: dayjs.utc('2025-11-25T10:00:00.0000000').toDate(),
        endTime: dayjs.utc('2025-11-25T12:00:00.0000000').toDate(),
      },
      {
        id: '2',
        roomEmail: 'test.b234@test.fi',
        startTime: dayjs.utc('2025-11-25T12:00:00.0000000').toDate(),
        endTime: dayjs.utc('2025-11-25T14:00:00.0000000').toDate(),
      },
    ];

    Room.find.mockResolvedValue(mockRooms);
    graphClient.getRoomEventsBatch.mockResolvedValue(mockEventsResponse);
    Reservation.deleteMany.mockResolvedValue({ deletedCount: 0 });
    Reservation.bulkWrite.mockResolvedValue({ ok: 1 });

    await syncTodaysEvents();

    expect(Room.find).toHaveBeenCalledTimes(1);
    expect(graphClient.getRoomEventsBatch).toHaveBeenCalledTimes(1);

    expect(Reservation.deleteMany).toHaveBeenCalledTimes(1);
    expect(Reservation.bulkWrite).toHaveBeenCalledTimes(1);
  });
});
