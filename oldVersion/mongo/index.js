const mongoose = require('mongoose');

const botUserAgentRepository = require('./repository/seo-bot/botUserAgentRepository');
const cachePageRepository = require('./repository/seo-bot/cachePageRepository');
const botStatisticsRepository = require('./repository/seo-bot/botStatisticsRepository');
const sitemapRepository = require('./repository/seo-bot/sitemapRepository');
const appRepository = require('./repository/waivio/appRepository');
const wobjectRepository = require('./repository/waivio/wobjectRepository');

const googleAgents = require('../common/constants/googleUserAgents');

const MONGO_URI = process.env.MONGO_URI_SEO || 'mongodb://localhost:27017/seo-bot';
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('mongo connected');
    botUserAgentRepository.createUserAgent({
      type: 'google',
      userAgents: googleAgents,
    });
  })
  .catch((error) => console.log(error));

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.on('close', () => console.log('closed mongo connection'));

module.exports = {
  botUserAgentRepository,
  cachePageRepository,
  botStatisticsRepository,
  sitemapRepository,
  appRepository,
  wobjectRepository,
};
