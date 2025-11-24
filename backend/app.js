import express from 'express';
import cors from 'cors';

import {
  requestLogger,
  unknownEndpoint,
  apiLimiter,
} from './utils/middleware.js';
import roomsRouter from './controllers/rooms.js';
import reservationsRouter from './controllers/reservations.js';
import formsRouter from './controllers/forms.js';
import unicafeRouter from './controllers/unicafe.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiLimiter);
app.use(requestLogger);

app.set('trust proxy', 1);

app.use('/api/rooms', roomsRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/forms', formsRouter);
app.use('/api/unicafe', unicafeRouter);

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use(unknownEndpoint);

export default app;
