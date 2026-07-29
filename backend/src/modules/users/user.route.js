import express from "express";
import {
  getProfile,
  updateProfile,
} from "./user.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:username", getProfile);

router.patch(
  "/profile",
  protect,
  updateProfile
);

export default router;