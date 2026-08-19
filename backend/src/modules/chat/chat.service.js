import AppError from "../../errors/AppError.js";

import Message from "./message.model.js";
import Conversation from "./converstation.model.js";
import User from "../users/user.model.js";


// ========================================
// GET OR CREATE CONVERSATION
// ========================================

export const getOrCreateConversationService = async (
  currentUserId,
  username
) => {
  // Find target user
  const targetUser = await User.findOne({
    username,
  });

  if (!targetUser) {
    throw new AppError(
      "User not found",
      404
    );
  }

  // Cannot chat with yourself
  if (
    currentUserId.toString() ===
    targetUser._id.toString()
  ) {
    throw new AppError(
      "You cannot start a conversation with yourself",
      400
    );
  }

  // Check existing conversation
  const existingConversation =
    await Conversation.findOne({
      participants: {
        $all: [
          currentUserId,
          targetUser._id,
        ],
      },
    }).populate(
      "participants",
      "username displayName profileImage"
    );

  if (existingConversation) {
    return existingConversation;
  }

  // Create conversation
  const [conversation] =
    await Conversation.create([
      {
        participants: [
          currentUserId,
          targetUser._id,
        ],
      },
    ]);

  // Populate participants
  await conversation.populate(
    "participants",
    "username displayName profileImage"
  );

  return conversation;
};


// ========================================
// SEND MESSAGE
// ========================================

export const sendMessageService = async (
  currentUserId,
  conversationId,
  text
) => {
  // Validate message
  if (!text?.trim()) {
    throw new AppError(
      "Message cannot be empty",
      400
    );
  }

  // Find conversation
  const conversation =
    await Conversation.findById(
      conversationId
    );

  if (!conversation) {
    throw new AppError(
      "Conversation not found",
      404
    );
  }

  // Check participant
  const isParticipant =
    conversation.participants.some(
      (participant) =>
        participant.toString() ===
        currentUserId.toString()
    );

  if (!isParticipant) {
    throw new AppError(
      "You are not a participant of this conversation",
      403
    );
  }

  // Create message
  const message = await Message.create({
    conversation: conversationId,
    sender: currentUserId,
    text: text.trim(),
  });

  // Update conversation
  conversation.lastMessage = message._id;
  conversation.lastMessageAt =
    message.createdAt;

  await conversation.save();

  // Populate sender
  await message.populate(
    "sender",
    "username displayName profileImage"
  );

  return message;
};


// ========================================
// GET MESSAGES
// ========================================
export const getMessagesService = async (
  userId,
  conversationId,
  limit = 20,
  cursor = null
) => {
  const conversation =
    await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError(
      "Conversation not found",
      404
    );
  }

  // Check participant
  const isParticipant =
    conversation.participants.some(
      (participant) =>
        participant.toString() ===
        userId.toString()
    );

  if (!isParticipant) {
    throw new AppError(
      "You are not a participant of this conversation",
      403
    );
  }

  // Validate limit
  limit = Math.min(
    Math.max(Number(limit) || 20, 1),
    50
  );

  // Build query
  const query = {
    conversation: conversationId,
  };

  // If cursor exists, get older messages
  if (cursor) {
    const cursorDate = new Date(cursor);

    if (
      Number.isNaN(
        cursorDate.getTime()
      )
    ) {
      throw new AppError(
        "Invalid message cursor",
        400
      );
    }

    query.createdAt = {
      $lt: cursorDate,
    };
  }

  // Get one extra message
  const messages =
    await Message.find(query)
      .populate(
        "sender",
        "username displayName profileImage"
      )
      .sort({
        createdAt: -1,
      })
      .limit(limit + 1);

  // Check whether more messages exist
  const hasMore =
    messages.length > limit;

  // Return only requested limit
  const messagesToReturn = hasMore
    ? messages.slice(0, limit)
    : messages;

  // Get next cursor
  const nextCursor = hasMore
    ? messagesToReturn[
        messagesToReturn.length - 1
      ].createdAt
    : null;

  return {
    messages: messagesToReturn,
    nextCursor,
    hasMore,
  };
};

export const markMessagesAsReadService = async (
  userId,
  conversationId
) => {
  const conversation =
    await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError(
      "Conversation not found",
      404
    );
  }

  // Check whether user belongs to conversation
  const isParticipant =
    conversation.participants.some(
      (participant) =>
        participant.toString() ===
        userId.toString()
    );

  if (!isParticipant) {
    throw new AppError(
      "You are not a participant of this conversation",
      403
    );
  }

  // Mark messages from the other user as read
  const result =
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: {
          $ne: userId,
        },
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

  return {
    message: "Messages marked as read",
    modifiedCount: result.modifiedCount,
  };
};