import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
    const [feedType, setFeedType] = useState("forYou");

    return (
        <div className='flex-1 min-w-0 border-r border-gray-200 dark:border-gray-700'>
            {/* Header */}
            <div className='sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md'>
                <div className='flex w-full border-b border-gray-200 dark:border-gray-700'>
                    <button
                        className={`flex-1 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 relative 
                            ${feedType === "forYou" 
                                ? "text-blue-500 dark:text-blue-400 font-semibold" 
                                : "text-gray-600 dark:text-gray-400"}`}
                        onClick={() => setFeedType("forYou")}
                    >
                        For you
                        {feedType === "forYou" && (
                            <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-blue-500 dark:bg-blue-400'></div>
                        )}
                    </button>
                    <button
                        className={`flex-1 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 relative 
                            ${feedType === "following" 
                                ? "text-blue-500 dark:text-blue-400 font-semibold" 
                                : "text-gray-600 dark:text-gray-400"}`}
                        onClick={() => setFeedType("following")}
                    >
                        Following
                        {feedType === "following" && (
                            <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-blue-500 dark:bg-blue-400'></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="pb-4">
                {/* CREATE POST INPUT */}
                <CreatePost />

                {/* POSTS */}
                <div className="px-4">
                    <Posts feedType={feedType} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;