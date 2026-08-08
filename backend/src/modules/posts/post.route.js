import express from "express";

import { createPost , getUserPosts , deletePost } from "./post.controller.js";

import {likePost} from "../likes/like.controller.js";

import {protect} from "../../middleware/auth.middleware.js";

import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("images", 10),
  createPost
);

router.get(
  "/user/:username/posts",
  protect,
  getUserPosts
);


router.delete(
  "/:postId",
  protect,
  deletePost
);


router.post(
  "/:postId/like",
  protect,
  likePost
);

export default router;

