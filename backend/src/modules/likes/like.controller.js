import asyncHandler from "../../middleware/asyncHandler.js";

import { toggleLikeService } from "./like.service.js";

export const likePost = asyncHandler(
  async (req, res) => {
    const result = await toggleLikeService(
      req.user._id,
      req.params.postId
    );

    res.status(201).json({
      success: true,
      ...result,
    });
  }
);