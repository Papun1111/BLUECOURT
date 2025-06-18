import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

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
        return `${backend_url}/api/posts/all`;
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts", feedType, username, userId],
    queryFn: async () => {
      const res = await fetch(POST_ENDPOINT, {
        headers: getHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      scale: 0.95,
      filter: "blur(8px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
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
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const loadingVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  const skeletonVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const emptyStateVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  const postsListVariants = {
    hidden: { 
      opacity: 0
    },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  };

  const postItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      filter: "blur(2px)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full px-3 py-6 relative"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/10 to-purple-50/10 dark:from-transparent dark:via-blue-900/5 dark:to-purple-900/5 pointer-events-none rounded-3xl" />
      
      <AnimatePresence mode="wait">
        {(isLoading || isRefetching) && (
          <motion.div
            key="loading"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-8 py-6 relative z-10"
          >
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                variants={skeletonVariants}
                className="transform-gpu"
              >
                <PostSkeleton />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && !isRefetching && posts?.length === 0 && (
          <motion.div
            key="no-posts"
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-center py-16 relative z-10"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl mb-6 opacity-60"
            >
              👻
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center"
            >
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-base max-w-sm">
                Nothing to see here yet. Try switching tabs or following more people!
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full border border-gray-200/50 dark:border-gray-700/30"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Switch tabs to explore more content
              </span>
            </motion.div>
          </motion.div>
        )}

        {!isLoading && !isRefetching && posts && posts.length > 0 && (
          <motion.div
            key="posts-list"
            variants={postsListVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6 relative z-10"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                variants={postItemVariants}
                custom={index}
                layout
                layoutId={post._id}
                className="transform-gpu"
                whileInView={{ 
                  scale: [0.98, 1],
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Post post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating scroll indicator */}
      {!isLoading && !isRefetching && posts && posts.length > 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/30 flex items-center justify-center"
          >
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-60" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Posts;