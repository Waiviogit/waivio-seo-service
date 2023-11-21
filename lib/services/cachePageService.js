import fp from 'fastify-plugin';

async function cachePageService(fastify, options, next) {
  const { dbModels } = fastify;

  const getPageByUrl = async ({ url }) => dbModels.cachePageModel.findPageByUrl({ url });

  const createPage = async ({ url, page }) => {
    const { result, error } = await dbModels.cachePageModel.createPage({ url, page });
    if (error) return { error };
    return { result };
  };

  fastify.decorate('cachePageService', {
    getPageByUrl,
    createPage,
  });

  next();
}

export default fp(cachePageService);
