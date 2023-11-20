import fp from 'fastify-plugin';

async function fastifyCachePageModel(fastify, serverOptions, next) {
  const { seoDb } = fastify;

  const cachePageModel = seoDb.models.cachepages;

  const findOne = async ({ filter, projection, options }) => {
    try {
      const result = await cachePageModel.findOne(filter, projection, options).lean();
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const findPageByUrl = async ({ url }) => {
    const { result } = await findOne({ filter: { url } });
    return result?.page ?? '';
  };

  const createPage = async ({ url, page }) => {
    try {
      return {
        result: await cachePageModel.create({
          url,
          page,
        }),
      };
    } catch (error) {
      return { error };
    }
  };

  fastify.decorate('cachePageModel', {
    findPageByUrl,
    createPage,
    findOne,
  });

  next();
}

export default fp(fastifyCachePageModel, { name: 'fastifyCachePageModel' });
