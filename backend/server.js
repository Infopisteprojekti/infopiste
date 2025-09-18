import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
import cors from 'cors';
import mongoose from 'mongoose';
import {generateRooms} from './mockdata/generate-room-data.js';

mongoose.set('strictQuery', false);

const dbUrl = process.env.MONGO_DB_URL;

// A const infoSchema = new mongoose.Schema({
// A   fileName: String,
// A   file: Buffer,
// A });

const PORT = process.env.PORT || 1234;

// Temporary solution by using mock data
const ROOMS = generateRooms();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('infonäyttö back'));

app.get('/api/hello', async (req, res) => {
  res.json({message: 'hello from backend server'});
});

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

app.listen(PORT, async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);

  try {
    console.log('Connecting to the database in', dbUrl);
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to the database', error);
  }
});

// A module.exports = mongoose.model("Info", infoSchema);
