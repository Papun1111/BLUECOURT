import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { getUserProfile,followUnfollowUser } from "../controllers/user.controller.js";
const userRouter=express.Router();

userRouter.get("/profile/:username",protectRoute,getUserProfile);
userRouter.get("/suggested",protectRoute,getUserProfile);
userRouter.post("/follow/:id",protectRoute,followUnfollowUser);
userRouter.post("/update",protectRoute,updateUserProfile);

export default userRouter;