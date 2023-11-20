import fp from 'fastify-plugin';

async function fastifySitemapModel(fastify, serverOptions, next) {
  const { seoDb } = fastify;

  const sitemapModel = seoDb.models.sitemaps;

  const updateOne = async ({ filter, update, options }) => {
    try {
      const result = await sitemapModel.updateOne(filter, update, options);
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const deleteMany = async ({ filter, options }) => {
    try {
      const result = await sitemapModel.deleteMany(filter, options);
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const findOne = async ({ filter, projection, options }) => {
    try {
      const result = await sitemapModel.findOne(filter, projection, options);
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const find = async ({ filter, projection, options }) => {
    try {
      const result = await sitemapModel.find(filter, projection, options);
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const findOneByHostName = async ({ host, name }) => {
    const { result } = await findOne({
      filter: { host, name },
    });

    return result;
  };

  const createOne = async ({ host, name, page }) => {
    const { result } = await updateOne({
      filter: { host, name },
      update: { host, name, page },
      options: { upsert: true },
    });
    return result;
  };

  const deleteManyByHost = async ({ host }) => deleteMany({
    filter: { host },
  });

  const findAllNamesByHost = async ({ host }) => {
    const { result } = await find({ filter: { host }, projection: { name: 1 } });
    if (!result.length) return [];
    return result.map((el) => el.name);
  };

  fastify.decorate('sitemapModel', {
    createOne,
    findOneByHostName,
    deleteManyByHost,
    findAllNamesByHost,
  });

  next();
}

export default fp(fastifySitemapModel, { name: 'fastifySitemapModel' });
