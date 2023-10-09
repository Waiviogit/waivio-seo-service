const fastify = require('fastify')({ logger: true });

const api = require('./src/api/index');
const ws = require('./src/ws');

require('./src/jobs');

fastify.listen({ port: process.env.PORT || 10020, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

fastify.addHook('preValidation', async (request, reply) => {
  const { headers } = request;
  const key = headers['api-key'];
  const wrongKey = key !== process.env.SEO_SERVICE_API_KEY;
  if (wrongKey) {
    await reply.code(401).send('not authenticated');
  }
});

ws.init(fastify, api);
