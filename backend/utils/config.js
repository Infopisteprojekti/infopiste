export const PORT = process.env.PORT || 1234;

export const MONGO_DB_URL = process.env.MONGO_DB_URL;

export const CLIENT_ID = process.env.CLIENT_ID;

export const CLIENT_SECRET = process.env.CLIENT_SECRET;

export const TENANT_ID = process.env.TENANT_ID;

export const GROUP_ID = process.env.GROUP_ID;

export const FILE_ID = process.env.FILE_ID;

export const SHEET_NAME = process.env.SHEET_NAME;

export const FOLDER_ID = process.env.FOLDER_ID;

const REDIS_HOST = process.env.REDIS_HOST;

export const REDIS_URL = `redis://default:redis@${REDIS_HOST}:6379`;

export const TTL_SECONDS = 60;

export const LOAD_MOCK_DATA = process.env.LOAD_MOCK_DATA === 'true';

export const MAX_PDF_DAYS = 14;
