import _ from 'lodash';
import { BASE_XML_NAME, MAX_LINKS_XML } from '../../constants/sitemap.js';

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

export const createXMLMapsPage = ({ links }) => {
  const main = links.map((link) => createXMLMapLink(link));
  return `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${main.join('')}
  </sitemapindex>`;
};

export const createUsualSiteMap = async ({
  links, host, name = BASE_XML_NAME, dbModels,
}) => {
  const page = createXMLLinksPage({ links });
  await dbModels.sitemapModel.createOne({
    host, page, name,
  });
};

export const createExtendedSiteMap = async ({ links, host, dbModels }) => {
  const chunks = _.chunk(links, MAX_LINKS_XML);

  const sitemaps = [];
  for (const [i, linksArr] of chunks.entries()) {
    const name = `${BASE_XML_NAME}${i + 1}`;
    await createUsualSiteMap({
      links: linksArr,
      host,
      name,
      dbModels,
    });
    sitemaps.push(`https://${host}/${name}.xml`);
  }

  const page = createXMLMapsPage({ links: sitemaps });
  await dbModels.sitemapModel.createOne({
    host, page, name: BASE_XML_NAME,
  });
};
