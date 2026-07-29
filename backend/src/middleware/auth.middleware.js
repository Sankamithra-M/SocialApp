import User from "../modules/users/user.model.js";
import AppError from "../errors/AppError.js";
import asyncHandler from "./asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const protect = asyncHandler(async (req, res, next) => {
  // We'll build this step by step
   const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Access token is required", 401);
  }
  if (!authHeader.startsWith("Bearer ")) {
    throw new AppError("Invalid authorization header", 401);
}
  const token = authHeader.split(" ")[1];
 const decoded = verifyAccessToken(token);

 const user = await User.findById(decoded.userId);

if (!user) {
    throw new AppError("User no longer exists", 401);
}

req.user = user;

next();

});