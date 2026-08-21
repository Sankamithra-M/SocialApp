import { z } from "zod";


// ========================================
// REGISTER
// ========================================

export const registerSchema = z.object({

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

});


// ========================================
// LOGIN
// ========================================

export const loginSchema = z.object({

  identifier: z
    .string()
    .trim()
    .min(1, "Email or username is required"),

  password: z
    .string()
    .min(1, "Password is required"),

});