const mongoose = require('mongoose');

const BotUserAgentSchema = new mongoose.Schema({
  type: {
    type: String, required: true, unique: true, index: true,
  },
  userAgents: { type: [String], required: true, index: true },
});

const botUserAgentModel = mongoose.model('botUserAgent', BotUserAgentSchema);

module.exports = botUserAgentModel;
