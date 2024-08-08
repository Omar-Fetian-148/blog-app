import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { config } from "dotenv";
config();


// Create Redis clients
const publisher = new Redis(process.env.REDIS_URL);
const subscriber = new Redis(process.env.REDIS_URL);
const cacheClient = new Redis(process.env.REDIS_URL);

const pubsub = new RedisPubSub({
  publisher,
  subscriber,
});

// Error handling function
function handleRedisError(type) {
  return (error) => {
    console.error(`${type} Redis error:`, error);
    if (error instanceof Error && error.code === 'ECONNREFUSED') {
      console.error('Redis connection refused. Check if Redis server is running.');
    }
  };
}

subscriber.on('error', handleRedisError('Subscriber'));
publisher.on('error', handleRedisError('Publisher'));

// Cache helper functions
async function setCache(key, value, expiryInSeconds) {
  try {
    await cacheClient.set(key, JSON.stringify(value), 'EX', expiryInSeconds);
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

async function getCache(key) {
  try {
    const result = await cacheClient.get(key);
    return result ? JSON.parse(result) : null; // Handle null case
  } catch (error) {
    console.error('Error getting cache:', error);
  }
}

// Queue helper functions
async function enqueue(queueName, value) {
  try {
    await cacheClient.rpush(queueName, JSON.stringify(value));
  } catch (error) {
    console.error('Error enqueueing:', error);
  }
}

async function dequeue(queueName) {
  try {
    const result = await cacheClient.lpop(queueName);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.error('Error dequeueing:', error);
  }
}

export { publisher, subscriber, pubsub, cacheClient,  setCache, getCache, enqueue, dequeue };
