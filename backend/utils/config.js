export const PORT = process.env.PORT || 1234;

export const MONGO_DB_URL = process.env.MONGO_DB_URL;

export const CLIENT_ID = process.env.CLIENT_ID;

export const CLIENT_SECRET = process.env.CLIENT_SECRET;

export const TENANT_ID = process.env.TENANT_ID;

export const TEST = process.env.TEST === 'true';

export const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379/0';

export const TTL_SECONDS = 60;

export const AVAILABLE_ROOMS = [
  'exactum.b233',
  'exactum.a214',
  'exactum.a218b',
  'exactum.a307',
];