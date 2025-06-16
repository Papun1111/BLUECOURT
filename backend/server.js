import express from "express";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/users.routes.js";
import postRouter from "./routes/post.routes.js";
import notificationRouter from "./routes/notification.routes.js";

// Load environment variables
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Initialize app
const app = express();
app.use(cors({
  origin: 'https://bluecourt.onrender.com',
  credentials: true
}));

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/notification", notificationRouter);

// MongoDB connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ DB CONNECTED!");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
  }
};

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  connectDb();
});
