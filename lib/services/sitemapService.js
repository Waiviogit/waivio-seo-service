import fp from 'fastify-plugin';
import createSitemapOp from '../domain/sitemap/createSitemap.js';

async function sitemapService(fastify, options, next) {
  const { dbModels } = fastify;

  const createSitemap = async ({ host }) => createSitemapOp({ host, dbModels });

  const getSitemap = async ({ host, name }) => {
    const doc = await dbModels.sitemapModel.findOneByHostName({ host, name });

    return doc?.page ?? '';
  };

  const deleteSitemap = async ({ host }) => dbModels.sitemapModel.deleteManyByHost({ host });

  fastify.decorate('sitemapService', {
    createSitemap,
    getSitemap,
    deleteSitemap,
  });

  next();
}

export default fp(sitemapService);
