const mongoose = require('mongoose');

const CachePageSchema = new mongoose.Schema(
  {
    url: {
      type: String, required: true, index: true, unique: true,
    },
    page: { type: String, required: true },
  },
  { timestamps: true },
);

CachePageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const cachePageModel = mongoose.model('cachePage', CachePageSchema);

module.exports = cachePageModel;
