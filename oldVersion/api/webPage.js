const db = require('../mongo');
const { webPageValidation } = require('./validation');

const getPageByUrl = async ({ url }, server) => {
  const { redis } = server;

  await redis.redis2.incr('cached_page_requested');
  const validation = webPageValidation.getPageSchema.validate({ url });
  if (validation.error) return validation.error;
  return db.cachePageRepository.findPageByUrl({ url });
};

const createPage = async ({ url, page }) => {
  const validation = webPageValidation.createPageSchema.validate({ url, page });
  if (validation.error) return validation.error;

  const { result, error } = await db.cachePageRepository.createPage({ url, page });
  if (error) return { error };
  return { result };
};

module.exports = { getPageByUrl, createPage };
