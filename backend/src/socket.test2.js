import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTY5ZDljNjZmNGQ4NzljNmQzNzRiMzAiLCJpYXQiOjE3ODcxMzAxNTcsImV4cCI6MTc4NzczNDk1N30.fUo0rtZceCBrgminc0EPyniQeBuHJJd3r-5N0XC147g",
  },
});


// ========================================
// CONNECT
// ========================================

socket.on("connect", () => {

  console.log(
    "John connected:",
    socket.id
  );

});


// ========================================
// RECEIVE NEW MESSAGE
// ========================================

socket.on("newMessage", (message) => {

  console.log(
    "\n🔥🔥 NEW MESSAGE RECEIVED 🔥🔥"
  );

  console.log(
    "Message:",
    message
  );

});


// ========================================
// MESSAGES READ
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
      "John connection failed:",
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
      "John disconnected"
    );

  }
);