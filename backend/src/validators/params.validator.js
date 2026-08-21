import { z } from "zod";
import { objectIdSchema } from "./common.validator.js";

export const userIdParamsSchema = z
  .object({
    userId: objectIdSchema,
  })
  .strict();


export const postIdParamsSchema = z.object({
  postId: objectIdSchema,
}).strict();

export const commentIdParamsSchema = z.object({
  commentId: objectIdSchema,
}).strict();

export const ConversationParamsSchema = z.object({
  ConverstationId: objectIdSchema,
}).strict();

export const LikeParamsSchema = z.object({
  LikeId: objectIdSchema,
}).strict();

export const NotificationParamsSchema = z.object({
  NotificationId: objectIdSchema,
}).strict();