import express from 'express';
import cors from 'cors';

import { requestLogger, unknownEndpoint } from './utils/middleware.js';
import roomsRouter from './controllers/rooms.js';
import reservationsRouter from './controllers/reservations.js';
import formsRouter from './controllers/forms.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/rooms', roomsRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/forms', formsRouter);

app.get('api/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use(unknownEndpoint);

export default app;
