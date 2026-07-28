// do basic mern setup with express, mongoose, dotenv, cors, nodemon, and body-parser
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.route.js";








//routes_using
app.use("/api/auth", authRoutes);







app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("API is running...");
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 