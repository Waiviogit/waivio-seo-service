import botStatisticsSchema from './botStatisticsSchema';
import botUserAgentSchema from './botUserAgentSchema';
import cachePageSchema from './cachePageSchema';
import sitemapSchema from './sitemapSchema';

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
