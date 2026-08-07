import express from "express";

import { createPost } from "./post.controller.js";

import {protect} from "../../middleware/auth.middleware.js";

import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("images", 10),
  createPost
);

export default router;