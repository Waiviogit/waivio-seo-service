const _ = require('lodash');
const db = require('../mongo');

const SOCIAL_HOSTS = ['social.gifts', 'socialgifts.pp.ua', 'localhost:4000'];

const MAX_LINKS_XML = 50000;

const BASE_XML_NAME = 'sitemap';
const checkForSocialSite = (host = '') => SOCIAL_HOSTS.some((sh) => host.includes(sh));

const createLinks = async ({ host }) => {
  const links = [];

  const app = await db.appRepository.findOneByHost({ host });
  if (!app) return links;
  const social = checkForSocialSite(host);
  const objects = await db.wobjectRepository.findSiteObjects({ app, host, social });

  for (const object of objects) {
    const directory = social && object.object_type === 'list' ? 'checklist' : 'object';
    links.push(`https://${host}/${directory}/${object.author_permlink}`);
  }

  return links;
};

const createXMLLink = (link) => `
    <url>
        <loc>${link}</loc>
    </url>
`;

const createXMLMapLink = (link) => `
    <sitemap>
        <loc>${link}</loc>
    </sitemap>
`;

const createXMLLinksPage = ({ links }) => {
  const main = links.map((link) => createXMLLink(link));

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${main.join('')}
  </urlset>`;
};

const createXMLMapsPage = ({ links }) => {
  const main = links.map((link) => createXMLMapLink(link));
  return `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${main.join('')}
  </sitemapindex>`;
};

const createUsualSiteMap = async ({ links, host, name = BASE_XML_NAME }) => {
  const page = createXMLLinksPage({ links });
  await db.sitemapRepository.createOne({
    host, page, name,
  });
};

const createExtendedSiteMap = async ({ links, host }) => {
  const chunks = _.chunk(links, MAX_LINKS_XML);

  const sitemaps = [];
  for (const [i, linksArr] of chunks.entries()) {
    const name = `${BASE_XML_NAME}${i + 1}`;
    await createUsualSiteMap({
      links: linksArr,
      host,
      name,
    });
    sitemaps.push(`https://${host}/${name}.xml`);
  }

  const page = createXMLMapsPage({ links: sitemaps });
  await db.sitemapRepository.createOne({
    host, page, name: BASE_XML_NAME,
  });
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
