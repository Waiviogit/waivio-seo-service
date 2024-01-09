import fp from 'fastify-plugin';
import schema from './schema.js';

async function sitemapRoutes(fastify, opts) {
  const { sitemapService } = fastify;

  fastify.route({
    method: 'GET',
    path: '/sitemap',
    handler: getSitemap,
    schema: schema.getSitemap,
  });

  async function getSitemap(req, reply) {
    const { host, name } = req.query;

    return sitemapService.getSitemap({ host, name });
  }

  fastify.route({
    method: 'POST',
    path: '/sitemap',
    handler: createSitemap,
    schema: schema.createSitemap,
  });

  async function createSitemap(req, reply) {
    const { host } = req.body;

    return sitemapService.createSitemap({ host });
  }

  fastify.route({
    method: 'DELETE',
    path: '/sitemap',
    handler: deleteSitemap,
    schema: schema.deleteSitemap,
  });

  async function deleteSitemap(req, reply) {
    const { host } = req.body;

    return sitemapService.deleteSitemap({ host });
  }

  fastify.route({
    method: 'POST',
    path: '/sitemap/post',
    handler: addSitemapPost,
    schema: schema.addSitemapPost,
  });

  async function addSitemapPost(req, reply) {
    const { host, author, permlink } = req.body;

    return sitemapService.addSitemapPost({ host, author, permlink });
  }
}

export default fp(sitemapRoutes);
