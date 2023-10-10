const appModel = require('../../schemas/waivio/appSchema');

const findOne = async ({ filter, projection, options }) => {
  try {
    const result = await appModel.findOne(filter, projection, options).lean();
    return { result };
  } catch (error) {
    return { error };
  }
};

const find = async ({ filter, projection, options }) => {
  try {
    const result = await appModel.find(filter, projection, options).lean();
    return { result };
  } catch (error) {
    return { error };
  }
};

const findOneByHost = async ({ host }) => {
  const { result } = await findOne({
    filter: { host },
  });

  return result;
};

const findSitesHosts = async () => {
  const { result } = await find({
    filter: { inherited: true, canBeExtended: false },
    projection: { host: 1 },
  });
  if (!result.length) return [];
  return result.map((el) => el.host);
};

module.exports = {
  findOneByHost,
  findSitesHosts,
};
