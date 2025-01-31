import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft, FaLink } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const isLoading = false;
  const isMyProfile = true;

  const user = {
    _id: "1",
    fullName: "John Doe",
    username: "johndoe",
    profileImg: "/avatars/boy2.png",
    coverImg: "/cover.png",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    link: "https://papun.onrender.com/",
    following: ["1", "2", "3"],
    followers: ["1", "2", "3"],
  };

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
        {isLoading ? (
          <ProfileHeaderSkeleton />
        ) : !user ? (
          <p className="text-center text-lg mt-4">User not found</p>
        ) : (
          <>
            <div className="flex gap-10 px-4 py-2 items-center text-blue-500">
              <Link to="/">
                <FaArrowLeft className="w-4 h-4 hover:text-blue-600" />
              </Link>
              <div className="flex flex-col">
                <p className="font-bold text-lg">{user.fullName}</p>
                <span className="text-sm">{POSTS?.length} posts</span>
              </div>
            </div>
            <div className="relative">
              <img
                src={coverImg || user.coverImg || "/cover.png"}
                className="h-52 w-full object-cover"
                alt="Cover"
              />
              {isMyProfile && (
                <button
                  className="absolute top-2 right-2 rounded-full p-2 bg-blue-500 bg-opacity-75 cursor-pointer hover:bg-blue-600 transition duration-200"
                  onClick={() => coverImgRef.current.click()}
                >
                  <MdEdit className="w-5 h-5 text-white" />
                </button>
              )}
              <input
                type="file"
                hidden
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type="file"
                hidden
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />
              <div className="absolute -bottom-12 left-4 rounded-full overflow-hidden border-4 border-white">
                <img
                  src={
                    profileImg || user.profileImg || "/avatar-placeholder.png"
                  }
                  className="w-32 h-32 rounded-full"
                  alt="Profile"
                />
                {isMyProfile && (
                  <button
                    className="absolute bottom-1 right-1 bg-blue-500 p-1 rounded-full cursor-pointer hover:bg-blue-600"
                    onClick={() => profileImgRef.current.click()}
                  >
                    <MdEdit className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
            <div className="px-4 pt-20">
              {isMyProfile && <EditProfileModal />}
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold">{user.fullName}</div>
                <div>
                  {user.link && (
                    <a
                      href={user.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                    >
                      <FaLink className="w-3 h-3" />
                      <span>
                        {new URL(user.link).hostname.replace("www.", "")}
                      </span>
                    </a>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <IoCalendarOutline className="w-4 h-4" />
                    <span>Joined July 2021</span>
                  </div>
                </div>
              </div>
            </div>
            <Posts />
          </>
        )}
      </div>
    </>
  );
};
export default ProfilePage;
