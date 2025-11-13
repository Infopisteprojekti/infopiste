import logger from './logger.js';

export const requestLogger = (request, response, next) => {
  logger.info(
    `${new Date().toISOString()} - ${request.method} ${request.path}`
  );
  next();
};

export const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
