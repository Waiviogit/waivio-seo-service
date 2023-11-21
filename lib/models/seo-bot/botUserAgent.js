function BotUserAgentModel({ seoDb }) {
  const botUserAgentModel = seoDb.models.botUserAgent;

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

  return {
    userAgentExists,
    createUserAgent,
  };
}

export default BotUserAgentModel;
