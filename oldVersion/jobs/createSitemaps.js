const { CronJob } = require('cron');
const db = require('../mongo');
const operations = require('../operations');

const create = async () => {
  const hosts = await db.appRepository.findSitesHosts();

  for (const host of hosts) {
    await operations.sitemap.createSiteMap({ host });
    console.log(`sitemap for ${host} updated`);
  }
  console.log('createSitemapJob finished');
};

const createSitemapJob = new CronJob('00 12 15 */1 *', create, null, false, null, null, false);

module.exports = {
  createSitemapJob,
  create,
};
