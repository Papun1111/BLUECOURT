import { FaRegComment, FaRegHeart, FaRegBookmark, FaTrash } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = authUser._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  // Mutation logic remains unchanged
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
    onSuccess: (newComment) => {
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

  return (
    <div className="max-w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${postOwner.username}`} className="block">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-700">
              <img 
                src={postOwner.profileImg || "/avatar-placeholder.png"} 
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <div className="flex flex-col">
            <Link to={`/profile/${postOwner.username}`} className="font-semibold text-gray-200 text-sm hover:text-gray-300">
              {postOwner.username}
            </Link>
            <span className="text-gray-400 text-xs">{formattedDate}</span>
          </div>
        </div>
        {isMyPost && (
          <button className="text-gray-400 hover:text-red-500 transition-colors duration-200">
            {isDeleting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <FaTrash className="w-4 h-4" onClick={deletePost} />
            )}
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="px-4 py-3 bg-gray-900">
        <p className="text-gray-200 text-sm mb-3">{post.text}</p>
        {post.img && (
          <div className="relative aspect-square">
            <img
              src={post.img}
              className="w-full h-full object-cover"
              alt="post content"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <button 
              onClick={likePost}
              className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
            >
              {isLiking ? (
                <LoadingSpinner size="sm" />
              ) : (
                <FaRegHeart className={`w-6 h-6 ${isLiked ? "text-pink-500" : ""}`} />
              )}
            </button>
            
            {/* Comment Button */}
            <button 
              onClick={() => document.getElementById(`comments_modal${post._id}`).showModal()}
              className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
            >
              <FaRegComment className="w-6 h-6" />
            </button>
            
            {/* Repost Button */}
            <button className="text-gray-400 hover:text-green-500 transition-colors duration-200">
              <BiRepost className="w-7 h-7" />
            </button>
          </div>
          
          {/* Bookmark Button */}
          <button className="text-gray-400 hover:text-gray-200 transition-colors duration-200">
            <FaRegBookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes Count */}
        <div className="text-gray-200 text-sm font-semibold mb-1">
          {post.likes.length} likes
        </div>

        {/* Comments Preview */}
        <div className="text-sm text-gray-400">
          View all {post.comments.length} comments
        </div>
      </div>

      {/* Comments Modal */}
      <dialog id={`comments_modal${post._id}`} className="modal">
        <div className="modal-box bg-gray-900 border border-gray-800 p-0 max-w-lg">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-semibold text-gray-200">Comments</h3>
          </div>
          
          {/* Comments List */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {post.comments.length === 0 ? (
              <p className="text-gray-400 text-center">No comments yet</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img 
                      src={comment.user.profileImg || "/avatar-placeholder.png"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-200 text-sm">{comment.user.username}</span>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-gray-400 text-xs">1d</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Comment Form */}
          <form onSubmit={handlePostComment} className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-gray-600"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button 
                type="submit"
                className="text-blue-500 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCommenting || !comment.trim()}
              >
                {isCommenting ? <LoadingSpinner size="sm" /> : "Post"}
              </button>
            </div>
          </form>
        </div>
        
        <form method="dialog" className="modal-backdrop bg-black/60">
          <button className="cursor-default outline-none">close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Post;