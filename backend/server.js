import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();
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

app.listen(port, () => {
  console.log(`Running on port ${port}`);
  connectDb();
});
