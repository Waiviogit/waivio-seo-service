import mongoose from 'mongoose';
import getConfig from '../lib/config/config.js';

const DEFAULT_CANONICAL = 'www.waivio.com';

const run = async () => {
  const config = await getConfig();
  const { mongo } = config;

  const waivioDb = await mongoose.connect(mongo.waivio.uri);
  console.log('waivioDb connected');
  const seoDb = await mongoose.createConnection(mongo.seo.uri);
  console.log('seo-bot db connected');

  for (const wM of mongo.waivio.schemes) waivioDb.model(wM.name, wM.schema, wM.collection);
  for (const sM of mongo.seo.schemes) seoDb.model(sM.name, sM.schema, sM.collection);

  try {
    const sitemapUserModel = seoDb.models.sitemap_users;

    const users = waivioDb.models.users.find(
      { canonical: { $nin: ['www.waivio.com', null] } },
      { name: 1, canonical: 1 },
    );

    for await (const user of users) {
      let canonical = user?.canonical;

      if (/(waiviodev\.com|localhost|waivio\.com)/.test(user?.canonical)) {
        console.log(`changed ${user.name} ${user?.canonical} ${DEFAULT_CANONICAL}`);
        await waivioDb.models.users.updateOne(
          { name: user.name },
          { canonical: DEFAULT_CANONICAL },
        );
        canonical = DEFAULT_CANONICAL;
      }

      if (/(http\:\/\/|https\:\/\/)/.test(canonical)) {
        canonical = canonical.replace(/(http\:\/\/|https\:\/\/)/, '');

        await waivioDb.models.users.updateOne(
          { name: user.name },
          { canonical },
        );

        console.log(`changed ${user.name} ${user?.canonical} ${canonical}`);
      }

      await sitemapUserModel.updateOne(
        {
          host: canonical, name: user.name,
        },
        { host: canonical, name: user.name },
        { upsert: true },
      );

      console.log(`created ${user.name} ${canonical}`);
    }

    console.log('task completed');
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

run();
