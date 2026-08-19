import bcrypt from "bcryptjs";
import User from "../users/user.model.js";
import AppError from "../../errors/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../../utils/jwt.js";


export const registerUser = async ({
  username,
  email,
  password,
}) => {
  // Check if username or email already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
throw new AppError("Email already exists", 409);    }

    if (existingUser.username === username) {
      throw new AppError("Username already exists", 409);
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    displayName: username, // Set displayName to username by default
  });

  // Return only required fields
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
};



// Existing registerUser() stays here...

export const loginUser = async ({
  identifier,
  password,
}) => {

  const user = await User.findOne({
    $or: [
      { email: identifier },
      { username: identifier },
    ],
  }).select("+password");


  if (!user) {
    throw new AppError(
      "Invalid credentials",
      401
    );
  }


  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );


  if (!isPasswordValid) {
    throw new AppError(
      "Invalid credentials",
      401
    );
  }


  const accessToken =
    generateAccessToken(user._id);


  const refreshToken =
    generateRefreshToken(user._id);


  return {

    accessToken,

    refreshToken,

    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },

  };

};

export const getCurrentUser = async (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
  };
};


export const refreshAccessToken = async (
  refreshToken
) => {

  if (!refreshToken) {
    throw new AppError(
      "Refresh token required",
      401
    );
  }

  let decoded;

  try {

    decoded =
      verifyRefreshToken(
        refreshToken
      );

  } catch (error) {

    throw new AppError(
      "Invalid or expired refresh token",
      401
    );

  }

  const user =
    await User.findById(
      decoded.userId
    );

  if (!user) {
    throw new AppError(
      "User not found",
      401
    );
  }

  const accessToken =
    generateAccessToken(
      user._id
    );

  return accessToken;
};