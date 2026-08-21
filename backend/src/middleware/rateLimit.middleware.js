import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 100,

  message: {
    success: false,
    status: "fail",
    message:
      "Too many requests. Please try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  message: {
    success: false,
    status: "fail",
    message:
      "Too many authentication attempts. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});