import Follow from "./follow.model.js";
import User from "../users/user.model.js";
import AppError from "../../errors/AppError.js";


export const followUserService = async (
  currentUserId,
  username
) => {

const targetUser = await User.findOne({
  username,
});

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
});

if (existingFollow) {
  throw new AppError(
    "You are already following this user",
    400
  );
}

await Follow.create({
  follower: currentUserId,
  following: targetUser._id,
});


await User.findByIdAndUpdate(
  currentUserId,
  {
    $inc: {
      followingCount: 1,
    },
  }
);

await User.findByIdAndUpdate(
  targetUser._id,
  {
    $inc: {
      followersCount: 1,
    },
  }
);
return {
  message: "User followed successfully",
};

};



export const unfollowUserService = async (
  currentUserId,
  username
) => {
  // Find target user
  const targetUser = await User.findOne({
    username,
  });

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
    await Follow.findOneAndDelete({
      follower: currentUserId,
      following: targetUser._id,
    });

  // User was not following
  if (!deletedFollow) {
    throw new AppError(
      "You are not following this user",
      400
    );
  }

  // Decrease following count of current user
  await User.findByIdAndUpdate(currentUserId, {
    $inc: {
      followingCount: -1,
    },
  });

  // Decrease followers count of target user
  await User.findByIdAndUpdate(targetUser._id, {
    $inc: {
      followersCount: -1,
    },
  });

  return {
    message: "User unfollowed successfully",
  };
};

