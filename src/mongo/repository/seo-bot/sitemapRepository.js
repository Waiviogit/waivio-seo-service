const sitemapModel = require('../../schemas/seo-bot/sitemapSchema');

const updateOne = async ({ filter, update, options }) => {
  try {
    const result = await sitemapModel.updateOne(filter, update, options);
    return { result };
  } catch (error) {
    return { error };
  }
};

const deleteMany = async ({ filter, options }) => {
  try {
    const result = await sitemapModel.deleteMany(filter, options);
    return { result };
  } catch (error) {
    return { error };
  }
};

const findOne = async ({ filter, projection, options }) => {
  try {
    const result = await sitemapModel.findOne(filter, projection, options);
    return { result };
  } catch (error) {
    return { error };
  }
};

const findOneByHostName = async ({ host, name }) => {
  const { result } = await findOne({
    filter: { host, name },
  });

  return result;
};

const createOne = async ({ host, name, page }) => {
  const { result } = await updateOne({
    filter: { host, name },
    update: { host, name, page },
    options: { upsert: true },
  });
  return result;
};

const deleteManyByHost = async ({ host }) => deleteMany({
  filter: { host },
});

module.exports = {
  createOne,
  findOneByHostName,
  deleteManyByHost,
};
