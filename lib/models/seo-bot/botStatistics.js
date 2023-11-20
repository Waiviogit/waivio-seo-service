import fp from 'fastify-plugin';

async function fastifyBotStatisticsModel(fastify, serverOptions, next) {
  const { seoDb } = fastify;

  const botUserAgentModel = seoDb.models.botstatistics;

  const updateOne = async ({ filter, update, options }) => {
    try {
      const result = await botUserAgentModel.updateOne(filter, update, options);
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const incrementVisit = async ({ userAgent }) => {
    const { result } = await updateOne({
      filter: { userAgent },
      update: { $inc: { timesEntered: 1 } },
      options: { upsert: true },
    });
    return result;
  };

  fastify.decorate('botStatisticsModel', {
    incrementVisit,
  });

  next();
}

export default fp(fastifyBotStatisticsModel, { name: 'fastifyBotStatisticsModel' });
