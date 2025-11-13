export const mockForms = [
  {
    _id: '1',
    title: 'Form 1',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    fileUrl: '/form1.pdf',
  },
  {
    _id: '2',
    title: 'Form 2',
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    fileUrl: '/form2.pdf',
  },
];

const mockRooms = [
  {
    id: 'test-room-id-107',
    roomEmail: 'exactum.a107@helsinki.fi',
    displayId: 'A107',
    displayName: 'Exactum, A107, Meeting room, TEST (1)',
    capacity: 1,
    floorNumber: 1,
    isWheelchairAccessible: true,
    tags: ['CS'],
  },
  {
    id: 'test-room-id-207',
    roomEmail: 'exactum.b207@helsinki.fi',
    displayId: 'A207',
    displayName: 'Exactum, A207, Meeting room, TEST (2)',
    capacity: 2,
    floorNumber: 2,
    isWheelchairAccessible: true,
    tags: ['CS'],
  },
  {
    id: 'test-room-id-307',
    roomEmail: 'exactum.c307@helsinki.fi',
    displayId: 'A307',
    displayName: 'Exactum, A307, Meeting room, TEST (3)',
    capacity: 3,
    floorNumber: 3,
    isWheelchairAccessible: true,
    tags: ['MATHSTAT'],
  },
];

const mockReservations = [
  {
    id: 'test-id-3',
    room: {
      displayId: 'A307',
      id: 'test-room-id-307',
    },
    start: '2020-10-10T12:00:00.000Z',
    end: '2040-10-10T14:00:00.000Z',
  },
];

export async function mockFormsRoute(page, forms = mockForms) {
  await page.route('**/api/forms', route => {
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ source: 'fake response', data: forms }),
    });
  });
}

export async function mockRoomsRoute(page, rooms = mockRooms) {
  await page.route('**/api/rooms', route => {
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ source: 'fake response', data: rooms }),
    });
  });
}

export async function mockReservationsRoute(
  page,
  reservations = mockReservations
) {
  await page.route('**/api/reservations', route => {
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ source: 'fake response', data: reservations }),
    });
  });
}
