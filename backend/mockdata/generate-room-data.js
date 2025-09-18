/* Script for generating mock room reservation data.
 *
 * Generates data for rooms A309-319 and A335-348.
 *
 * Usage: run 'node generate-room-data.js'.
 *
 * Fixed seed for reproducible data.
 */

import { faker } from '@faker-js/faker';
import fs from 'fs';

const DATE_RANGE = { min: 17, max: 24 };
const RESERVATION_LIMIT_PER_DAY = 3;
const OUTPUT_FILE = 'room_data_mock.json';
const SEED = 42;

faker.seed(SEED);

function generateReservations(day, roomId) {
  const reservations = [];
  const numReservations = faker.number.int({
    min: 0,
    max: RESERVATION_LIMIT_PER_DAY,
  });
  let currentHour = faker.number.int({ min: 8, max: 11 });
  const maxHour = 18;

  for (let i = 0; i < numReservations; i++) {
    const durationHours = faker.number.int({ min: 1, max: 4 });
    const start = `2025-09-${day.toString().padStart(2, '0')}T${String(currentHour).padStart(2, '0')}:00:00`;
    const endHour = currentHour + durationHours;

    if (endHour > maxHour) break;

    const end = `2025-09-${day.toString().padStart(2, '0')}T${String(endHour).padStart(2, '0')}:00:00`;

    reservations.push({
      id: faker.string.uuid(),
      subject: faker.company.catchPhrase(),
      organizer: {
        emailAddress: {
          name: faker.person.fullName(),
          address: faker.internet.email(),
        },
      },
      start: {
        dateTime: start,
        timeZone: 'Europe/Helsinki',
      },
      end: {
        dateTime: end,
        timeZone: 'Europe/Helsinki',
      },
      location: {
        displayName: roomId,
      },
    });
    currentHour = endHour + faker.number.int({ min: 0, max: 2 });
    if (currentHour >= maxHour) break;
  }
  return reservations;
}

function generateRoom(roomId) {
  const types = ['office', 'classroom', 'meeting_room'];
  const type = faker.helpers.arrayElement(types);

  const reservations = [];
  if (type !== 'office') {
    for (let day = DATE_RANGE.min; day <= DATE_RANGE.max; day++) {
      reservations.push(...generateReservations(day, roomId));
    }
  }

  let capacity;
  if (type === 'office') capacity = faker.number.int({ min: 1, max: 4 });
  else if (type === 'meeting_room')
    capacity = faker.number.int({ min: 4, max: 12 });
  else capacity = faker.number.int({ min: 15, max: 40 });

  return {
    id: roomId,
    type,
    capacity,
    reservations,
  };
}

function generateRooms() {
  const idRanges = [
    { min: 309, max: 319 },
    { min: 335, max: 348 },
  ];
  const roomIds = [];
  for (const range of idRanges) {
    for (let id = range.min; id <= range.max; id++) {
      roomIds.push(`A${id}`);
    }
  }

  return roomIds.map((id) => generateRoom(id));
}

console.log('Generating room data');
const data = generateRooms();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
console.log(`Done! Wrote data to ${OUTPUT_FILE}`);
