import { Server } from "socket.io";

import {
  socketAuth,
  registerChatSocket,
} from "../modules/chat/chat.socket.js";


// ========================================
// INITIALIZE SOCKET.IO
// ========================================

export const initializeSocket = (
  httpServer
) => {

  console.log(
    "Initializing Socket.IO..."
  );


  // ======================================
  // CREATE SOCKET.IO SERVER
  // ======================================

  const io = new Server(
    httpServer,
    {
      cors: {
        origin: "*",
      },
    }
  );


  console.log(
    "Socket.IO server created"
  );


  // ======================================
  // SOCKET AUTHENTICATION
  // ======================================

  io.use(socketAuth);


  console.log(
    "Socket authentication middleware registered"
  );


  // ======================================
  // SOCKET CONNECTION
  // ======================================

  io.on(
    "connection",
    (socket) => {

      console.log(
        "================================"
      );

      console.log(
        "SOCKET CONNECTED"
      );

      console.log(
        "Socket ID:",
        socket.id
      );

      console.log(
        "Username:",
        socket.user.username
      );

      console.log(
        "User ID:",
        socket.user._id.toString()
      );


      // ==================================
      // REGISTER CHAT EVENTS
      // ==================================

      registerChatSocket(
        io,
        socket
      );


      console.log(
        "Chat socket events registered"
      );


      // ==================================
      // DISCONNECT
      // ==================================

      socket.on(
        "disconnect",
        (reason) => {

          console.log(
            "SOCKET DISCONNECTED"
          );

          console.log(
            "Socket ID:",
            socket.id
          );

          console.log(
            "Reason:",
            reason
          );

          console.log(
            "================================"
          );

        }
      );

    }
  );


  return io;
};