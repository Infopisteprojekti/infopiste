export const PORT = process.env.PORT || 1234;

export const MONGO_DB_URL =
  process.env.MONGO_DB_URL === 'test'
    ? process.env.TEST_MONGO_DB_URL
    : process.env.MONGO_DB_URL;

export const TENANT_ID = process.env.TENANT_ID;

export const CLIENT_ID = process.env.CLIENT_ID;

export const CLIENT_SECRET = process.env.CLIENT_SECRET;
