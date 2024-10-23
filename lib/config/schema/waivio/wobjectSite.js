import mongoose from 'mongoose';

const { Schema } = mongoose;

const wobjectSiteSchema = new Schema({
  author_permlink: { type: String, required: true, unique: true },
}, { timestamps: false, versionKey: false });

export default wobjectSiteSchema;
