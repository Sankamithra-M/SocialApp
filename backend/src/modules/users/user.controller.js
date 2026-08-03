import asyncHandler from "../../middleware/asyncHandler.js";
import {
  getUserProfile,
  updateUserProfile,
  updateProfileImageService,
  changePasswordService,
} from "./user.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const profile = await getUserProfile(username);

  res.status(200).json({
    success: true,
    data: profile,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { displayName, bio } = req.body;

  const profile = await updateUserProfile(
    req.user._id,
    {
      displayName,
      bio,
    }
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: profile,
  });
});

export const updateProfileImage = asyncHandler(
  async (req, res) => {
    const result = await updateProfileImageService(
      req.user._id,
      req.file
    );

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: result,
    });
  }
);

export const changePassword = asyncHandler(
  async (req, res) => {
    const { currentPassword, newPassword } =
      req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError(
        "Current password and new password are required",
        400
      );
    }

    await changePasswordService(
      req.user._id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }
);