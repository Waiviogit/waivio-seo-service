import fp from 'fastify-plugin';

async function cachePageService(fastify, options, next) {
  const { dbModels, redis } = fastify;

  const getPageByUrl = async ({ url }) => {
    const page = await dbModels.cachePageModel.findPageByUrl({ url });
    if (page) {
      await redis.client2.incr('cached_page_requested');
    }
    return page;
  };

  const createPage = async ({ url, page }) => {
    const { result, error } = await dbModels.cachePageModel.createPage({ url, page });
    if (error) return { error };
    return { result };
  };

  const getAppAddsByHost = async ({ host }) => dbModels.appModel.getAppAddsByHost(host);

  fastify.decorate('cachePageService', {
    getPageByUrl,
    createPage,
    getAppAddsByHost,
  });

  next();
}

export default fp(cachePageService);
