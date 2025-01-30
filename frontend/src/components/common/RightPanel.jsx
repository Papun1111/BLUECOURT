import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";

const RightPanel = () => {
    const isLoading = false;

    return (
        <div className='hidden lg:block my-4 mx-2'>
            <div className='bg-[#16181C] p-4 rounded-md sticky top-2 transition-all duration-300 ease-in-out'>
                <p className='font-bold text-white'>Who to follow</p>
                <div className='flex flex-col gap-4'>
                    {/* Loading Skeleton */}
                    {isLoading && (
                        <>
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                        </>
                    )}
                    {/* User list */}
                    {!isLoading &&
                        USERS_FOR_RIGHT_PANEL?.map((user) => (
                            <Link
                                to={`/profile/${user.username}`}
                                className='flex items-center justify-between gap-4 p-2 hover:bg-blue-800 rounded-md transition-all duration-300'
                                key={user._id}
                            >
                                <div className='flex gap-2 items-center'>
                                    <div className='avatar'>
                                        <div className='w-8 h-8 rounded-full'>
                                            <img src={user.profileImg || "/avatar-placeholder.png"} alt="User" />
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold tracking-tight truncate w-28 text-blue-200'>
                                            {user.fullName}
                                        </span>
                                        <span className='text-sm text-blue-300'>@{user.username}</span>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className='bg-blue-500 text-white hover:bg-blue-600 rounded-full btn-sm px-4 py-1 transition-colors duration-300 ease-in-out'
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Follow
                                    </button>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
};
export default RightPanel;
