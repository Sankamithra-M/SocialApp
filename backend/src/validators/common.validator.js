import { z } from "zod";
import mongoose from "mongoose";

export const objectIdSchema = z
  .string()
  .refine(
    (value) =>
      mongoose.Types.ObjectId.isValid(value),
    {
      message: "Invalid ID",
    }
  );