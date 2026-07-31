import User from "./user.model.js";
import AppError from "../../errors/AppError.js";
import cloudinary from "../../config/cloudinary.js";
import fs from "fs";
console.log("Cloudinary config loaded");
export const getUserProfile = async (username) => {
  const user = await User.findOne({ username }).lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    profileImage: user.profileImage,
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    isPrivate: user.isPrivate,
  };
};

export const updateUserProfile = async (
  userId,
  { displayName, bio }
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Validate display name
  if (displayName !== undefined) {
    if (displayName.trim() === "") {
      throw new AppError("Display name cannot be empty", 400);
    }

    user.displayName = displayName.trim();
  }

  // Validate bio
  if (bio !== undefined) {
    user.bio = bio.trim();
  }

  await user.save();

  return {
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    profileImage: user.profileImage,
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    isPrivate: user.isPrivate,
  };
};


export const updateProfileImageService = async (
  userId,
  file
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!file) {
    throw new AppError(
      "Profile image is required",
      400
    );
  }

  const uploadResult =
    await cloudinary.uploader.upload(file.path, {
      folder: "social-app/profile-images",
    });

  if (user.profileImage.publicId) {
    await cloudinary.uploader.destroy(
      user.profileImage.publicId
    );
  }

  fs.unlinkSync(file.path);

  user.profileImage = {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };

  await user.save();

  return {
    profileImage: user.profileImage,
  };
};