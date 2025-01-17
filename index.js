import dotenv from "dotenv";
dotenv.config();
import constants from "./utils/constants.js"; // custom created files
import i18n from "./config/i18n.js";
import express from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express"; // API collection configuration section
import YAML from "yamljs";
import cors from "cors";
import rateLimit from "express-rate-limit";
import passport from "passport";
import session from "express-session";
import connect from "./utils/dbConnection.js";
connect(); // connect

const swaggerUserDocument = YAML.load("./user_swagger.yaml");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(
  session({
    secret: constants.CONST_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

authUserController.configureGoogleStrategy(); // Call the function to configure the Google Strategy
app.use(passport.initialize());
app.use(passport.session());

//rate limiter for all API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
app.get("/", async (req, res) => {
  return res
    .status(constants.CONST_RESP_CODE_OK)
    .send(i18n.__("lang_forbidden"));
});

app.use("/api-url", swaggerUi.serve, (...args) =>
  swaggerUi.setup(swaggerUserDocument)(...args)
);

import userRouter from "./modules/user/router/index.js";
import authUserController from "./modules/user/controller/auth.controller.js";
app.use("/v1/api/", userRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({
    message: i18n.__("lang_endpoint_not_found_message"),
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server run on: ${process.env.APP_PORT}`);
});

export default app;
