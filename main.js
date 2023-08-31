const fastify = require('fastify')({ logger: true });

const api = require('./src/api/index');
const ws = require('./src/ws');

fastify.listen({ port: process.env.PORT || 10020, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

ws.init(fastify, api);
