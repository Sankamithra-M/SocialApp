import { registerUser, loginUser } from "./auth.service.js";
import AppError from "../../errors/AppError.js";
import asyncHandler from "../../middleware/asyncHandler.js";

export const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new AppError("All fields are required", 400);
    }

    const user = await registerUser({
      username,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: user,
    });
   })


// Existing register controller...

export const login = asyncHandler(async (req, res, next) => {
  const { identifier, password } = req.body;

    if (!identifier || !password) {
      throw new AppError("Identifier and password are required", 400);
    }

    const result = await loginUser({
      identifier,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }) 