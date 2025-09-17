import { faker } from '@faker-js/faker';
import fs from 'fs';

const DATE_RANGE = { min: 17, max: 20 };
const RESERVATION_LIMIT = 4;
const OUTPUT_FILE = 'room_data_mock.json';

function formatTime(hour, minute) {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function generateReservation() {
  const startHour = faker.number.int({ min: 8, max: 16 });
  const startMinute = faker.number.int({ min: 0, max: 59 });

  const duration = faker.number.int({ min: 1, max: 4 });
  const endHour = startHour + duration;
  const endMinute = faker.number.int({ min: 0, max: 59 });

  const day = faker.number.int(DATE_RANGE);
  const dayStr = day.toString().padStart(2, '0');

  const startTime = formatTime(startHour, startMinute);
  const endTime = formatTime(endHour, endMinute);

  return {
    start_time: `2025-09-${dayStr}T${startTime}:00Z`,
    end_time: `2025-09-${dayStr}T${endTime}:00Z`,
    host: faker.person.fullName(),
    title: faker.company.catchPhrase(),
  };
}

function generateRoom(roomId) {
  const types = ['office', 'classroom', 'meeting_room'];
  const type = faker.helpers.arrayElement(types);

  const reservations = [];
  if (type !== 'office') {
    const numReservations = faker.number.int({
      min: 0,
      max: RESERVATION_LIMIT,
    });
    for (let i = 0; i < numReservations; i++) {
      reservations.push(generateReservation(roomId));
    }
    reservations.sort((a, b) => a.start_time.localeCompare(b.start_time));
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
