import i18n from "../../../config/i18n.js";
import constants from "../../../utils/constants.js";
import helper from "../../../utils/helper.js";
import { nanoid } from "nanoid";
import urlModel from "../../../models/url.model.js";
import analyticsModel from "../../../models/analytics.model.js";
import redis from "redis";
import redisConnect from "../../../utils/redisConnect.js";
// Redis client setup

const redisClient = redis.createClient({
  // host: constants.CONST_REDIS_HOST,
  // port: constants.CONST_REDIS_PORT,
  url: constants.CONST_REDIS_URL,
});
redisClient.on("error", (err) => console.error("Redis Client Error:", err));
(async () => {
  try {
    await redisClient.connect();
    console.log("Redis client connected");
  } catch (err) {
    console.error("Failed to connect Redis client:", err);
  }
})();

// Create shorten url
const shortUrl = async (req, res) => {
  try {
    const alias = req.body?.alias || nanoid(7);
    await redisClient.del(`analytics:${alias}`);
    await redisClient.del("overallAnalytics");
    if (req.body?.topic) {
      await redisClient.del(`topicAnalytics:${req.body?.topic}`);
    }
    let shortUrl = `${req.protocol}://${req.get(
      "host"
    )}/v1/api/shorten/${alias}`;
    const aliasExists = await urlModel.findOne({ alias });
    if (aliasExists) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_BAD_REQUEST,
        i18n.__("lang_alias_exists")
      );
    }
    const newUrl = new urlModel({
      longUrl: req.body.longUrl,
      shortUrl: shortUrl,
      topic: req.body?.topic,
      alias: alias,
    });
    await newUrl.save();
    // Set shortUrl and longUrl in Redis cache with a TTL of 3600 seconds
    await redisClient.set(shortUrl, req.body.longUrl, "EX", 3600);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_CREATED,
      i18n.__("lang_success"),
      newUrl
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// Get longUrl by shorten alias
const getUrl = async (req, res) => {
  try {
    let alias = req.params.alias;
    const keysToDelete = await redisClient.keys("*"); // Fetch all keys
    if (keysToDelete.length > 0) {
      await redisClient.del(keysToDelete); // Delete all keys
    }
    let cacheKey = `${req.protocol}://${req.get(
      "host"
    )}/v1/api/shorten/${alias}`;

    // Check cache first
    const cachedUrl = await redisClient.get(cacheKey);

    if (cachedUrl) {
      helper.saveAnalytics(alias, req);
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_CREATED,
        i18n.__("lang_Url"),
        cachedUrl
      );
    } else {
      const urlEntry = await urlModel.findOne({ alias: alias });
      if (urlEntry) {
        // Save to cache
        await redisClient.del(`analytics:${alias}`);
        await redisClient.del("overallAnalytics");
        helper.saveAnalytics(alias, req);

        await redisClient.set(cacheKey, urlEntry.longUrl, "EX", 3600);

        return helper.returnTrueResponse(
          req,
          res,
          constants.CONST_RESP_CODE_CREATED,
          i18n.__("lang_Url"),
          urlEntry.longUrl
        );
      } else {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_NOT_FOUND,
          i18n.__("lang_url_not_found")
        );
      }
    }
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// get url analytics by alias
const getUrlAnalytics = async (req, res) => {
  try {
    const { alias } = req.params;
    const cacheKey = `analytics:${alias}`;

    // Check cache first
    const cachedAnalytics = await redisClient.get(cacheKey);
    if (cachedAnalytics) {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_success"),
        JSON.parse(cachedAnalytics)
      );
    }

    const urlEntry = await urlModel.findOne({ alias });
    if (!urlEntry) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_url_not_found")
      );
    }

    const analytics = await analyticsModel.find({ alias });
    const totalClicks = analytics.length;
    const uniqueUsers = new Set(analytics.map((a) => a.ipAddress)).size;

    const clicksByDate = analytics.reduce((acc, cur) => {
      const date = cur.timestamp.toISOString().split("T")[0];
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {});

    const osType = analytics.reduce((acc, cur) => {
      const os = cur.osName;
      if (!acc[os]) acc[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
      acc[os].uniqueClicks++;
      acc[os].uniqueUsers.add(cur.ipAddress);
      return acc;
    }, {});

    const deviceType = analytics.reduce((acc, cur) => {
      const device = cur.deviceType;
      if (!acc[device])
        acc[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
      acc[device].uniqueClicks++;
      acc[device].uniqueUsers.add(cur.ipAddress);
      return acc;
    }, {});

    const response = {
      totalClicks,
      uniqueUsers,
      clicksByDate: Object.keys(clicksByDate)
        .slice(-7)
        .map((date) => ({ date, count: clicksByDate[date] })),
      osType: Object.keys(osType).map((os) => ({
        osName: os,
        uniqueClicks: osType[os].uniqueClicks,
        uniqueUsers: osType[os].uniqueUsers.size,
      })),
      deviceType: Object.keys(deviceType).map((device) => ({
        deviceName: device,
        uniqueClicks: deviceType[device].uniqueClicks,
        uniqueUsers: deviceType[device].uniqueUsers.size,
      })),
    };

    // Cache the analytics data
    await redisClient.set(cacheKey, JSON.stringify(response), "EX", 3600);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_success"),
      response
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// Get Topic-Based Analytics
const getTopicBaseAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;
    const cacheKey = `topicAnalytics:${topic}`;

    // Check cache first
    const cachedAnalytics = await redisClient.get(cacheKey);
    if (cachedAnalytics) {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_success"),
        JSON.parse(cachedAnalytics)
      );
    }

    const urlEntries = await urlModel.find({ topic });
    if (!urlEntries.length) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_url_not_found")
      );
    }

    const analytics = await analyticsModel.find({
      alias: { $in: urlEntries.map((u) => u.alias) },
    });
    const totalClicks = analytics.length;
    const uniqueUsers = new Set(analytics.map((a) => a.ipAddress)).size;

    const clicksByDate = analytics.reduce((acc, cur) => {
      const date = cur.timestamp.toISOString().split("T")[0];
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {});

    const urls = urlEntries.map((url) => ({
      shortUrl: url.shortUrl,
      totalClicks: analytics.filter((a) => a.alias === url.alias).length,
      uniqueUsers: new Set(
        analytics.filter((a) => a.alias === url.alias).map((a) => a.ipAddress)
      ).size,
    }));

    const response = {
      totalClicks,
      uniqueUsers,
      clicksByDate,
      urls,
    };

    // Cache the analytics data
    await redisClient.set(cacheKey, JSON.stringify(response), "EX", 3600);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_success"),
      response
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// Get Overall Analytics
const getOverAllAnalytics = async (req, res) => {
  try {
    const cacheKey = "overallAnalytics";

    // Check cache first
    const cachedAnalytics = await redisClient.get(cacheKey);
    if (cachedAnalytics) {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_success"),
        JSON.parse(cachedAnalytics)
      );
    }

    const urlEntries = await urlModel.find();
    const analytics = await analyticsModel.find({
      alias: { $in: urlEntries.map((u) => u.alias) },
    });

    const totalClicks = analytics.length;
    const uniqueUsers = new Set(analytics.map((a) => a.ipAddress)).size;

    const clicksByDate = analytics.reduce((acc, cur) => {
      const date = cur.timestamp.toISOString().split("T")[0];
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {});

    const osType = analytics.reduce((acc, cur) => {
      const os = cur.osName;
      if (!acc[os]) acc[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
      acc[os].uniqueClicks++;
      acc[os].uniqueUsers.add(cur.ipAddress);
      return acc;
    }, {});

    const deviceType = analytics.reduce((acc, cur) => {
      const device = cur.deviceType;
      if (!acc[device])
        acc[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
      acc[device].uniqueClicks++;
      acc[device].uniqueUsers.add(cur.ipAddress);
      return acc;
    }, {});

    const response = {
      totalUrls: urlEntries.length,
      totalClicks,
      uniqueUsers,
      clicksByDate: Object.keys(clicksByDate).map((date) => ({
        date,
        count: clicksByDate[date],
      })),
      osType: Object.keys(osType).map((os) => ({
        osName: os,
        uniqueClicks: osType[os].uniqueClicks,
        uniqueUsers: osType[os].uniqueUsers.size,
      })),
      deviceType: Object.keys(deviceType).map((device) => ({
        deviceName: device,
        uniqueClicks: deviceType[device].uniqueClicks,
        uniqueUsers: deviceType[device].uniqueUsers.size,
      })),
    };

    // Cache the analytics data

    await redisClient.set(cacheKey, JSON.stringify(response), "EX", 3600);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_success"),
      response
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

const urlController = {
  shortUrl: shortUrl,
  getUrl: getUrl,
  getUrlAnalytics: getUrlAnalytics,
  getTopicBaseAnalytics: getTopicBaseAnalytics,
  getOverAllAnalytics: getOverAllAnalytics,
};

export default urlController;
