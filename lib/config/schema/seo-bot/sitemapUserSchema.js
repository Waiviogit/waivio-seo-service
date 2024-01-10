import mongoose from 'mongoose';

const SitemapUserSchema = new mongoose.Schema(
  {
    host: {
      type: String, required: true, index: true,
    },
    name: {
      type: String, required: true, index: true, unique: true,
    },
  },
  { timestamps: false },
);
export default SitemapUserSchema;
