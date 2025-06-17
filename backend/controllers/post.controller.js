import Post from "../models/post.model.js";
import userModel from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id.toString();

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let img;

    // If image file is provided
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadedResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "bluecourt-posts",
      });
      img = uploadedResponse.secure_url;
    }

    // Ensure at least text or image exists
    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default createPost;
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

const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const comment = { user: userId, text };

		post.comments.push(comment);
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await userModel.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			// Like post
			post.likes.push(userId);
			await userModel.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    if (!posts.length) {
      console.log("no posts found");
      return res.status(404).json({ message: "No posts found" });
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getLikedPosts = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await userModel.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getFollowingPosts=async (req,res) => {
  try {
    const userId=req.user._id;
    const user=await userModel.findById(userId);
    if(!user) return res.status(404).json({message:"User not found"});
    const followingPosts=await Post.find({user:{$in:user.following}}).sort({createdAt:-1}).populate({path:"user",select:"-password"}).populate({path:"comments.user",select:"-password"});
    if(followingPosts.length===0) return res.status(404).json({message:"No posts found"});
    res.status(200).json(followingPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts: ",error.message);
    res.status(500).json({error:error.message});
    
  }
}
const getUserPosts=async (req,res) => {
   try {
    const {username}=req.params;
    const user=await userModel.findOne({username});
    if(!user) return res.status(404).json({message:"User not found"});
    const posts=await Post.find({user:user._id}).sort({createdAt:-1}).populate({path:"user",select:"-password"}).populate({path:"comments.user",select:"-password"}); 
    if(posts.length===0) return res.status(404).json({message:"No posts found"}); 
    res.status(200).json(posts);
   } catch (error) {
    console,log("Error in getUserPosts: ",error.message);
    res.status(500).json({error:error.message});
   }
}
export { createPost, deletePost,commentOnPost,likeUnlikePost,getAllPosts,getLikedPosts,getFollowingPosts,getUserPosts};
