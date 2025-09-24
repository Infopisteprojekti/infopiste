import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import logger from './utils/logger.js';
import { PORT, MONGO_DB_URL } from './utils/config.js';
import {generateRooms} from './mockdata/generate-room-data.js';

mongoose.set('strictQuery', false);

logger.info('Connecting to', MONGO_DB_URL);

mongoose.connect(MONGO_DB_URL)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(error => {
    logger.error('error connection to MongoDB:', error.message);
  });

// Temporary solution by using mock data
const ROOMS = generateRooms();

const app = express();

export default app;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('infonäyttö backend'));

app.get('/api/hello', async (req, res) => {
  res.json({message: 'hello from backend server'});
});

app.get('/health', (req, res) => res.status(200).json({status: 'ok'}));

app.get('/api/rooms', async (req, res) => {
  res.json(ROOMS);
});

app.get('/api/rooms/:id', async (req, res) => {
  const room = ROOMS.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({error: 'Room not found'});
  }

  res.json(room);
});

app.get('/api/rooms/:id/reservations', async (req, res) => {
  const {id} = req.params;
  const {date} = req.query;

  const room = ROOMS.find(r => r.id === id);
  if (!room) {
    return res.status(404).json({error: 'Room not found'});
  }

  let {reservations} = room;
  if (date) {
    reservations = reservations.filter(r =>
      r.start.dateTime.startsWith(date));
  }

  res.json(reservations);
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

