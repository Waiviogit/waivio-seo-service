const db = require('../mongo');
const { MAX_LINKS_XML } = require('../common/constants/sitemap');
const { createUsualSiteMap, createExtendedSiteMap } = require('../common/helpers/sitemapHelper');

const SOCIAL_HOSTS = ['social.gifts', 'socialgifts.pp.ua', 'localhost:4000'];

const checkForSocialSite = (host = '') => SOCIAL_HOSTS.some((sh) => host.includes(sh));

const createLinks = async ({ host }) => {
  const links = [];

  const app = await db.appRepository.findOneByHost({ host });
  if (!app) return links;
  const social = checkForSocialSite(app.parentHost);
  const objects = await db.wobjectRepository.findSiteObjects({ app, social });

  for (const object of objects) {
    const directory = social && object.object_type === 'list' ? 'checklist' : 'object';
    links.push(`https://${host}/${directory}/${object.author_permlink}`);
  }

  return links;
};

const createSiteMap = async ({ host }) => {
  const links = await createLinks({ host });
  if (links.length < MAX_LINKS_XML) {
    await createUsualSiteMap({ links, host });
    return;
  }
  await createExtendedSiteMap({ links, host });
};

const getSiteMap = async ({ host, name }) => {
  const doc = await db.sitemapRepository.findOneByHostName({ host, name });

  return doc?.page ?? '';
};

const deleteSitemap = async ({ host }) => db.sitemapRepository.deleteManyByHost({ host });

module.exports = {
  createSiteMap,
  getSiteMap,
  deleteSitemap,
};
