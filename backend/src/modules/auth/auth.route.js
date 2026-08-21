import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { register, login , getMe , refresh , logout} from "./auth.controller.js";
import validate from "../../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../../validators/auth.validator.js";
import { authLimiter } from "../../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh",refresh);
router.post("/logout",logout);
router.get("/me", protect, getMe);


export default router;