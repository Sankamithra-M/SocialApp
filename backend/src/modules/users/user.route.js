import express from "express";
import {
  getProfile,
  updateProfile,
  updateProfileImage,
} from "./user.controller.js";

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

export default router;