import fp from 'fastify-plugin';
import schema from './schema.js';

async function userAgentRoutes(fastify, opts) {
  const { botAgentService } = fastify;

  fastify.route({
    method: 'GET',
    path: '/user-agent',
    handler: userAgentExists,
    schema: schema.checkUserAgent,
  });

  async function userAgentExists(req, reply) {
    const { userAgent } = req.query;

    const result = await botAgentService.userAgentExists({ userAgent });
    return { result };
  }
}

export default fp(userAgentRoutes);
