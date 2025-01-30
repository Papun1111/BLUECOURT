import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
    const [feedType, setFeedType] = useState("forYou");

    return (
        <>
            <div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
                {/* Header */}
                <div className='flex w-full border-b border-gray-700'>
                    <div
                        className={`flex justify-center flex-1 p-3 hover:bg-blue-200 transition duration-300 cursor-pointer relative ${
                            feedType === "forYou" ? "bg-blue-100" : ""
                        }`}
                        onClick={() => setFeedType("forYou")}
                    >
                        For you
                        {feedType === "forYou" && (
                            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-blue-500 animate-pulse'></div>
                        )}
                    </div>
                    <div
                        className={`flex justify-center flex-1 p-3 hover:bg-blue-200 transition duration-300 cursor-pointer relative ${
                            feedType === "following" ? "bg-blue-100" : ""
                        }`}
                        onClick={() => setFeedType("following")}
                    >
                        Following
                        {feedType === "following" && (
                            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-blue-500 animate-pulse'></div>
                        )}
                    </div>
                </div>

                {/* CREATE POST INPUT */}
                <CreatePost />

                {/* POSTS */}
                <Posts />
            </div>
        </>
    );
};

export default HomePage;
