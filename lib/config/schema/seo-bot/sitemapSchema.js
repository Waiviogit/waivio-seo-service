import mongoose from 'mongoose';

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

export default SiteMapSchema;
