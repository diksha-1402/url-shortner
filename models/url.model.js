import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    alias: { type: String, unique: true },
    topic: { type: String },
  },
  {
    timestamps: true,
    collection: "urlSchema",
    versionKey: false,
  }
);
const urlModel = mongoose.model("urlSchema", urlSchema);

export default urlModel;
