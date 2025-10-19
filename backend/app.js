import express from 'express';
import cors from 'cors';

import { requestLogger, unknownEndpoint } from './utils/middleware.js';
import roomsRouter from './controllers/rooms.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/rooms', roomsRouter);

app.get('/', (req, res) => res.send('infonäyttö backend'));
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use(unknownEndpoint);

export default app;