import { FaRegComment, FaRegHeart, FaRegBookmark, FaTrash } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
    const [comment, setComment] = useState("");
    const postOwner = post.user;
    const [isLiked, setIsLiked] = useState(false);

    const isMyPost = true; // Adjust according to your logic
    const formattedDate = "1h"; // You might want to dynamically calculate this

    const handleDeletePost = () => {
        // Implement your deletion logic
    };

    const handlePostComment = (e) => {
        e.preventDefault();
        // Implement comment submission logic
    };

    const handleLikePost = () => {
        setIsLiked(!isLiked);
    };

    return (
        <>
            <div className='flex flex-col gap-4 p-4 border-b border-gray-700 bg-gradient-to-r from-blue-200 to-blue-100 transition duration-500 hover:from-blue-300 hover:to-blue-200'>
                <div className='flex items-center gap-2'>
                    <Link to={`/profile/${postOwner.username}`} className='w-6 h-6 rounded-full overflow-hidden'>
                        <img src={postOwner.profileImg || "/avatar-placeholder.png"} alt={`${postOwner.username}'s avatar`} className='w-full h-full object-cover' />
                    </Link>
                    <div className='flex flex-col flex-grow'>
                        <Link to={`/profile/${postOwner.username}`} className='font-bold text-blue-500 hover:text-blue-600 transition-colors duration-300'>
                            {postOwner.fullName}
                        </Link>
                        <span className='text-gray-500 text-sm'>
                            <Link to={`/profile/${postOwner.username}`} className='text-blue-400 hover:text-blue-500 transition-colors duration-300'>@{postOwner.username}</Link>
                            <span>· {formattedDate}</span>
                        </span>
                    </div>
                    {isMyPost && (
                        <FaTrash className='cursor-pointer text-red-500 hover:text-red-600 transition-colors duration-300' onClick={handleDeletePost} />
                    )}
                </div>
                <div className='flex flex-col gap-3 overflow-hidden'>
                    <span>{post.text}</span>
                    {post.img && (
                        <img
                            src={post.img}
                            className='max-h-80 w-full object-cover rounded-lg border border-gray-700'
                            alt="Post content"
                        />
                    )}
                </div>
                <div className='flex justify-between'>
                    <div className='flex gap-4 items-center'>
                        <div className='flex gap-1 items-center cursor-pointer' onClick={() => document.getElementById("comments_modal" + post._id).showModal()}>
                            <FaRegComment className='text-slate-500 hover:text-blue-400 transition-colors duration-300' />
                            <span className='text-sm text-slate-500 hover:text-blue-400 transition-colors duration-300'>{post.comments.length}</span>
                        </div>
                        <div className='flex gap-1 items-center cursor-pointer' onClick={handleLikePost}>
                            <FaRegHeart className={`text-slate-500 hover:text-pink-500 transition-colors duration-300 ${isLiked ? 'text-pink-500' : ''}`} />
                            <span className={`text-sm transition-colors duration-300 ${isLiked ? 'text-pink-500' : 'text-slate-500 hover:text-pink-500'}`}>
                                {post.likes.length}
                            </span>
                        </div>
                        <BiRepost className='text-slate-500 hover:text-green-500 transition-colors duration-300' />
                    </div>
                    <FaRegBookmark className='text-slate-500 hover:text-blue-400 transition-colors duration-300' />
                </div>
            </div>
        </>
    );
};
export default Post;
