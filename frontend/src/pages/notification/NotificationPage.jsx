import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// Icons
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart } from "react-icons/fa6";

// Framer Motion
import { motion } from "framer-motion";
import backend_url from "../../config";

const NotificationPage = () => {
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Fetch notifications
  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch(`${backend_url}/api/notification/get`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch notifications");
      }
      return res.json();
    },
    retry: 2,
    onError: (err) => {
      setError(err.message);
      toast.error("Failed to load notifications");
    },
  });

  // Delete all notifications
  const { mutate: deleteNotifications, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notification/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete notifications");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Notifications cleared");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to clear notifications");
    },
  });

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      deleteNotifications();
    }
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Handle error state
  if (isError) {
    return (
      <motion.div
        className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <p className="text-xl font-semibold mb-2 text-red-500">Something went wrong</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["notifications"] })}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sticky Header */}
      <motion.div
        className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 p-4"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl">Notifications</h1>
          {/* Settings menu if there are notifications */}
          {notifications?.length > 0 && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="m-1 hover:text-gray-500 dark:hover:text-gray-200 transition-colors"
              >
                <IoSettingsOutline className="w-5 h-5" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-gray-100 dark:bg-gray-800 rounded-box w-52 border border-gray-200 dark:border-gray-700"
              >
                <li>
                  <button
                    onClick={handleDeleteAll}
                    disabled={isDeleting}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 transition-colors px-2 py-1 rounded disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete all notifications"}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          {/* Simple spinner */}
          <motion.div
            className="rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 animate-spin"
            variants={itemVariants}
          />
        </div>
      ) : notifications?.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400"
          variants={itemVariants}
        >
          <p className="text-xl font-medium mb-2">No notifications yet 🧐</p>
          <p className="text-sm">We'll notify you when something happens!</p>
        </motion.div>
      ) : (
        // Animate the list container
        <motion.div
          className="divide-y divide-gray-200 dark:divide-gray-700"
          variants={containerVariants}
        >
          {notifications?.map((notification) => (
            // Animate each item
            <motion.div
              key={notification._id}
              className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              variants={itemVariants}
            >
              <Link to={`/profile/${notification.from.username}`} className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {notification.type === "follow" ? (
                    <FaUser className="w-6 h-6 text-blue-500" />
                  ) : (
                    <FaHeart className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full ring-2 ring-gray-300 dark:ring-gray-600 overflow-hidden">
                    <img
                      src={notification.from.profileImg || "/avatar-placeholder.png"}
                      alt={`${notification.from.username}'s profile`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.src = "/avatar-placeholder.png";
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                      @{notification.from.username}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {notification.type === "follow"
                        ? "started following you"
                        : "liked your post"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default NotificationPage;
