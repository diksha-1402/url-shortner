import mongoose from "mongoose";
import constants from "../utils/constants.js";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      maxLength: 100,
      default:""
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 100,
      default:""
    },
    googleId:{
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      maxLength: 100,
      default: "",
    },
    password: {
      type: String,
      default:""
    },
    emailVerified: {
      type: Boolean,
      required: true,
      enum: [
        constants.CONST_USER_VERIFIED_TRUE,
        constants.CONST_USER_VERIFIED_FALSE,
      ],
      default: constants.CONST_USER_VERIFIED_TRUE,
    },
    role: {
      type: Number,
      enum: [constants.CONST_ROLE_USER, constants.CONST_ROLE_ADMIN],
      comment: "1: Admin, 2: User",
    },
    status: {
      type: String,
      enum: [
        constants.CONST_STATUS_ACTIVE,
        constants.CONST_STATUS_INACTIVE,
        constants.CONST_STATUS_DELETED,
      ],
      default: constants.CONST_STATUS_ACTIVE,
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "users",
    versionKey: false,
  }
);

const userModel = mongoose.model("userSchema", userSchema);

export default userModel;
