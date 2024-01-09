function SitemapPostModel({ seoDb }) {
  const sitemapPostModel = seoDb.models.sitemap_posts;

  const updateOne = async ({ filter, update, options }) => {
    try {
      const result = await sitemapPostModel.updateOne(filter, update, options);
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const find = async ({ filter, projection, options }) => {
    try {
      const result = await sitemapPostModel.find(filter, projection, options);
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const createOne = async ({ host, author, permlink }) => {
    const { result } = await updateOne({
      filter: { host, author, permlink },
      update: { host, author, permlink },
      options: { upsert: true },
    });
    return result;
  };

  const findAllByHost = async ({ host }) => {
    const { result } = await find({ filter: { host } });
    if (!result.length) return [];
    return result;
  };

  return {
    createOne,
    findAllByHost,
  };
}

export default SitemapPostModel;
