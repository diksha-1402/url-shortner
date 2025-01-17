import mongoose from "mongoose";
import constants from "../utils/constants.js";

const analyticsSchema = mongoose.Schema(
  {
    alias: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    geoLocation: { country: String, region: String, city: String },
    osName: {
      type: String,
    },
    deviceType: {
      type: String,
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "analytics",
    versionKey: false,
  }
);

const analyticsModel = mongoose.model("analyticsSchema", analyticsSchema);

export default analyticsModel;
