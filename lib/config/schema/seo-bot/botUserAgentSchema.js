import mongoose from 'mongoose';

const BotUserAgentSchema = new mongoose.Schema({
  type: {
    type: String, required: true, unique: true, index: true,
  },
  userAgents: { type: [String], required: true, index: true },
});

export default BotUserAgentSchema;
