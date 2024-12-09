import fastify from 'fastify';
import fp from 'fastify-plugin';
import getConfig from '../lib/config/config.js';
import startServer from '../lib/server.js';

const runScript = async () => {
  const config = await getConfig();

  const server = fastify(config.fastifyInit);
  await server.register(fp(startServer), config);

  const process = server.cachePageService.deleteAllObjectsFromBucket;
  await process();
  console.log();

  process.exit();
};

runScript();
