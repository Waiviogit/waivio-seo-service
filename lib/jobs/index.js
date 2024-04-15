import createSiteMap from '../domain/sitemap/createSitemap.js';

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
      console.log('createSitemapJob finished');
    } catch (err) { console.error(err); }
  },
}];

export default jobs;
