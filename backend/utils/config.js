import 'dotenv/config';

const { PORT } = process.env;

const MONGO_DB_URL = process.env.MONGO_DB_URL === 'test'
  ? process.env.TEST_MONGO_DB_URL
  : process.env.MONGO_DB_URL;

export default { MONGO_DB_URL, PORT };
