import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // Helper to include JWT token in headers
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch(`${backend_url}/api/user/suggested`, {
          headers: getHeaders(),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong!");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow, isPending } = useFollow();

  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;

  return (
    <div className="hidden lg:block my-4 mx-2 min-w-[300px]">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg sticky top-2 border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Who to follow
        </h2>
        <div className="space-y-3">
          {isLoading ? (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          ) : (
            suggestedUsers.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-out hover:scale-[1.02]"
                key={user._id}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-400 transition-colors">
                    <img
                      src={user.profileImg || "/avatar-placeholder.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white truncate max-w-[120px]">
                      {user.fullName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    follow(user._id);
                  }}
                  className="px-4 py-1.5 text-sm font-medium bg-gray-900 dark:bg-gray-100 text-gray-100 dark:text-gray-900 rounded-full 
                           hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 transform 
                           hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPending}
                >
                  {isPending ? <LoadingSpinner size="sm" /> : <span className="flex items-center gap-1">Follow</span>}
                </button>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
