import fp from 'fastify-plugin';
import AppModel from './waivio/app.js';
import WobjectModel from './waivio/wobject.js';
import PostModel from './waivio/post.js';
import BotStatisticsModel from './seo-bot/botStatistics.js';
import BotUserAgentModel from './seo-bot/botUserAgent.js';
import CachePageModel from './seo-bot/cachePage.js';
import SitemapModel from './seo-bot/sitemap.js';
import SitemapPostsModel from './seo-bot/sitemapPosts.js';
import SitemapUserModel from './seo-bot/sitemapUsers.js';

async function fastifyDbModels(fastify, serverOptions, next) {
  const { waivioDb, seoDb } = fastify;

  const appModel = AppModel({ waivioDb });
  const wobjectModel = WobjectModel({ waivioDb });
  const postModel = PostModel({ waivioDb });

  const botStatisticsModel = BotStatisticsModel({ seoDb });
  const botUserAgentModel = BotUserAgentModel({ seoDb });
  const cachePageModel = CachePageModel({ seoDb });
  const sitemapModel = SitemapModel({ seoDb });
  const sitemapPostModel = SitemapPostsModel({ seoDb });
  const sitemapUserModel = SitemapUserModel({ seoDb });

  fastify.decorate('dbModels', {
    appModel,
    wobjectModel,
    postModel,
    botStatisticsModel,
    botUserAgentModel,
    cachePageModel,
    sitemapModel,
    sitemapPostModel,
    sitemapUserModel,
  });

  next();
}

export default fp(fastifyDbModels);
