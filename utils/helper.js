import constants from "./constants.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import emailSender from "./emailSender.js";
import analyticsModel from "../models/analytics.model.js";
import geoip from "geoip-lite";
const generateOtp = async () => {
  const randomOtp = String(Math.floor(1000 + Math.random() * 9000));
  const currentTime = new Date();
  const expirationTime = new Date(
    currentTime.getTime() + 10 * 60 * 1000
  ).toISOString();
  let result = {
    randomOtp: randomOtp,
    expirationTime: expirationTime,
  };
  return result;
};

const passwordCompare = async (password, savedPassword) => {
  return await bcrypt.compare(password, savedPassword);
};

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(constants.CONST_GEN_SALT);
  password = await bcrypt.hash(password, salt);
  return password;
};

const removeBackSlashes = (value) => {
  return value.replace(/\//g, "");
};

const returnTrueResponse = async (
  req,
  res,
  statusCode,
  message,
  arr,
  totalCounts,
  unreadCount
) => {
  return res.status(statusCode).json({
    version: {
      current_version: constants.CONST_APP_VERSION,
      major_update: 0,
      minor_update: 0,
      message: "App is Up to date",
    },
    success: 1,
    message: message,
    data: arr,
    totalCounts: totalCounts,
    unreadCount: unreadCount,
  });
};

const returnFalseResponse = (
  req,
  res,
  statusCode,
  message,
  arr,
  error_code
) => {
  return res.status(statusCode).json({
    version: {
      current_version: constants.CONST_APP_VERSION,
      major_update: 0,
      minor_update: 0,
      message: "App is Up to date",
    },
    success: 0,
    message: message,
    data: arr,
    error_code: error_code,
  });
};

const validationErrorConverter = (logs) => {
  let error;
  for (let i = 0; i <= Object.values(logs.errors).length; i++) {
    error = Object.values(logs.errors)[0].message;
    break;
  }
  return error;
};

const joiValidationErrorConvertor = async (errors) => {
  let error_message = "";
  errors.forEach((element, index) => {
    error_message = element.message;
    return true;
  });
  error_message = error_message.replaceAll("/", " ");
  error_message = error_message.replaceAll("_", " ");
  return error_message;
};

const jwtToken = async (userData) => {
  const secretKey = process.env.JWT_TOKEN_KEY;
  const user = {
    id: userData._id,
    email: userData.email,
    // role: userData.role,
  };
  const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
  return token;
};

const saveAnalytics = async (alias,req) => {
 
    try {
      const geo = geoip.lookup(req.ip) || {};
      const newAnalytics = new analyticsModel({
        alias,
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
        geoLocation: {
          country: geo.country || "",
          region: geo.region || "",
          city: geo.city || "",
        },
        osName: req.headers["user-agent"].includes("Windows")
          ? "Windows"
          : req.headers["user-agent"].includes("Mac")
          ? "macOS"
          : "Other",
        deviceType: /mobile/i.test(req.headers["user-agent"])
          ? "Mobile"
          : "Desktop",
      });
      await newAnalytics.save();
      return ;
    } catch (error) {
      console.error(`[Error Saving Analytics]`, error);
      return;
    }

};


let helper = {
  passwordCompare: passwordCompare,
  encryptPassword: encryptPassword,
  removeBackSlashes: removeBackSlashes,
  returnTrueResponse: returnTrueResponse,
  returnFalseResponse: returnFalseResponse,
  validationErrorConverter: validationErrorConverter,
  joiValidationErrorConvertor: joiValidationErrorConvertor,
  generateOtp: generateOtp,
  jwtToken: jwtToken,
  saveAnalytics:saveAnalytics
};

export default helper;
