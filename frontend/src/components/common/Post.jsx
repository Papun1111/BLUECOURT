import { FaRegComment, FaRegHeart, FaHeart, FaRegBookmark, FaTrash } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = authUser._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  // Mutation logic for deleting post
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete post");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Post deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  // Mutation logic for liking post
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/like/${post._id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to like post");
      return data.likes;
    },
    onSuccess: () => {
      toast.success(isLiked ? "Post unliked" : "Post liked");  
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => toast.error(error.message),
  });

  // Mutation logic for commenting on post
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      if (!comment.trim()) throw new Error("Comment cannot be empty");
      const res = await fetch(`/api/posts/comment/${post._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post comment");
      return data;
    },
    onSuccess: () => {
      setComment("");
      toast.success("Comment posted successfully");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => toast.error(error.message),
  });

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Link to={`/profile/${postOwner.username}`} className="flex items-center space-x-3 group">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-400 dark:group-hover:ring-blue-600 transition-all duration-300"
          >
            <img 
              src={postOwner.profileImg || "/avatar-placeholder.png"} 
              alt="profile"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800 dark:text-gray-200 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {postOwner.username}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">{formattedDate}</span>
          </div>
        </Link>
        {isMyPost && (
          <motion.button 
            whileHover={{ scale: 1.2, color: "#f56565" }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-500 dark:text-gray-400 transition-colors duration-200"
            onClick={() => {
              if (confirm('Are you sure you want to delete this post?')) {
                deletePost();
              }
            }}
          >
            {isDeleting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <FaTrash className="w-4 h-4" />
            )}
          </motion.button>
        )}
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        <p className="text-gray-800 dark:text-gray-200 text-sm mb-3">{post.text}</p>
        {post.img && (
          <motion.div 
            className="relative rounded-lg overflow-hidden mb-2 max-w-md mx-auto"  // image container is smaller and centered
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={post.img}
              className="w-full h-auto object-cover" // ensures the image scales correctly
              alt="post content"
            />
          </motion.div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <motion.button 
              onClick={likePost}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 dark:text-gray-400 transition-colors duration-200"
            >
              {isLiking ? (
                <LoadingSpinner size="sm" />
              ) : isLiked ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <FaHeart className="w-5 h-5 text-pink-500" />
                </motion.div>
              ) : (
                <FaRegHeart className="w-5 h-5" />
              )}
            </motion.button>
            
            {/* Comment Button */}
            <motion.button 
              onClick={handleToggleComments}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 dark:text-gray-400 transition-colors duration-200"
            >
              <FaRegComment className="w-5 h-5" />
            </motion.button>
            
            {/* Repost Button */}
            <motion.button 
              whileHover={{ scale: 1.2, color: "#48bb78" }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 dark:text-gray-400 transition-colors duration-200"
            >
              <BiRepost className="w-6 h-6" />
            </motion.button>
          </div>
          
          {/* Bookmark Button */}
          <motion.button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-500 dark:text-gray-400 transition-colors duration-200"
          >
            {isBookmarked ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <FaRegBookmark className="w-5 h-5 text-blue-500" />
              </motion.div>
            ) : (
              <FaRegBookmark className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Likes Count */}
        <div className="text-gray-800 dark:text-gray-200 text-xs font-medium mb-1">
          {post.likes.length} likes
        </div>

        {/* Comments Preview */}
        <motion.button
          onClick={handleToggleComments}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          View all {post.comments.length} comments
        </motion.button>
      </div>

      {/* Comments Section (Expandable) */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gray-200 dark:border-gray-800"
          >
            {/* Comments List */}
            <div className="max-h-64 overflow-y-auto p-4 space-y-3">
              {post.comments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                  No comments yet
                </p>
              ) : (
                post.comments.map((comment) => (
                  <motion.div 
                    key={comment._id} 
                    className="flex items-start space-x-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={comment.user.profileImg || "/avatar-placeholder.png"} 
                        className="w-full h-full object-cover"
                        alt={comment.user.username}
                      />
                    </div>
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800 dark:text-gray-200 text-xs">
                          {comment.user.username}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">•</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">1d</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-xs mt-1">
                        {comment.text}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="p-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 dark:text-blue-400 font-medium text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={isCommenting || !comment.trim()}
                >
                  {isCommenting ? <LoadingSpinner size="sm" /> : "Post"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Post;
