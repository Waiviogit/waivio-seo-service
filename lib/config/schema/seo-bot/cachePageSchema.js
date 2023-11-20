import mongoose from 'mongoose';

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

export default CachePageSchema;
