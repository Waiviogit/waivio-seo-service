import mongoose from 'mongoose';

const SitemapPostSchema = new mongoose.Schema(
  {
    host: {
      type: String, required: true, index: true,
    },
    author: { type: String, required: true },
    permlink: { type: String, required: true },
  },
  { timestamps: false },
);

SitemapPostSchema.index({ host: 1, author: 1, permlink: 1 }, { unique: true });

export default SitemapPostSchema;
