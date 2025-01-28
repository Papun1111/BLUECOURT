import express from 'express';
const postRouter = express.Router();
import { createPost,deletePost,commentOnPost,likeUnlikePost } from '../controllers/post.controller.js';

import { protectRoute } from '../middleware/protectRoute.js';


postRouter.post("/create",protectRoute,createPost);
postRouter.post("/like:id",protectRoute,likeUnlikePost);
postRouter.post("/comment/:id",protectRoute,commentOnPost);
postRouter.delete("/",protectRoute,deletePost);

export default postRouter;