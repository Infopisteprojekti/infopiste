export const PORT = process.env.PORT || 1234;

export const MONGO_DB_URL =
  process.env.MONGO_DB_URL === 'test'
    ? process.env.TEST_MONGO_DB_URL
    : process.env.MONGO_DB_URL;

export const MS_SETTINGS = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  tenantId: process.env.tenantId,
};

export const SKIP_GRAPH = process.env.SKIP_GRAPH === 'true';
