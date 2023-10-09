const { sitemapValidation } = require('./validation');
const operations = require('../operations');

const createSitemap = async ({ host }) => {
  const validation = sitemapValidation.createSitemapSchema.validate({ host });
  if (validation.error) return validation.error;
  await operations.sitemap.createSiteMap({ host });
};

const getSitemap = async ({ host, name }) => {
  const validation = sitemapValidation.getSitemapSchema.validate({ host, name });
  if (validation.error) return validation.error;
  return operations.sitemap.getSiteMap({ host, name });
};

const deleteSitemap = async ({ host }) => {
  const validation = sitemapValidation.createSitemapSchema.validate({ host });
  if (validation.error) return validation.error;
  return operations.sitemap.deleteSitemap({ host });
};

module.exports = { createSitemap, getSitemap, deleteSitemap };
