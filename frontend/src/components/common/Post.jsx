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

  // Delete post mutation
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete post");
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["posts"], (oldPosts) => 
        oldPosts.filter(p => p._id !== post._id)
      );
      toast.success("Post deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  // Like post mutation
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/like/${post._id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to like post");
      return data;
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldPosts) => 
        oldPosts.map(p => 
          p._id === post._id ? { ...p, likes: updatedLikes } : p
        )
      );
    },
    onError: (error) => toast.error(error.message),
  });

  // Comment post mutation
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
      queryClient.setQueryData(["posts"], (oldPosts) => 
        oldPosts.map(p => 
          p._id === post._id ? { ...p, comments: [...p.comments, newComment] } : p
        )
      );
      setComment("");
      toast.success("Comment posted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Avatar section */}
      <div className="avatar">
        <Link to={`/profile/${postOwner.username}`} className="w-8 rounded-full overflow-hidden">
          <img src={postOwner.profileImg || "/avatar-placeholder.png"} alt="profile" />
        </Link>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Post header */}
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${postOwner.username}`} className="font-bold text-white hover:text-blue-200 transition-colors duration-300">
            {postOwner.fullName}
          </Link>
          <span className="text-gray-300 text-sm">
            @{postOwner.username} · {formattedDate}
          </span>
          {isMyPost && (
            <div className="flex-1 flex justify-end">
              {isDeleting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <FaTrash 
                  className="cursor-pointer text-white hover:text-red-500 transition-colors duration-300" 
                  onClick={deletePost} 
                />
              )}
            </div>
          )}
        </div>

        {/* Post body */}
        <div className="flex flex-col gap-3 my-2">
          <p className="text-white">{post.text}</p>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-700"
              alt="post content"
            />
          )}
        </div>

        {/* Post actions */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            {/* Comments */}
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() => document.getElementById(`comments_modal${post._id}`).showModal()}
            >
              <FaRegComment className="w-4 h-4 text-white group-hover:text-blue-200" />
              <span className="text-sm text-white group-hover:text-blue-200">
                {post.comments.length}
              </span>
            </div>

            {/* Reposts */}
            <div className="flex gap-1 items-center group cursor-pointer">
              <BiRepost className="w-6 h-6 text-white group-hover:text-green-500" />
              <span className="text-sm text-white group-hover:text-green-500">0</span>
            </div>

            {/* Likes */}
            <div 
              className="flex gap-1 items-center group cursor-pointer"
              onClick={likePost}
            >
              {isLiking ? (
                <LoadingSpinner size="sm" />
              ) : (
                <FaRegHeart className={`w-4 h-4 ${isLiked ? "text-pink-500" : "text-white"}`} />
              )}
              <span className={`text-sm ${isLiked ? "text-pink-500" : "text-white"}`}>
                {post.likes.length}
              </span>
            </div>
          </div>

          {/* Bookmarks */}
          <div className="flex justify-end gap-2 items-center w-1/3">
            <FaRegBookmark className="w-4 h-4 text-white cursor-pointer hover:text-blue-200" />
          </div>
        </div>

        {/* Comments Modal */}
        <dialog id={`comments_modal${post._id}`} className="modal border-none outline-none">
          <div className="modal-box rounded border border-gray-600 bg-gradient-to-r from-blue-500 to-blue-700">
            <h3 className="font-bold text-lg mb-4 text-white">COMMENTS</h3>
            
            {/* Comments List */}
            <div className="flex flex-col gap-3 max-h-60 overflow-auto">
              {post.comments.length === 0 ? (
                <p className="text-sm text-gray-300">No comments yet 🤔 Be the first one 😉</p>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-2 items-start">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img src={comment.user.profileImg || "/avatar-placeholder.png"} />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white">{comment.user.fullName}</span>
                        <span className="text-gray-300 text-sm">@{comment.user.username}</span>
                      </div>
                      <div className="text-sm text-white">{comment.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="mt-4 pt-2 border-t border-gray-600">
              <textarea
                className="textarea w-full p-1 rounded text-md resize-none border bg-white text-black"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button 
                type="submit"
                className="btn btn-primary rounded-full btn-sm text-white px-4 bg-blue-600 hover:bg-blue-700 mt-2"
                disabled={isCommenting}
              >
                {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
              </button>
            </form>
          </div>
          
          {/* Modal close button */}
          <form method="dialog" className="modal-backdrop">
            <button className="outline-none">close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default Post;