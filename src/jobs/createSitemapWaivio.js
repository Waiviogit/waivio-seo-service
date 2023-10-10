const wobjectModel = require('../mongo/schemas/waivio/wObjectSchema');
const userModel = require('../mongo/schemas/waivio/userSchema');
const postModel = require('../mongo/schemas/waivio/postSchema');
const { createUsualSiteMap, createXMLMapsPage } = require('../common/helpers/sitemapHelper');
const db = require('../mongo');
const { BASE_XML_NAME, MAX_LINKS_XML } = require('../common/constants/sitemap');

const host = process.env.NODE_ENV === 'production'
  ? 'waivio.com'
  : 'waiviodev.com';

const protocolPrefix = process.env.NODE_ENV === 'production'
  ? 'https://www.'
  : 'https://';

const processCollection = {
  object: {
    model: wobjectModel,
    projection: { author_permlink: 1 },
    link: (doc) => `${protocolPrefix}${host}/object/${doc.author_permlink}`,
    name: 'object',
  },
  user: {
    model: userModel,
    projection: { name: 1 },
    link: (doc) => `${protocolPrefix}${host}/@${doc.name}`,
    name: 'user',
  },
  post: {
    model: postModel,
    projection: { author: 1, permlink: 1 },
    link: (doc) => `${protocolPrefix}${host}/@${doc.author}/${doc.permlink}`,
    name: 'post',
  },
};

const createLinks = async (type) => {
  try {
    let lastProcessedId = null;
    let iteration = 1;
    const processor = processCollection[type];
    while (true) {
      let batchCount = 0;
      const links = [];
      const filter = lastProcessedId
        ? { _id: { $gt: lastProcessedId } }
        : {};
      const cursor = processor.model.find(filter, processor.projection, { limit: MAX_LINKS_XML });

      for await (const doc of cursor) {
        if (processor.name === 'post' && /\//.test(doc?.permlink)) {
          batchCount++;
          continue;
        }
        const link = processor.link(doc);
        links.push(link);
        lastProcessedId = doc._id;
        batchCount++;
      }

      if (batchCount === 0) {
        // No more documents to process
        break;
      }
      await createUsualSiteMap({
        links, host, name: `${BASE_XML_NAME}${processor.name}${iteration}`,
      });
      console.log(`${iteration * 50000} ${processor.name} added to sitemap`);
      iteration++;
    }
  } catch (error) {
    console.log(error);
  }
};

const create = async () => {
  await createLinks('object');
  await createLinks('user');
  await createLinks('post');

  const names = await db.sitemapRepository.findAllNamesByHost({ host });

  const links = names.map((el) => `${protocolPrefix}${host}/${el}.xml`);
  const page = createXMLMapsPage({ links });
  await db.sitemapRepository.createOne({
    host, page, name: BASE_XML_NAME,
  });
  console.log('waivio sitemap creation finished');
};

module.exports = {
  create,
};
