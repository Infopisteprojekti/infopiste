const intitialRooms = [
  {
    id: 'test-room-id-123',
    roomEmail: 'exactum.a123@helsinki.fi',
    displayName: 'Exactum, A123, Meeting room, TEST (1)',
    capacity: 1,
    floorNumber: 1,
    isWheelchairAccessible: true,
    tags: ['CS'],
  },
  {
    id: 'test-room-id-234',
    roomEmail: 'exactum.b234@helsinki.fi',
    displayName: 'Exactum, B234, Meeting room, TEST (2)',
    capacity: 2,
    floorNumber: 2,
    isWheelchairAccessible: true,
    tags: ['CS'],
  },
  {
    id: 'test-room-id-345',
    roomEmail: 'exactum.c345@helsinki.fi',
    displayName: 'Exactum, C345, Meeting room, TEST (3)',
    capacity: 3,
    floorNumber: 3,
    isWheelchairAccessible: true,
    tags: ['MATHSTAT'],
  },
];

const initialReservations = [
  {
    id: 'test-id-1',
    room: 'test-room-id-1',
    start: '2025-10-10T12:00:00.000Z',
    end: '2025-10-10T14:00:00.000Z',
  },
  {
    id: 'test-id-2',
    room: 'test-room-id-2',
    start: '2025-10-11T12:00:00.000Z',
    end: '2025-10-11T14:00:00.000Z',
  },
  {
    id: 'test-id-3',
    room: 'test-room-id-3',
    start: '2025-10-12T12:00:00.000Z',
    end: '2025-10-12T14:00:00.000Z',
  },
];

export default {
  intitialRooms,
  initialReservations,
};
