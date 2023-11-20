import fp from 'fastify-plugin';
import mongoose from 'mongoose';

async function fastifyMongoDb(fastify, options, next) {
  try {
    const { mongo } = options;
    const waivioDb = await mongoose.connect(mongo.waivio.uri);
    fastify.log.info('waivio db connected');
    const seoDb = await mongoose.createConnection(mongo.seo.uri);
    fastify.log.info('seo-bot db connected');

    for (const wM of mongo.waivio.schemes) waivioDb.model(wM.name, wM.schema, wM.collection);
    for (const sM of mongo.seo.schemes) seoDb.model(sM.name, sM.schema, sM.collection);

    fastify
      .decorate('waivioDb', waivioDb)
      .addHook('onClose', async (instance, done) => {
        await waivioDb.connection.close(false);
        delete instance.waivioDb;
        done();
      });

    fastify
      .decorate('seoDb', seoDb)
      .addHook('onClose', async (instance, done) => {
        await seoDb.connection.close(false);
        delete instance.seoDb;
        done();
      });

    next();
  } catch (err) {
    next(err);
  }
}

export default fp(fastifyMongoDb, { name: 'fastify-mongoDb' });
