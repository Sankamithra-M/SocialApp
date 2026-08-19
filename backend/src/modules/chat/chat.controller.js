import asyncHandler from "../../middleware/asyncHandler.js";

import {
  getOrCreateConversationService,
  sendMessageService,
  getMessagesService,
  markMessagesAsReadService
} from "./chat.service.js";


// ========================================
// GET OR CREATE CONVERSATION
// ========================================

export const getOrCreateConversation =
  asyncHandler(async (req, res) => {
    const { username } = req.body;

    const conversation =
      await getOrCreateConversationService(
        req.user._id,
        username
      );

    res.status(200).json({
      success: true,
      data: conversation,
    });
  });


// ========================================
// SEND MESSAGE
// ========================================

export const sendMessage =
  asyncHandler(async (req, res) => {
    const {
      conversationId,
      text,
    } = req.body;

    const message =
      await sendMessageService(
        req.user._id,
        conversationId,
        text
      );

    res.status(201).json({
      success: true,
      data: message,
    });
  });


// ========================================
// GET MESSAGES
// ========================================

export const getMessages =
  asyncHandler(async (req, res) => {
    const { conversationId } =
      req.params;

    const { limit, cursor } =
      req.query;

    const result =
      await getMessagesService(
        req.user._id,
        conversationId,
        limit,
        cursor
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  export const markMessagesAsRead =
  asyncHandler(async (req, res) => {
    const { conversationId } =
      req.params;

    const result =
      await markMessagesAsReadService(
        req.user._id,
        conversationId
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  });