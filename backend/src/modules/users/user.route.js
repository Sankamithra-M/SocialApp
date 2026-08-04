import express from "express";
import {
  getProfile,
  updateProfile,
  updateProfileImage,
  changePassword,
} from "./user.controller.js";

import {
  followUser,   unfollowUser,

} from "../follows/follow.controller.js";

import { protect } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

router.get("/:username", getProfile);

router.patch("/profile", protect, updateProfile);

router.patch(
  "/profile-image",
  protect,
  upload.single("profileImage"),
  updateProfileImage
);

router.patch(
  "/change-password",
  protect,
  changePassword
);
export default router;

router.post(
  "/:username/follow",
  protect,
  followUser
);

router.delete(
  "/:username/unfollow",
  protect,
  unfollowUser
);