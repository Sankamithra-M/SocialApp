import asyncHandler from "../../middleware/asyncHandler.js";
import { followUserService ,unfollowUserService } from "./follow.service.js";

export const followUser = asyncHandler(
  async (req, res) => {
    const { username } = req.params;

    const result = await followUserService(
      req.user._id,
      username
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);

export const unfollowUser = asyncHandler(
  async (req, res) => {
    const { username } = req.params;

    const result = await unfollowUserService(
      req.user._id,
      username
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);