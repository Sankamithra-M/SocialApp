import asyncHandler from "../../middleware/asyncHandler.js";
import {
  getUserProfile,
  updateUserProfile,
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