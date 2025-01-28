import Post from "../models/post.model.js";
import userModel from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { img } = req.body;
    const userId = req.user._id.toString();
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!text && !img)
      return res.status(400).json({ message: "Please enter text or image" });
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img, {
        upload_preset: "social_media",
      });
      img = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      user: userId,
      text,
      img,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in createPost: ", error.message);
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user._id.toString())
      return res
        .status(401)
        .json({ message: "You can delete only your posts" });
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in deletePost: ", error.message);
  }
};

const commentOnPost=async (req,res) => {
 try {
    const {text}=req.body;
    const postId=req.params.id;
    const userId=req.user._id;
    if(!text) return res.status(400).json({message:"Please enter text"});
    const post=await Post.findById(postId);
    if(!post) return res.status(404).json({message:"Post not found"});
    const comment={
        text,
        user:userId 
    }
    post.comments.push(comment);
    await post.save();
    res.status(201).json(post);
 } catch (error) {
    console.log("Error in commentOnPost: ",error.message);
    res.status(500).json({error:error.message});
 }
    
}
const likeUnlikePost=async (req,res) => {
    try {
        const userId=req.user._id;
        const {id:postId}=req.params;
        const post=await Post.findById(postId);
        if(!post) return res.status(404).json({message:"Post not found"});
        const isLiked=post.likes.includes(userId);
        if(isLiked){
            await post.updateOne({_id:postId},{$pull:{likes:userId}});
        res.status(200).json({message:"Post unliked"});
        }
        else{
            post.likes.push(userId);
            await post.save();
            const notification=new Notification({
                type:"like",
                from:userId,
                to:post.user
            });
            await notification.save();
            res.status(200).json({message:"Post liked"});
        }
    } catch (error) {
        console.log("Error in likeUnlikePost: ",error.message);
        res.status(500).json({error:error.message});
    }
}
export { createPost, deletePost,commentOnPost,likeUnlikePost};
