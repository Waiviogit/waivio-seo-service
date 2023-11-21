function CachePageModel({ seoDb }) {
  const cachePageModel = seoDb.models.cachePage;

  const findOne = async ({ filter, projection, options }) => {
    try {
      const result = await cachePageModel.findOne(filter, projection, options).lean();
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const findPageByUrl = async ({ url }) => {
    const { result } = await findOne({ filter: { url } });
    return result?.page ?? '';
  };

  const createPage = async ({ url, page }) => {
    try {
      return {
        result: await cachePageModel.create({
          url,
          page,
        }),
      };
    } catch (error) {
      return { error };
    }
  };

  return {
    findPageByUrl,
    createPage,
    findOne,
  };
}

export default CachePageModel;
