import _ from 'lodash';
import { MAX_LINKS_XML } from '../../constants/sitemap.js';
import { createUsualSiteMap, createExtendedSiteMap } from './sitemapHelper.js';
import waivioApi from '../waivioApi/index.js';
import { parseJson } from '../../helpers/jsonHelper.js';
import wobjectSiteSchema from '../../config/schema/waivio/wobjectSite.js';
import { getIndexFromHostName, isNamespaceValid } from '../../helpers/sitesHelper.js';

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
  const directory = 'object';

  for (const object of objects) {
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

const formPostLinks = (posts) => posts.map((el) => `https://${el.host}/@${el.author}/${el.permlink}`);
const formUserLinks = (posts) => posts.map((el) => `https://${el.host}/@${el.name}`);

const getListAndPagesNoAuthority = async ({ host, dbModels }) => {
  const authorPermlinks = [];

  const linksToCheck = [];

  const app = await dbModels.appModel.findOneByHost({ host });
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
  const objects = await dbModels.wobjectModel.findListAndPageByLinks({
    links: linksToCheck,
  });
  authorPermlinks.push(...objects);

  return authorPermlinks;
};

const createLinks = async ({ host, dbModels }) => {
  const app = await dbModels.appModel.findOneByHost({ host });
  if (!app) return [];

  const sitePosts = await dbModels.sitemapPostModel.findAllByHost({ host });
  const siteUsers = await dbModels.sitemapUserModel.findAllByHost({ host });

  const social = checkForSocialSite(app.parentHost);

  const mainObjectLists = await getListAndPagesNoAuthority({ host, dbModels });
  const objects = await dbModels.wobjectModel.findSiteObjects({ app, social });

  const resultObjects = _.uniqBy([...mainObjectLists, ...objects].sort(customSort), 'author_permlink');

  const searchLinks = formObjectLinks({ host, objects: resultObjects, social });

  const postLinks = formPostLinks(sitePosts);
  const userLinks = formUserLinks(siteUsers);

  return { links: [...searchLinks, ...userLinks, ...postLinks], objects: resultObjects };
};

const insertManyDocs = async ({ model, objects }) => {
  try {
    // we need to delete old records because some objects could be removed from site
    await model.deleteMany({});
    await model.insertMany(objects.map((el) => ({ author_permlink: el.author_permlink })));
  } catch (error) {
    console.log(error.message);
  }
};

const createSiteObjectsCollection = async ({ dbModels, objects, host }) => {
  if (!objects?.length) return;
  if (typeof host !== 'string' || host.trim() === '') return;
  const inherited = await dbModels.appModel.isAppInheritedActive({ host });
  if (!inherited) return;
  const collectionName = getIndexFromHostName({ host });
  const valid = isNamespaceValid({
    dbName: 'waivio',
    collectionName,
  });
  if (!valid) return;

  const { waivioDb } = dbModels;
  const model = waivioDb.model(collectionName, wobjectSiteSchema, collectionName);

  await insertManyDocs({
    model, objects: objects.map((el) => ({ author_permlink: el.author_permlink })),
  });
};

const createSiteMap = async ({ host, dbModels, redis }) => {
  const { client2 } = redis;

  const { links, objects } = await createLinks({ host, dbModels });
  if (!links.length) return;

  await createSiteObjectsCollection({ dbModels, objects, host });

  const key = `sitemap_set:${host}`;

  await client2.SADD(key, links);

  if (links.length < MAX_LINKS_XML) {
    await createUsualSiteMap({ links, host, dbModels });
    return 'ok';
  }
  await createExtendedSiteMap({ links, host, dbModels });
  return 'ok';
};

export default createSiteMap;
