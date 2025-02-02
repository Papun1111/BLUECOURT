import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useState } from "react";

const NotificationPage = () => {
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();

    const { data: notifications, isLoading, isError } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await fetch("/api/notification/get", {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Important for authentication
            });
            
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to fetch notifications");
            }
            
            return res.json();
        },
        retry: 2,
        onError: (err) => {
            setError(err.message);
            toast.error("Failed to load notifications");
        }
    });

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
                const error = await res.json();
                throw new Error(error.message || "Failed to delete notifications");
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

    if (isError) {
        return (
            <div className="flex-[4_4_0] min-h-screen bg-gradient-to-br from-gray-900 to-black">
                <div className="flex justify-center items-center h-full p-8">
                    <div className="text-red-400 text-center">
                        <p className="text-xl font-semibold mb-2">Something went wrong</p>
                        <p className="text-sm">{error}</p>
                        <button 
                            onClick={() => queryClient.invalidateQueries({ queryKey: ["notifications"] })}
                            className="mt-4 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-[4_4_0] min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-900/80">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <p className="font-bold text-xl text-white">Notifications</p>
                    {notifications?.length > 0 && (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="m-1 hover:text-gray-300 transition-colors">
                                <IoSettingsOutline className="w-5 h-5 text-white" />
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-52 border border-gray-700"
                            >
                                <li>
                                    <button 
                                        onClick={handleDeleteAll}
                                        disabled={isDeleting}
                                        className="text-white hover:bg-gray-700 active:bg-gray-600 disabled:opacity-50"
                                    >
                                        {isDeleting ? "Deleting..." : "Delete all notifications"}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : notifications?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <p className="text-xl font-medium mb-2">No notifications yet 🧐</p>
                    <p className="text-sm">We'll notify you when something happens!</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-800">
                    {notifications?.map((notification) => (
                        <div 
                            key={notification._id}
                            className="p-4 hover:bg-gray-800/50 transition-colors duration-200"
                        >
                            <Link 
                                to={`/profile/${notification.from.username}`}
                                className="flex items-start gap-3"
                            >
                                <div className="flex-shrink-0">
                                    {notification.type === "follow" ? (
                                        <FaUser className="w-6 h-6 text-blue-500" />
                                    ) : (
                                        <FaHeart className="w-6 h-6 text-red-500" />
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div className="w-10 rounded-full ring-2 ring-gray-600">
                                            <img 
                                                src={notification.from.profileImg || "/avatar-placeholder.png"} 
                                                alt={`${notification.from.username}'s profile`}
                                                className="bg-gray-800 object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/avatar-placeholder.png";
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-white hover:text-blue-500 transition-colors">
                                            @{notification.from.username}
                                        </span>
                                        <span className="text-gray-400">
                                            {notification.type === "follow" 
                                                ? "started following you" 
                                                : "liked your post"}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationPage;