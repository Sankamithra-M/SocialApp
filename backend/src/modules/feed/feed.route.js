import express from "express";

import { protect } from "../../middleware/auth.middleware.js";
import { getFeed } from "./feed.controller.js";
import validate from "../../middleware/validate.middleware.js";
import { feedQuerySchema } from "../../validators/query.validator.js";
const router = express.Router();

router.get(
  "/",
  validate(feedQuerySchema, "query"),
  protect,
  getFeed
);

export default router;