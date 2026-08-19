import "dotenv/config";

import express from "express";
import cors from "cors";
import http from "http";

import { connectDB } from "./db.js";

import errorHandler from "./middleware/error.middleware.js";

import authRoutes from "./modules/auth/auth.route.js";
import userRoutes from "./modules/users/user.route.js";
import postRoutes from "./modules/posts/post.route.js";
import feedRoutes from "./modules/feed/feed.route.js";
import notificationRoutes from "./modules/notification/notification.route.js";
import chatRoutes from "./modules/chat/chat.route.js";
import cookieParser from "cookie-parser";
import { initializeSocket } from "./socket/socket.js";


// ========================================
// EXPRESS APP
// ========================================

const app = express();

const PORT = process.env.PORT || 5000;


// ========================================
// HTTP SERVER
// ========================================

const httpServer = http.createServer(app);


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());
app.use(cookieParser());

// ========================================
// DATABASE
// ========================================

connectDB();


// ========================================
// SOCKET.IO
// ========================================

initializeSocket(httpServer);


// ========================================
// REST API ROUTES
// ========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api/feed",
  feedRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);


// ========================================
// ROOT ROUTE
// ========================================

app.get("/", (req, res) => {

  res.send(
    "API is running..."
  );

});


// ========================================
// ERROR HANDLER
// ========================================

app.use(errorHandler);


// ========================================
// START SERVER
// ========================================

httpServer.listen(
  PORT,
  () => {

    console.log(
      "================================"
    );

    console.log(
      `Server is running on port ${PORT}`
    );

    console.log(
      "Socket.IO server is ready"
    );

    console.log(
      "================================"
    );

  }
);