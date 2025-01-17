import express from "express";
import urlController from "../controller/url.controller.js";
import AuthMiddleware from "../../../middleware/auth_middleware.js";
import commonValidator from "../../../utils/validation.js";
import rateLimit from "express-rate-limit";

const urlRouter = express.Router();

const shortenRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each user to 10 requests per windowMs
  message: {
    error: "Too many requests, please try again after some time.",
  },
});

urlRouter.post(
  "/shorten",
  shortenRateLimiter,
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiShortUrlValidator,
  urlController.shortUrl
);

urlRouter.get(
  "/shorten/:alias",
  // AuthMiddleware.checkAuthTokenAndVersion,
  urlController.getUrl
);

urlRouter.get(
  "/analytics/overall",
  AuthMiddleware.checkAuthTokenAndVersion,
  urlController.getOverAllAnalytics
);
urlRouter.get(
  "/analytics/:alias",
  AuthMiddleware.checkAuthTokenAndVersion,
  urlController.getUrlAnalytics
);

urlRouter.get(
  "/analytics/topic/:topic",
  AuthMiddleware.checkAuthTokenAndVersion,
  urlController.getTopicBaseAnalytics
);

export default urlRouter;
