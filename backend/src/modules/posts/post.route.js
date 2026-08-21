import express from "express";

import { createPost , getUserPosts , deletePost } from "./post.controller.js";

import {likePost} from "../likes/like.controller.js";

import { createComment , getComments , deleteComment} from "../comments/comment.controller.js";

import {protect} from "../../middleware/auth.middleware.js";

import upload from "../../middleware/upload.middleware.js";

import validate from "../../middleware/validate.middleware.js";


import { postIdParamsSchema , commentIdParamsSchema , LikeParamsSchema , ConversationParamsSchema} from "../../validators/params.validator.js";

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
  validate(postIdParamsSchema, "params"),
  protect,
  deletePost
);


router.post(
  "/:postId/like",
  validate(postIdParamsSchema, "params"),
  protect,
  likePost
);


router.post(
  "/:postId/comments",
  validate(postIdParamsSchema, "params"),
  protect,
  createComment
);

router.get(
  "/:postId/comments",
  validate(postIdParamsSchema, "params"),
  protect,
  getComments
);

router.delete(
  "/comments/:commentId",
  validate(commentIdParamsSchema, "params"),
  protect,
  deleteComment
);
export default router;

