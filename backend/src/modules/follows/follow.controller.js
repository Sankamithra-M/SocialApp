import asyncHandler from "../../middleware/asyncHandler.js";
import { followUserService ,unfollowUserService, getFollowersService , getFollowingService ,checkFollowStatusService} from "./follow.service.js";

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

export const getFollowers = asyncHandler(
  async (req, res) => {
    const { username } = req.params;

    const followers = await getFollowersService(
      username
    );

    res.status(200).json({
      success: true,
      data: followers,
    });
  }
);

export const getFollowing = asyncHandler(
  async (req, res) => {
    const { username } = req.params;

    const following =
      await getFollowingService(username);

    res.status(200).json({
      success: true,
      data: following,
    });
  }
);

export const checkFollowStatus = asyncHandler(
  async (req, res) => {
    const { username } = req.params;

    const result =
      await checkFollowStatusService(
        req.user._id,
        username
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);