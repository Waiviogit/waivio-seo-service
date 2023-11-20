import fp from 'fastify-plugin';

async function fastifyAppModel(fastify, serverOptions, next) {
  const { waivioDb } = fastify;

  const App = waivioDb.models.apps;

  const findOne = async ({ filter, projection, options }) => {
    try {
      const result = await App.findOne(filter, projection, options);
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const getAppAddsByHost = async (host) => {
    const { result } = await findOne({ filter: { host } });

    return result?.adSense?.txtFile ?? '';
  };

  fastify.decorate('appModel', {
    getAppAddsByHost,
  });

  next();
}

export default fp(fastifyAppModel, { name: 'fastifySubscriptionModel' });
