import fp from 'fastify-plugin';

async function subscription(fastify, opts) {
  const { subscriptionModel } = fastify;

  fastify.route({
    method: 'GET',
    path: '/subscription',
    handler: getSub,
  });

  async function getSub(req, reply) {
    const { subscription: result } = await subscriptionModel.findOne({});
    console.log();
    return result;
  }
}

export default fp(subscription);
