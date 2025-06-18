import { FaRegComment, FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaTrash } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
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
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      filter: "blur(5px)",
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1, rotateZ: 0 },
    hover: { 
      scale: 1.1, 
      rotateZ: 2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeInOut"
      }
    }
  };

  const heartVariants = {
    liked: {
      scale: [1, 1.3, 1],
      rotateZ: [0, -10, 10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    unliked: {
      scale: 1,
      rotateZ: 0
    }
  };

  const commentsSectionVariants = {
    hidden: { 
      height: 0, 
      opacity: 0,
      y: -20
    },
    visible: { 
      height: "auto", 
      opacity: 1,
      y: 0,
      transition: {
        height: {
          duration: 0.4,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.3,
          delay: 0.1
        },
        y: {
          duration: 0.3,
          delay: 0.1
        }
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      y: -20,
      transition: {
        height: {
          duration: 0.3,
          delay: 0.1
        },
        opacity: {
          duration: 0.2
        },
        y: {
          duration: 0.2
        }
      }
    }
  };

  const commentVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  // Helper to build headers with token
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Delete post mutation
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${backend_url}/api/posts/${post._id}`, {
        method: "DELETE",
        headers: getHeaders(),
        credentials: "include",
      });
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

  // Like/unlike post mutation
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${backend_url}/api/posts/like/${post._id}`, {
        method: "POST",
        headers: getHeaders(),
        credentials: "include",
      });
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

  // Comment post mutation
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      if (!comment.trim()) throw new Error("Comment cannot be empty");
      const res = await fetch(`${backend_url}/api/posts/comment/${post._id}`, {
        method: "POST",
        headers: getHeaders(),
        credentials: "include",
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

  const handleToggleComments = () => setShowComments(!showComments);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ 
        y: -4,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="w-full bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 mb-6 relative group"
    >
      {/* Gradient overlay for dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/5 dark:to-blue-500/10 pointer-events-none" />
      
      {/* Post Header */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 relative z-10"
      >
        <Link to={`/profile/${postOwner.username}`} className="flex items-center space-x-3 group/profile">
          <motion.div
            whileHover={{ scale: 1.1, rotateZ: 5 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-600 group-hover/profile:ring-blue-400 dark:group-hover/profile:ring-blue-500 transition-all duration-300 relative">
              <img 
                src={postOwner.profileImg || "/avatar-placeholder.png"} 
                alt="profile" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 dark:to-white/5" />
            </div>
            {/* Online indicator */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
            />
          </motion.div>
          
          <div className="flex flex-col">
            <motion.span 
              whileHover={{ x: 2 }}
              className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover/profile:text-blue-600 dark:group-hover/profile:text-blue-400 transition-all duration-300"
            >
              {postOwner.username}
            </motion.span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">{formattedDate}</span>
          </div>
        </Link>
        
        {isMyPost && (
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => {
              if (confirm("Are you sure you want to delete this post?")) {
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
      </motion.div>

      {/* Post Content */}
      <motion.div variants={itemVariants} className="px-6 py-4 relative z-10">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-800 dark:text-gray-200 text-sm mb-4 leading-relaxed"
        >
          {post.text}
        </motion.p>
        
        {post.img && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-xl overflow-hidden mb-3 max-w-md mx-auto shadow-lg group/image"
          >
            <img 
              src={post.img} 
              className="w-full h-auto object-cover transition-transform duration-500 group-hover/image:scale-105" 
              alt="post content" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
          </motion.div>
        )}
      </motion.div>

      {/* Post Actions */}
      <motion.div 
        variants={itemVariants}
        className="px-6 py-3 border-t border-gray-200/50 dark:border-gray-700/50 relative z-10"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <motion.button
              onClick={likePost}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-200 relative"
            >
              {isLiking ? (
                <LoadingSpinner size="sm" />
              ) : (
                <motion.div
                  variants={heartVariants}
                  animate={isLiked ? "liked" : "unliked"}
                >
                  {isLiked ? (
                    <FaHeart className="w-5 h-5 text-pink-500 drop-shadow-sm" />
                  ) : (
                    <FaRegHeart className="w-5 h-5" />
                  )}
                </motion.div>
              )}
            </motion.button>

            {/* Comment Button */}
            <motion.button
              onClick={handleToggleComments}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <FaRegComment className="w-5 h-5" />
            </motion.button>

            {/* Repost Button */}
            <motion.button 
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
            >
              <BiRepost className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Bookmark Button */}
          <motion.button
            onClick={() => setIsBookmarked(!isBookmarked)}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200"
          >
            <motion.div
              animate={isBookmarked ? { scale: [1, 1.2, 1], rotateZ: [0, 10, 0] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isBookmarked ? (
                <FaBookmark className="w-5 h-5 text-yellow-500" />
              ) : (
                <FaRegBookmark className="w-5 h-5" />
              )}
            </motion.div>
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-1"
        >
          <div className="text-gray-900 dark:text-gray-100 text-sm font-medium">
            {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
          </div>
          <motion.button 
            onClick={handleToggleComments} 
            whileHover={{ x: 2 }}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
          >
            {post.comments.length > 0 ? `View all ${post.comments.length} comments` : 'Be the first to comment'}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            variants={commentsSectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <div className="max-h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {post.comments.length === 0 ? (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 dark:text-gray-400 text-center text-sm py-4"
                >
                  No comments yet. Start the conversation! 💬
                </motion.p>
              ) : (
                post.comments.map((commentItem, index) => (
                  <motion.div 
                    key={commentItem._id} 
                    variants={commentVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="flex items-start space-x-3 group/comment"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover/comment:ring-blue-400/50 dark:group-hover/comment:ring-blue-500/50 transition-all duration-300"
                    >
                      <img 
                        src={commentItem.user.profileImg || "/avatar-placeholder.png"} 
                        className="w-full h-full object-cover" 
                        alt={commentItem.user.username} 
                      />
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ x: 2 }}
                      className="flex-1 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-200/30 dark:border-gray-600/30"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {commentItem.user.username}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">1d</span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                        {commentItem.text}
                      </p>
                    </motion.div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <motion.form 
              onSubmit={handlePostComment} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 border-t border-gray-200/30 dark:border-gray-600/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={authUser?.profileImg || "/avatar-placeholder.png"} 
                    className="w-full h-full object-cover" 
                    alt="Your avatar" 
                  />
                </div>
                
                <motion.input
                  type="text"
                  whileFocus={{ scale: 1.02 }}
                  className="flex-1 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-full px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white font-medium text-sm px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:hover:scale-100"
                  disabled={isCommenting || !comment.trim()}
                >
                  {isCommenting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    "Post"
                  )}
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Post;