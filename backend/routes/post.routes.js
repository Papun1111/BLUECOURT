import express from 'express';
const postRouter = express.Router();
import { createPost,deletePost,commentOnPost,likeUnlikePost,getAllPosts,getLikedPosts,getFollowingPosts,getUserPosts } from '../controllers/post.controller.js';

import { protectRoute } from '../middleware/protectRoute.js';

postRouter.get("/all",protectRoute,getAllPosts);
postRouter.get("/following",protectRoute,getFollowingPosts);
postRouter.get("/likes:/id",protectRoute,getLikedPosts);
postRouter.get("/user/:username",protectRoute,getUserPosts);
postRouter.post("/create",protectRoute,createPost);
postRouter.post("/like/:id",protectRoute,likeUnlikePost);
postRouter.post("/comment/:id",protectRoute,commentOnPost);
postRouter.delete("/:id",protectRoute,deletePost);

export default postRouter;