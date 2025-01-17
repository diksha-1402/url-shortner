import commonValidator from "../../../utils/validation.js";
import authUserController from "../controller/auth.controller.js";
import express from "express";
import passport from "passport";

const authUserRouter = express.Router();

authUserRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authUserRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  authUserController.googleCallbackHandler
);

export default authUserRouter;
