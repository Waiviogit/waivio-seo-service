const mongoose = require('mongoose');

const SiteMapSchema = new mongoose.Schema(
  {
    host: {
      type: String, required: true, index: true,
    },
    name: { type: String, required: true },
    page: { type: String, required: true },
  },
  { timestamps: true },
);

SiteMapSchema.index({ host: 1, name: 1 });

const siteMapModel = mongoose.model('sitemap', SiteMapSchema);

module.exports = siteMapModel;
