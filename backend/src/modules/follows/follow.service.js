import Follow from "./follow.model.js";
import User from "../users/user.model.js";
import AppError from "../../errors/AppError.js";
import mongoose from "mongoose";


export const followUserService = async (
  currentUserId,
  username
) => {

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const targetUser = await User.findOne({
      username,
    }).session(session);

    if (!targetUser) {
      throw new AppError("User not found", 404);
    }

    if (currentUserId.equals(targetUser._id)) {
      throw new AppError(
        "You cannot follow yourself",
        400
      );
    }

    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: targetUser._id,
    }).session(session);

    if (existingFollow) {
      throw new AppError(
        "Already following this user",
        400
      );
    }

    await Follow.create(
      [
        {
          follower: currentUserId,
          following: targetUser._id,
        },
      ],
      {
        session,
      }
    );

    await User.findByIdAndUpdate(
      currentUserId,
      {
        $inc: {
          followingCount: 1,
        },
      },
      {
        session,
      }
    );

    await User.findByIdAndUpdate(
      targetUser._id,
      {
        $inc: {
          followersCount: 1,
        },
      },
      {
        session,
      }
    );

    await session.commitTransaction();

    return {
      message: "User followed successfully",
    };

  } catch (error) {

    await session.abortTransaction();

    throw error;

  } finally {

    session.endSession();

  }
};



export const unfollowUserService = async (
  currentUserId,
  username
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find target user
    const targetUser = await User.findOne({
      username,
    }).session(session);

    if (!targetUser) {
      throw new AppError("User not found", 404);
    }

    // Prevent self unfollow
    if (currentUserId.equals(targetUser._id)) {
      throw new AppError(
        "You cannot unfollow yourself",
        400
      );
    }

    // Find and delete follow relationship
    const deletedFollow =
      await Follow.findOneAndDelete(
        {
          follower: currentUserId,
          following: targetUser._id,
        },
        {
          session,
        }
      );

    if (!deletedFollow) {
      throw new AppError(
        "You are not following this user",
        400
      );
    }

    // Decrease following count
    await User.findByIdAndUpdate(
      currentUserId,
      {
        $inc: {
          followingCount: -1,
        },
      },
      {
        session,
      }
    );

    // Decrease followers count
    await User.findByIdAndUpdate(
      targetUser._id,
      {
        $inc: {
          followersCount: -1,
        },
      },
      {
        session,
      }
    );

    await session.commitTransaction();

    return {
      message: "User unfollowed successfully",
    };

  } catch (error) {

    await session.abortTransaction();

    throw error;

  } finally {

    session.endSession();

  }
};
export const getFollowersService = async (
  username
) => {
  const user = await User.findOne({
    username,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const followers = await Follow.find({
    following: user._id,
  }).populate(
    "follower",
    "username displayName profileImage"
  );

  return followers.map(
    (follow) => follow.follower
  );
};

export const getFollowingService = async (
  username
) => {
  const user = await User.findOne({
    username,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const following = await Follow.find({
    follower: user._id,
  }).populate(
    "following",
    "username displayName profileImage"
  );

  return following.map(
    (follow) => follow.following
  );
};

export const checkFollowStatusService = async (
  currentUserId,
  username
) => {
  const targetUser = await User.findOne({
    username,
  });

  if (!targetUser) {
    throw new AppError("User not found", 404);
  }

  const follow = await Follow.findOne({
    follower: currentUserId,
    following: targetUser._id,
  });

  return {
    isFollowing: !!follow,
  };
};