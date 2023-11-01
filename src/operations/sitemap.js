const _ = require('lodash');
const db = require('../mongo');
const { MAX_LINKS_XML } = require('../common/constants/sitemap');
const { createUsualSiteMap, createExtendedSiteMap } = require('../common/helpers/sitemapHelper');

const waivioApi = require('./waivioApi');
const { parseJson } = require('../common/helpers/jsonHelper');

const SOCIAL_HOSTS = ['social.gifts', 'socialgifts.pp.ua', 'localhost:4000'];

const customSort = (a, b) => {
  const order = ['list', 'page'];

  const typeA = a.object_type;
  const typeB = b.object_type;

  const indexA = order.indexOf(typeA);
  const indexB = order.indexOf(typeB);

  if (indexA === -1 && indexB === -1) {
    return 0; // Keep the original order for other types
  }

  if (indexA === -1) {
    return 1; // Move the non-list/page objects to the end
  }

  if (indexB === -1) {
    return -1; // Move the non-list/page objects to the end
  }

  return indexA - indexB;
};

const checkForSocialSite = (host = '') => SOCIAL_HOSTS.some((sh) => host.includes(sh));

const formObjectLinks = ({ objects, host, social }) => {
  const links = [];
  for (const object of objects) {
    const directory = social && object.object_type === 'list' ? 'checklist' : 'object';
    let link = `https://${host}/${directory}/${object.author_permlink}`;
    if (object.object_type === 'newsfeed') {
      link = `https://${host}/${directory}/${object.author_permlink}/newsfeed`;
    }
    if (object.object_type === 'widget') {
      link = `https://${host}/${directory}/${object.author_permlink}/widget`;
    }
    links.push(link);
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
      continue;
    }
    if (menuItem.objectType === 'list') {
      const { result, error } = await waivioApi.getListItemLinks({
        authorPermlink: menuItem.linkToObject,
        scanEmbedded: true,
      });

      if (error) continue;
      linksToCheck.push(...result);
      continue;
    }
    authorPermlinks.push({
      author_permlink: menuItem.linkToObject,
      object_type: menuItem.objectType,
    });
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

  const resultObjects = _.uniqBy([...mainObjectLists, ...objects].sort(customSort), 'author_permlink');

  const searchLinks = formObjectLinks({ host, objects: resultObjects, social });

  return searchLinks;
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
