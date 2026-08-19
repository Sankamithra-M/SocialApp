import express from "express";

import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
  markMessagesAsRead,

} from "./chat.controller.js";

import {
  protect,
} from "../../middleware/auth.middleware.js";

const router = express.Router();


// ========================================
// CONVERSATION
// ========================================

router.post(
  "/conversations",
  protect,
  getOrCreateConversation
);


// ========================================
// SEND MESSAGE
// ========================================

router.post(
  "/messages",
  protect,
  sendMessage
);


// ========================================
// GET MESSAGES
// ========================================

router.get(
  "/conversations/:conversationId/messages",
  protect,
  getMessages
);


// ========================================
// MARK MESSAGES AS READ
// ========================================
router.patch(
  "/conversations/:conversationId/read",
  protect,
  markMessagesAsRead
);


export default router;