import fp from 'fastify-plugin';

async function botStatisticsService(fastify, options, next) {
  const { botStatisticsModel } = fastify;

  const addVisit = async ({ userAgent = '' }) => {
    if (!userAgent) return;
    return botStatisticsModel.incrementVisit({ userAgent });
  };

  fastify.decorate('botStatisticsService', {
    addVisit,
  });

  next();
}

export default fp(botStatisticsService);
