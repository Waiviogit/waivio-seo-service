import mongoose from 'mongoose';
import getConfig from '../lib/config/config.js';

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

    const users = waivioDb.models.users.find({}, { name: 1, canonical: 1 });

    for await (const user of users) {
      if (!user?.canonical || /(waivio\.com|localhost)/.test(user?.canonical)) continue;

      await sitemapUserModel.create({
        host: user?.canonical, name: user.name,
      });

      console.log(`created ${user.name}${user?.canonical}`);
    }

    console.log('task completed');
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

run();
