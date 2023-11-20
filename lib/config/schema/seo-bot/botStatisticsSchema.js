import mongoose from 'mongoose';

const BotStatisticsSchema = new mongoose.Schema({
  userAgent: {
    type: String, required: true, index: true, unique: true,
  },
  timesEntered: { type: Number, required: true },
});

export default BotStatisticsSchema;
