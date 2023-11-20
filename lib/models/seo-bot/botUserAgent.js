import fp from 'fastify-plugin';

async function fastifyBotUserAgentModel(fastify, serverOptions, next) {
  const { seoDb } = fastify;

  const botUserAgentModel = seoDb.models.botuseragents;

  const findOne = async ({ filter, projection, options }) => {
    try {
      const result = await botUserAgentModel.findOne(filter, projection, options).lean();
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const userAgentExists = async ({ userAgent }) => {
    const { result } = await findOne({ filter: { userAgents: userAgent } });
    return !!result;
  };

  const createUserAgent = async ({ userAgents, type }) => {
    try {
      return {
        result: await botUserAgentModel.updateOne(
          { type },
          { $addToSet: { userAgents: { $each: userAgents } } },
          { upsert: true },
        ),
      };
    } catch (error) {
      return { error };
    }
  };

  fastify.decorate('botUserAgentModel', {
    userAgentExists,
    createUserAgent,
  });

  next();
}

export default fp(fastifyBotUserAgentModel, { name: 'fastifyBotUserAgentModel' });
