const _ = require('lodash');
const db = require('../mongo');
const { MAX_LINKS_XML } = require('../common/constants/sitemap');
const { createUsualSiteMap, createExtendedSiteMap } = require('../common/helpers/sitemapHelper');

const waivioApi = require('./waivioApi');
const { parseJson } = require('../common/helpers/jsonHelper');

const SOCIAL_HOSTS = ['social.gifts', 'socialgifts.pp.ua', 'localhost:4000'];

const checkForSocialSite = (host = '') => SOCIAL_HOSTS.some((sh) => host.includes(sh));

const formObjectLinks = ({ objects, host, social }) => {
  const links = [];
  for (const object of objects) {
    const directory = social && object.object_type === 'list' ? 'checklist' : 'object';
    links.push(`https://${host}/${directory}/${object.author_permlink}`);
  }
  return links;
};

const getListAndPagesNoAuthority = async ({ host }) => {
  const authorPermlinks = [];

  const linksToCheck = [];

  const app = await db.appRepository.findOneByHost({ host });
  if (!app) return authorPermlinks;

  const objectSettings = app?.configuration?.shopSettings?.type === 'object';
  if (!objectSettings) return authorPermlinks;

  const { result: mainObject } = await waivioApi
    .getObject({ authorPermlink: app?.configuration?.shopSettings?.value });
  if (!mainObject) return authorPermlinks;

  const menuItems = _.compact((mainObject.menuItem ?? [])
    .map((menu) => parseJson(menu.body, null)));

  for (const menuItem of menuItems) {
    if (menuItem.objectType === 'page') {
      authorPermlinks.push({
        author_permlink: menuItem.linkToObject,
        object_type: menuItem.objectType,
      });
    }
    if (menuItem.objectType === 'list') {
      const { result, error } = await waivioApi.getListItemLinks({
        authorPermlink: menuItem.linkToObject,
        scanEmbedded: true,
      });

      if (error) continue;
      linksToCheck.push(...result);
    }
  }
  if (!linksToCheck.length) return authorPermlinks;
  // search in db only types list and page
  const objects = await db.wobjectRepository.findListAndPageByLinks({
    links: linksToCheck,
  });
  authorPermlinks.push(...objects);

  return authorPermlinks;
};

const createLinks = async ({ host }) => {
  const app = await db.appRepository.findOneByHost({ host });
  if (!app) return [];

  const social = checkForSocialSite(app.parentHost);

  const mainObjectLists = await getListAndPagesNoAuthority({ host });
  const objects = await db.wobjectRepository.findSiteObjects({ app, social });

  const mainLinks = formObjectLinks({ host, objects: mainObjectLists, social });
  const searchLinks = formObjectLinks({ host, objects, social });

  return _.uniq([...mainLinks, ...searchLinks]);
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
