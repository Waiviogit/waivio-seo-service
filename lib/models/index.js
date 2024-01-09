import fp from 'fastify-plugin';
import AppModel from './waivio/app.js';
import WobjectModel from './waivio/wobject.js';
import BotStatisticsModel from './seo-bot/botStatistics.js';
import BotUserAgentModel from './seo-bot/botUserAgent.js';
import CachePageModel from './seo-bot/cachePage.js';
import SitemapModel from './seo-bot/sitemap.js';
import SitemapPostsModel from './seo-bot/sitemapPosts.js';

async function fastifyDbModels(fastify, serverOptions, next) {
  const { waivioDb, seoDb } = fastify;

  const appModel = AppModel({ waivioDb });
  const wobjectModel = WobjectModel({ waivioDb });
  const botStatisticsModel = BotStatisticsModel({ seoDb });
  const botUserAgentModel = BotUserAgentModel({ seoDb });
  const cachePageModel = CachePageModel({ seoDb });
  const sitemapModel = SitemapModel({ seoDb });
  const sitemapPostModel = SitemapPostsModel({ seoDb });

  fastify.decorate('dbModels', {
    appModel,
    wobjectModel,
    botStatisticsModel,
    botUserAgentModel,
    cachePageModel,
    sitemapModel,
    sitemapPostModel,
  });

  next();
}

export default fp(fastifyDbModels);
