import express from "express";

import { protect } from "../../middleware/auth.middleware.js";
import { getFeed } from "./feed.controller.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getFeed
);

export default router;