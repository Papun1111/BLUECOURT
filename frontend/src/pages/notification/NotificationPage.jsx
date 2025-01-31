import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart } from "react-icons/fa";
import { useState } from "react";

const NotificationPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const notifications = [
        {
            _id: "1",
            from: {
                _id: "1",
                username: "johndoe",
                profileImg: "/avatars/boy2.png",
            },
            type: "follow",
        },
        {
            _id: "2",
            from: {
                _id: "2",
                username: "janedoe",
                profileImg: "/avatars/girl1.png",
            },
            type: "like",
        },
    ];

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const deleteNotifications = () => {
        alert("All notifications deleted");
    };

    return (
        <>
            <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100'>
                <div className='flex justify-between items-center p-4 border-b border-gray-700 bg-gradient-to-r from-blue-500 to-purple-500 text-white'>
                    <h1 className='font-bold'>Notifications</h1>
                    <div className='relative'>
                        <button onClick={toggleDropdown} className='focus:outline-none'>
                            <IoSettingsOutline className='w-6 h-6 cursor-pointer' />
                        </button>
                        {dropdownOpen && (
                            <ul className='absolute right-0 w-52 mt-2 bg-white rounded shadow-lg z-10'>
                                <li className='cursor-pointer p-2 hover:bg-gray-100' style={{color:"red",backgroundColor:"grey"}} onClick={deleteNotifications}>
                                    Delete all notifications
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
                {isLoading ? (
                    <div className='flex justify-center items-center h-full'>
                        <LoadingSpinner size='lg' />
                    </div>
                ) : (
                    notifications.length === 0 ? (
                        <div className='text-center p-4 font-bold'>No notifications 🤔</div>
                    ) : (
                        notifications.map((notification) => (
                            <div className='border-b border-gray-300 p-4 hover:bg-gray-50 transition duration-300' key={notification._id}>
                                <div className='flex gap-4 items-center'>
                                    {notification.type === "follow" ? (
                                        <FaUser className='w-7 h-7 text-blue-500' />
                                    ) : (
                                        <FaHeart className='w-7 h-7 text-red-500' />
                                    )}
                                    <Link to={`/profile/${notification.from.username}`} className='flex items-center gap-2'>
                                        <div className='w-10 h-10 rounded-full overflow-hidden'>
                                            <img src={notification.from.profileImg || "/avatar-placeholder.png"} alt={`${notification.from.username}'s profile`} className='w-full h-full object-cover' />
                                        </div>
                                        <span>
                                            <strong className='text-gray-800'>{notification.from.username}</strong>
                                            {notification.type === "follow" ? " followed you" : " liked your post"}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </>
    );
};
export default NotificationPage;
