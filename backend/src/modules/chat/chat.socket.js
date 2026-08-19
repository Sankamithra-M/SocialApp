import jwt from "jsonwebtoken";

import User from "../users/user.model.js";
import Conversation from "./converstation.model.js";

import {
  sendMessageService,
  markMessagesAsReadService,
} from "./chat.service.js";


// ========================================
// SOCKET AUTHENTICATION
// ========================================

export const socketAuth = async (
  socket,
  next
) => {

  try {

    const token =
      socket.handshake.auth.token;


    if (!token) {

      return next(
        new Error(
          "Authentication required"
        )
      );

    }


    // ====================================
    // VERIFY JWT
    // ====================================

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // ====================================
    // FIND USER
    // ====================================

    const user =
      await User.findById(
        decoded.userId
      ).select(
        "_id username displayName profileImage"
      );


    if (!user) {

      return next(
        new Error(
          "User not found"
        )
      );

    }


    // ====================================
    // ATTACH USER TO SOCKET
    // ====================================

    socket.user = user;


    // ====================================
    // PERSONAL USER ROOM
    // ====================================

    socket.join(
      socket.user._id.toString()
    );


    console.log(
      "Socket authenticated:",
      socket.user.username
    );


    next();

  } catch (error) {

    console.log(
      "SOCKET AUTH ERROR:",
      error.message
    );

    next(
      new Error(
        "Invalid authentication token"
      )
    );

  }

};


// ========================================
// CHAT SOCKET EVENTS
// ========================================

export const registerChatSocket = (
  io,
  socket
) => {


  // ======================================
  // SEND MESSAGE
  // ======================================

  socket.on(
    "sendMessage",
    async (data) => {

      try {

        console.log(
          "\n========== NEW MESSAGE =========="
        );


        // ----------------------------------
        // 1. RECEIVE DATA
        // ----------------------------------

        const {
          conversationId,
          text,
        } = data;


        console.log(
          "1️⃣ Message received from:",
          socket.user.username
        );

        console.log(
          "Conversation ID:",
          conversationId
        );

        console.log(
          "Text:",
          text
        );


        // ----------------------------------
        // 2. FIND CONVERSATION
        // ----------------------------------

        const conversation =
          await Conversation.findById(
            conversationId
          );


        if (!conversation) {

          console.log(
            "❌ Conversation not found"
          );

          return;

        }


        console.log(
          "2️⃣ Conversation found"
        );

        console.log(
          "Participants:",
          conversation.participants
        );


        // ----------------------------------
        // 3. FIND RECEIVER
        // ----------------------------------

        const receiverId =
          conversation.participants.find(
            (participant) =>
              participant.toString() !==
              socket.user._id.toString()
          );


        if (!receiverId) {

          console.log(
            "❌ Receiver not found"
          );

          return;

        }


        console.log(
          "3️⃣ Receiver found:",
          receiverId.toString()
        );


        // ----------------------------------
        // 4. SAVE MESSAGE
        // ----------------------------------

        const message =
          await sendMessageService(
            socket.user._id,
            conversationId,
            text
          );


        console.log(
          "4️⃣ ✅ MESSAGE SAVED TO MONGODB"
        );

        console.log(
          "Message ID:",
          message._id.toString()
        );

        console.log(
          "Message text:",
          message.text
        );


        // ----------------------------------
        // 5. SEND TO RECEIVER
        // ----------------------------------

        io.to(
          receiverId.toString()
        ).emit(
          "newMessage",
          message
        );


        console.log(
          "5️⃣ ✅ MESSAGE SENT TO RECEIVER ROOM"
        );

        console.log(
          "Receiver room:",
          receiverId.toString()
        );


        console.log(
          "================================\n"
        );


      } catch (error) {

        console.log(
          "❌ SEND MESSAGE ERROR:",
          error.message
        );

      }

    }
  );


  // ======================================
  // MARK MESSAGES AS READ
  // ======================================

  socket.on(
    "markMessagesRead",
    async (data) => {

      try {

        console.log(
          "\n========== MARK MESSAGES READ =========="
        );


        // ----------------------------------
        // 1. RECEIVE CONVERSATION ID
        // ----------------------------------

        const {
          conversationId,
        } = data;


        console.log(
          "1️⃣ User:",
          socket.user.username
        );

        console.log(
          "Conversation ID:",
          conversationId
        );


        // ----------------------------------
        // 2. FIND CONVERSATION
        // ----------------------------------

        const conversation =
          await Conversation.findById(
            conversationId
          );


        if (!conversation) {

          console.log(
            "❌ Conversation not found"
          );

          return;

        }


        console.log(
          "2️⃣ Conversation found"
        );


        // ----------------------------------
        // 3. FIND OTHER USER
        // ----------------------------------

        const otherUserId =
          conversation.participants.find(
            (participant) =>
              participant.toString() !==
              socket.user._id.toString()
          );


        if (!otherUserId) {

          console.log(
            "❌ Other user not found"
          );

          return;

        }


        console.log(
          "3️⃣ Other user:",
          otherUserId.toString()
        );


        // ----------------------------------
        // 4. MARK MESSAGES AS READ
        // ----------------------------------

        const result =
          await markMessagesAsReadService(
            socket.user._id,
            conversationId
          );


        console.log(
          "4️⃣ ✅ MESSAGES MARKED AS READ"
        );

        console.log(
          "Modified count:",
          result.modifiedCount
        );


        // ----------------------------------
        // 5. INFORM THE OTHER USER
        // ----------------------------------

        io.to(
          otherUserId.toString()
        ).emit(
          "messagesRead",
          {
            conversationId,
            readBy: socket.user._id,
            modifiedCount:
              result.modifiedCount,
          }
        );


        console.log(
          "5️⃣ ✅ READ RECEIPT SENT"
        );

        console.log(
          "Sent to:",
          otherUserId.toString()
        );


        console.log(
          "========================================\n"
        );


      } catch (error) {

        console.log(
          "❌ MARK READ ERROR:",
          error.message
        );

      }

    }
  );

};