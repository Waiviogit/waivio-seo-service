import fp from 'fastify-plugin';
import schema from './schema.js';

async function botStatisticsRoutes(fastify, opts) {
  const { botStatisticsService } = fastify;

  fastify.route({
    method: 'POST',
    path: '/bot-statistics',
    handler: addVisit,
    schema: schema.addVisit,
  });

  async function addVisit(req, reply) {
    const { userAgent } = req.body;

    const result = await botStatisticsService.addVisit({ userAgent });
    return { result: result?.modifiedCount };
  }
}

export default fp(botStatisticsRoutes);
