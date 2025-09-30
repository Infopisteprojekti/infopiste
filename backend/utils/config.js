export const PORT = process.env.PORT || 1234;

export const MONGO_DB_URL =
  process.env.MONGO_DB_URL === 'test'
    ? process.env.TEST_MONGO_DB_URL
    : process.env.MONGO_DB_URL;

export const MS_API_KEY = process.env.MS_API_KEY;
