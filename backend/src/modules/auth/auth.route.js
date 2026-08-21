import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { register, login , getMe , refresh , logout} from "./auth.controller.js";
import validate from "../../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../../validators/auth.validator.js";


const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh",refresh);
router.post("/logout",logout);
router.get("/me", protect, getMe);


export default router;