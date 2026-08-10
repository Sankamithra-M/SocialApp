import asyncHandler from "../../middleware/asyncHandler.js";

import { getFeedService } from "./feed.service.js";

export const getFeed = asyncHandler(
  async (req, res) => {
    const {
      cursor,
      limit,
    } = req.query;

    const result = await getFeedService(
      req.user._id,
      cursor,
      limit
    );

    res.status(200).json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  }
);