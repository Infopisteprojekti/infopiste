import { createClient } from 'redis';
import { REDIS_URL } from '../utils/config.js';

let redis;

export async function initRedis() {
  console.log("Connecting to Redis", REDIS_URL);
  if (!redis) {
    redis = createClient({ url: REDIS_URL });

    redis.on('error', err => console.log('Redis Client Error', err));

    await redis.connect();

    console.log('Connected to redis');
  }
  return redis;
}

export function getRedis() {
  if (!redis) {
    throw new Error('Redis not initialized. Call initRedis() first');
  }
  return redis;
}
