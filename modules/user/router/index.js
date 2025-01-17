import express from "express";
import authUserRouter from "./auth.route.js";
import urlRouter from "./url.route.js";
const router = express.Router();

router.use("/auth", authUserRouter);
router.use("/", urlRouter);
export default router;
