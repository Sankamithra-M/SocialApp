import { io } from "socket.io-client";
import readline from "readline";

const socket = io("http://localhost:8000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTcxYWM1Nzc2NWQxNDc1YTljOWNmZDIiLCJpYXQiOjE3ODcxMzAxOTIsImV4cCI6MTc4NzczNDk5Mn0.EfiQC0yfeU3zMeyCv5Y-7ZfxM6kP4HCBdVgWE7q8xE0",
  },
});


// ========================================
// READLINE
// ========================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


// ========================================
// CONNECT
// ========================================

socket.on("connect", () => {

  console.log(
    "Sara connected:",
    socket.id
  );

  console.log(
    "Type a message and press Enter:"
  );

});


// ========================================
// SEND MESSAGE
// ========================================

rl.on("line", (text) => {

  if (!text.trim()) {
    return;
  }

  console.log(
    "YOU TYPED:",
    text
  );

  socket.emit(
    "sendMessage",
    {
      conversationId:
        "6a7b0562d9bac6928e9712d2",

      text: text,
    }
  );

});


// ========================================
// MESSAGE READ RECEIPT
// ========================================

socket.on(
  "messagesRead",
  (data) => {

    console.log(
      "\n📖📖 MESSAGES READ 📖📖"
    );

    console.log(
      "Read information:",
      data
    );

  }
);


// ========================================
// CONNECTION ERROR
// ========================================

socket.on(
  "connect_error",
  (error) => {

    console.log(
      "Sara connection failed:",
      error.message
    );

  }
);


// ========================================
// DISCONNECT
// ========================================

socket.on(
  "disconnect",
  () => {

    console.log(
      "Sara disconnected"
    );

  }
);