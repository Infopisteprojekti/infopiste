require('dotenv').config();

const { PORT } = process.env;

const MONGO_DB_URL = process.env.MONGO_DB_URL === 'test'
  ? process.env.TEST_MONGO_DB_URL
  : process.env.MONGO_DB_URL;

module.exports = {
  MONGO_DB_URL,
  PORT,
};
