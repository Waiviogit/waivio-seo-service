import fp from 'fastify-plugin';
import schema from './schema.js';

async function botStatisticsRoutes(fastify, opts) {
  const { cachePageService } = fastify;

  fastify.route({
    method: 'POST',
    path: '/cache-page',
    handler: create,
    schema: schema.createPage,
  });

  async function create(req, reply) {
    const { url, page } = req.body;

    const { result } = await cachePageService.createPage({ url, page });
    return { result: !!result };
  }

  fastify.route({
    method: 'GET',
    path: '/cache-page',
    handler: getPage,
    schema: schema.getPage,
  });

  async function getPage(req, reply) {
    const { url } = req.query;

    return cachePageService.getPageByUrl({ url });
  }
}

export default fp(botStatisticsRoutes);
