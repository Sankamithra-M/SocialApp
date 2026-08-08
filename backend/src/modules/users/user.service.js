import User from "./user.model.js";
import AppError from "../../errors/AppError.js";
import bcrypt from "bcryptjs";

import {
  uploadImagesToCloudinary,
  deleteImagesFromCloudinary,
} from "../../utils/cloudinaryUpload.js";
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

  // Upload the new profile image
  const [uploadedImage] =
    await uploadImagesToCloudinary(
      [file],
      "social-app/profile-images"
    );

  // Delete old profile image from Cloudinary
  if (user.profileImage?.publicId) {
    await deleteImagesFromCloudinary([
      {
        publicId: user.profileImage.publicId,
      },
    ]);
  }

  // Update user document
  user.profileImage = uploadedImage;

  await user.save();

  return {
    profileImage: user.profileImage,
  };
};

export const changePasswordService = async (
  userId,
  currentPassword,
  newPassword
) => {
  // Include password because it is select: false
  const user = await User.findById(userId).select("+password");
   console.log(user)
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Verify current password
  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new AppError("Current password is incorrect", 400);
  }

  // Prevent using the same password
  const isSamePassword = await bcrypt.compare(
    newPassword,
    user.password
  );

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from the current password",
      400
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    12
  );

  user.password = hashedPassword;

  await user.save();
};