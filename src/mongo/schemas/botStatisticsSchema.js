const mongoose = require('mongoose');

const BotStatisticsSchema = new mongoose.Schema({
  userAgent: { type: String, required: true, index: true, unique: true },
  timesEntered: { type: Number, required: true },
});

const botStatisticsModel = mongoose.model('botStatistics', BotStatisticsSchema);

module.exports = botStatisticsModel;
