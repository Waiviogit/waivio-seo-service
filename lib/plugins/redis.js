import fp from 'fastify-plugin';
import { createClient } from 'redis';

async function fastifyRedis(fastify, options, next) {
  try {
    const client2 = await createClient({
      url: options.redis.url,
      database: 2,
    })
      .on('error', (err) => fastify.log.error('Redis Client Error', err))
      .connect();

    const client10 = await createClient({
      url: options.redis.url,
      database: 10,
    })
      .on('error', (err) => fastify.log.error('Redis Client Error', err))
      .connect();

    fastify.log.info('redis client connected');

    fastify
      .decorate('redis', {
        client2,
        client10,
      })
      .addHook('onClose', async (instance, done) => {
        await client2.disconnect();
        await client10.disconnect();

        delete instance.redis;
        done();
      });

    next();
  } catch (err) {
    next(err);
  }
}

export default fp(fastifyRedis, { name: 'fastify-redis' });
