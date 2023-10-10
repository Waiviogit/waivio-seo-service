const _ = require('lodash');
const { BASE_XML_NAME, MAX_LINKS_XML } = require('../constants/sitemap');
const db = require('../../mongo');

const createXMLLink = (link) => `
    <url>
        <loc>${link}</loc>
    </url>`;

const createXMLMapLink = (link) => `
    <sitemap>
        <loc>${link}</loc>
    </sitemap>`;

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

module.exports = {
  createExtendedSiteMap,
  createUsualSiteMap,
  createXMLMapsPage,
};
