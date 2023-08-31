const mongoose = require('mongoose');

const botUserAgentRepository = require('./repository/botUserAgentRepository');
const cachePageRepository = require('./repository/cachePageRepository');
const botStatisticsRepository = require('./repository/botStatisticsRepository');

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
};
