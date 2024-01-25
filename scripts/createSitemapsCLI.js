import fastify from 'fastify';
import getConfig from '../lib/config/config.js';
import startServer from '../lib/server.js';
import createSiteMap from '../lib/domain/sitemap/createSitemap.js';

const runScript = async () => {
  const config = await getConfig();

  const server = fastify(config.fastifyInit);
  await server.register(startServer, config);

  const { dbModels, redis } = server;

  const hosts = await dbModels.appModel.findSitesHosts();

  for (const host of hosts) {
    await createSiteMap({ host, dbModels, redis });
    console.log(`sitemap for ${host} updated`);
  }
  console.log('createSitemapJob finished');

  process.exit();
};

runScript();
