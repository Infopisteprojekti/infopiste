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

export const mockRooms = [
  {
    id: 'A344',
    type: 'meeting',
    reservations: [],
  },
  {
    id: 'A345',
    type: 'meeting',
    reservations: [
      {
        id: 1,
        subject: 'Best Meeting',
        organizer: 'Some Person',
        start: {
          dateTime: '1990-01-01T12:00:00',
          timeZone: 'UTC',
        },
        end: {
          dateTime: '2125-01-01T12:00:00',
          timeZone: 'UTC',
        },
        location: {
          displayName: 'Room A345',
          locationType: 'confRoom',
        },
      },
    ],
  },
  {
    id: 'A346',
    type: 'office',
    reservations: [],
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
      body: JSON.stringify(rooms),
    });
  });
}
