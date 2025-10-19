import { createClient } from 'redis';
import logger from './logger.js';
import { REDIS_URL } from './config.js';

const redisClient = createClient({
  url: REDIS_URL,
});

const client = {
  get: key => redisClient.get(key),
  set: (key, value, options = {}) => redisClient.set(key, value, options),
  expire: (key, seconds) => redisClient.expire(key, seconds),
  del: key => redisClient.del(key),

  async testConnection() {
    await redisClient.connect();

    await redisClient.set('key', 'value');
    await redisClient.get('key');
    await redisClient.del('key');
    logger.info('Redis client connected');
  },

  async connect() {
    redisClient.on('error', err => logger.error('Redis client error', err));
    logger.info('Connecting to redis');
    await this.testConnection();
  },
};

export default client;