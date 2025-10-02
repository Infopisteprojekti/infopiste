export const PORT = process.env.PORT || 1234;

export const MONGO_DB_URL =
  process.env.MONGO_DB_URL === 'test'
    ? process.env.TEST_MONGO_DB_URL
    : process.env.MONGO_DB_URL;

export const MS_SETTINGS = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  tenantId: process.env.TENANT_ID,
};

export const SKIP_GRAPH = process.env.SKIP_GRAPH === 'true';

export const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379/0';
export const TTL_SECONDS = 60;
