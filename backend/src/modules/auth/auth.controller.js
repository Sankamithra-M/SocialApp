import {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken
} from "./auth.service.js";

import AppError from "../../errors/AppError.js";
import asyncHandler from "../../middleware/asyncHandler.js";


// ========================================
// REGISTER
// ========================================

export const register = asyncHandler(
  async (req, res) => {

    const {
      username,
      email,
      password,
    } = req.body;


    if (
      !username ||
      !email ||
      !password
    ) {
      throw new AppError(
        "All fields are required",
        400
      );
    }


    const user =
      await registerUser({
        username,
        email,
        password,
      });


    res.status(201).json({
      success: true,
      message:
        "Account created successfully",
      data: user,
    });

  }
);


// ========================================
// LOGIN
// ========================================

export const login = asyncHandler(
  async (req, res) => {

    const {
      identifier,
      password,
    } = req.body;


    if (
      !identifier ||
      !password
    ) {
      throw new AppError(
        "Identifier and password are required",
        400
      );
    }


    const result =
      await loginUser({
        identifier,
        password,
      });


    // ====================================
    // REFRESH TOKEN → HTTP ONLY COOKIE
    // ====================================

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "strict"
            : "lax",

        maxAge:
          7 * 24 * 60 * 60 * 1000,

        path: "/",
      }
    );


    // ====================================
    // RESPONSE
    // ====================================

    res.status(200).json({

      success: true,

      message:
        "Login successful",

      data: {

        accessToken:
          result.accessToken,

        user:
          result.user,

      },

    });

  }
);


// ========================================
// GET CURRENT USER
// ========================================

export const getMe =
  asyncHandler(
    async (req, res) => {

      const user =
        await getCurrentUser(
          req.user
        );


      res.status(200).json({

        success: true,

        data: user,

      });

    }
  );
  export const refresh = asyncHandler(
  async (req, res) => {

    const refreshToken =
      req.cookies.refreshToken;

    const accessToken =
      await refreshAccessToken(
        refreshToken
      );

    res.status(200).json({

      success: true,

      message:
        "Access token refreshed successfully",

      data: {
        accessToken,
      },

    });

  }
);

// ========================================
// LOGOUT
// ========================================

export const logout = asyncHandler(
  async (req, res) => {

    res.clearCookie(
      "refreshToken",
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "strict"
            : "lax",

        path: "/",
      }
    );

    res.status(200).json({

      success: true,

      message:
        "Logout successful",

    });

  }
);