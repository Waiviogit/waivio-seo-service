function SitemapUserModel({ seoDb }) {
  const sitemapUserModel = seoDb.models.sitemap_users;

  const createOne = async ({ host, name }) => {
    try {
      const result = await sitemapUserModel.create({
        host, name,
      });

      return { result };
    } catch (error) {
      return { error };
    }
  };

  const find = async ({ filter, projection, options }) => {
    try {
      const result = await sitemapUserModel.find(filter, projection, options);
      return { result };
    } catch (error) {
      return { error };
    }
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

export default SitemapUserModel;
