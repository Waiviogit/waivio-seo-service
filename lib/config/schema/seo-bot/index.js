import botStatisticsSchema from './botStatisticsSchema.js';
import botUserAgentSchema from './botUserAgentSchema.js';
import cachePageSchema from './cachePageSchema.js';
import sitemapSchema from './sitemapSchema.js';

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
];

export default schemas;
