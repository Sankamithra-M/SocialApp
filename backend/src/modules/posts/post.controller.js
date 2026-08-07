import asyncHandler from "../../middleware/asyncHandler.js";

import { createPostService } from "./post.service.js";

export const createPost = asyncHandler(
  async (req, res) => {
    const post = await createPostService(
      req.user._id,
      req.body.caption,
      req.files
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  }
);