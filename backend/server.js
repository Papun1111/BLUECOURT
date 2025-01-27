import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/users.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
});
const url=process.env.MONGO_URL;
const app = express();
const port = process.env.PORT || 3000;
const connectDb=async()=>{
  try {
    await mongoose.connect(url);
console.log("DB CONNECTED!");
  } catch (error) {
    console.log(error.message);
  }

}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/user",userRouter)

app.listen(port, () => {
  console.log(`Running on port ${port}`);
  connectDb();
});
