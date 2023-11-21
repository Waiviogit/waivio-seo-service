import fp from 'fastify-plugin';

async function botStatisticsService(fastify, options, next) {
  const { dbModels } = fastify;

  const addVisit = async ({ userAgent = '' }) => {
    if (!userAgent) return;
    return dbModels.botStatisticsModel.incrementVisit({ userAgent });
  };

  fastify.decorate('botStatisticsService', {
    addVisit,
  });

  next();
}

export default fp(botStatisticsService);
