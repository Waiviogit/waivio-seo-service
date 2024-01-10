import botStatisticsSchema from './botStatisticsSchema.js';
import botUserAgentSchema from './botUserAgentSchema.js';
import cachePageSchema from './cachePageSchema.js';
import sitemapSchema from './sitemapSchema.js';
import sitemapPostSchema from './sitemapPostSchema.js';
import sitemapUserSchema from './sitemapUserSchema.js';

const schemas = [
  {
    schema: botStatisticsSchema,
    name: 'botStatistics',
    collection: 'botstatistics',
  },
  {
    schema: botUserAgentSchema,
    name: 'botUserAgent',
    collection: 'botuseragents',
  },
  {
    schema: cachePageSchema,
    name: 'cachePage',
    collection: 'cachepages',
  },
  {
    schema: sitemapSchema,
    name: 'sitemap',
    collection: 'sitemaps',
  },
  {
    schema: sitemapPostSchema,
    name: 'sitemap_posts',
    collection: 'sitemap_posts',
  },
  {
    schema: sitemapUserSchema,
    name: 'sitemap_users',
    collection: 'sitemap_users',
  },
];

export default schemas;
