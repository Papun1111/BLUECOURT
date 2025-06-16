import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


const Posts = ({ feedType, username, userId }) => {
   const backend_url = import.meta.env.VITE_BACKEND_URL;
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return `${backend_url}/api/posts/all`;
      case "following":
        return `${backend_url}/api/posts/following`;
      case "posts":
        return `${backend_url}/api/posts/user/${username}`;
      case "likes":
        return `${backend_url}/api/posts/likes/${userId}`;
      default:
        return `${backend_url}}/api/posts/all`;
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full px-2 py-4"  // Full width container with minimal horizontal padding
    >
      <AnimatePresence>
        {(isLoading || isRefetching) && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6 py-4"
          >
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </motion.div>
        )}

        {!isLoading && !isRefetching && posts?.length === 0 && (
          <motion.p
            key="no-posts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 text-lg py-8 border-t border-gray-200"
          >
            No posts in this tab. Switch 👻
          </motion.p>
        )}

        {!isLoading && !isRefetching && posts && (
          <motion.div
            key="posts-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="divide-y divide-gray-200"
          >
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Posts;
