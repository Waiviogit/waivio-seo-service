import createSiteMap from '../domain/sitemap/createSitemap.js';
import { getIndexFromHostName } from '../helpers/sitesHelper.js';
import { SITE_OBJECT_PREFIX } from '../constants/sitemap.js';

const getCollectionsToDrop = ({ hosts, collections }) => {
  const collectionNotDelete = hosts.map((el) => getIndexFromHostName({ host: el }));
  const existsCollection = collections.filter((el) => el.startsWith(SITE_OBJECT_PREFIX));
  return existsCollection.reduce((acc, el) => {
    const deleteElement = !collectionNotDelete.includes(el);
    if (deleteElement) acc.push(el);
    return acc;
  }, []);
};

const checkCollectionToDrop = async ({ dbModels }) => {
  const hosts = await dbModels.appModel.findSitesHosts();
  const { waivioDb } = dbModels;

  const collections = await waivioDb.connection.db.listCollections().toArray();
  const collectionsToDrop = getCollectionsToDrop({
    hosts,
    collections: collections.map((el) => el.name),
  });

  for (const dropElement of collectionsToDrop) {
    await waivioDb.connection.db.dropCollection(dropElement);
  }
};

const jobs = [{
  cronTime: '0 13 * * *',
  onTick: async (fastify) => {
    try {
      const { dbModels, redis } = fastify;

      const hosts = await dbModels.appModel.findSitesHosts();

      for (const host of hosts) {
        await createSiteMap({ host, dbModels, redis });
        console.log(`sitemap for ${host} updated`);
      }

      await checkCollectionToDrop({ dbModels });

      console.log('createSitemapJob finished');
    } catch (err) { console.error(err); }
  },
}];

export default jobs;
