import fp from 'fastify-plugin';
import createSitemapOp from '../domain/sitemap/createSitemap.js';
import updateAiStore from '../domain/waivioApi/updateAiStore.js';

async function sitemapService(fastify, options, next) {
  const { dbModels, redis } = fastify;

  const createSitemap = async ({ host }) => {
    await createSitemapOp({ host, dbModels, redis });
    const app = await dbModels.appModel.findOneByHost({ host });
    await updateAiStore({ host, userName: app.owner });
  };

  const addSitemapPost = async ({ host, author, permlink }) => {
    await dbModels.sitemapPostModel.createOne({ host, author, permlink });
    const { result } = await dbModels.postModel.findOneFirstByAuthor({ author });

    if (result?.permlink === permlink) {
      await dbModels.sitemapUserModel.createOne({ host, name: author });
    }

    return createSitemapOp({ host, dbModels, redis });
  };

  const getSitemap = async ({ host, name }) => {
    const doc = await dbModels.sitemapModel.findOneByHostName({ host, name });

    return doc?.page ?? '';
  };

  const deleteSitemap = async ({ host }) => dbModels.sitemapModel.deleteManyByHost({ host });

  fastify.decorate('sitemapService', {
    createSitemap,
    getSitemap,
    deleteSitemap,
    addSitemapPost,
  });

  next();
}

export default fp(sitemapService);
