const intitialRooms = [
  {
    id: 'test-room-id-123',
    roomEmail: 'exactum.a123@helsinki.fi',
    displayId: 'A123',
    displayName: 'Exactum, A123, Meeting room, TEST (1)',
    capacity: 1,
    floorNumber: 1,
    isWheelchairAccessible: true,
    tags: ['CS'],
  },
  {
    id: 'test-room-id-234',
    roomEmail: 'exactum.b234@helsinki.fi',
    displayId: 'B234',
    displayName: 'Exactum, B234, Meeting room, TEST (2)',
    capacity: 2,
    floorNumber: 2,
    isWheelchairAccessible: true,
    tags: ['CS'],
  },
  {
    id: 'test-room-id-345',
    roomEmail: 'exactum.c345@helsinki.fi',
    displayId: 'C345',
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
    room: {
      displayId: 'A123',
      id: 'test-room-id-123',
    },
    start: '2025-10-10T12:00:00.000Z',
    end: '2025-10-10T14:00:00.000Z',
  },
  {
    id: 'test-id-2',
    room: {
      displayId: 'B234',
      id: 'test-room-id-123',
    },
    start: '2025-10-11T12:00:00.000Z',
    end: '2025-10-11T14:00:00.000Z',
  },
  {
    id: 'test-id-3',
    room: {
      displayId: 'C345',
      id: 'test-room-id-123',
    },
    start: '2025-10-12T12:00:00.000Z',
    end: '2025-10-12T14:00:00.000Z',
  },
];

const mockSubmissions = [
  {
    Id: '1',
    'Ilmoituksen otsikko': 'Form 1',
    Email: 'test1@example.com',
    Aloituspvm: '2025-12-02T00:00:00.000Z',
    Lopetuspvm: '2025-12-05T23:59:59.999Z',
    'Ilmoitus pdf-muodossa': 'https://example.com/doc1',
  },
  {
    Id: '2',
    'Ilmoituksen otsikko': 'Form 2',
    Email: 'test2@example.com',
    Aloituspvm: '2025-12-04T00:00:00.000Z',
    Lopetuspvm: '2025-12-10T23:59:59.999Z',
    'Ilmoitus pdf-muodossa': 'https://example.com/doc2',
  },
  {
    Id: '3',
    'Ilmoituksen otsikko': 'Form 3',
    Email: 'test3@example.com',
    Aloituspvm: '2025-12-04T00:00:00.000Z',
    Lopetuspvm: '2025-12-11T23:59:59.999Z',
    'Ilmoitus pdf-muodossa': 'https://example.com/doc3',
  },
  {
    Id: '4',
    'Ilmoituksen otsikko': 'Form 4',
    Email: 'test4@example.com',
    Aloituspvm: '2025-12-06T00:00:00.000Z',
    Lopetuspvm: '2025-12-18T23:59:59.999Z',
    'Ilmoitus pdf-muodossa': 'https://example.com/doc4',
  },
];

const mockFiles = [
  {
    id: '11',
    webUrl: 'https://example.com/doc1',
    downloadUrl: 'https://example.com/download/doc1',
  },
  {
    id: '12',
    webUrl: 'https://example.com/doc2',
    downloadUrl: 'https://example.com/download/doc2',
  },
  {
    id: '13',
    webUrl: 'https://example.com/doc3',
    downloadUrl: 'https://example.com/download/doc3',
  },
  {
    id: '14',
    webUrl: 'https://example.com/doc4',
    downloadUrl: 'https://example.com/download/doc4',
  },
];

const mockCachedForms = [
  {
    id: 1,
    title: 'Form 1',
    fileUrl: '/api/forms/proxy-pdf?url=https%3A%2F%2example.com%2Fdoc1.pdf',
  },
];

export default {
  intitialRooms,
  initialReservations,
  mockSubmissions,
  mockFiles,
  mockCachedForms,
};
