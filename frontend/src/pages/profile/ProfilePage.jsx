import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaLink } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { POSTS } from "../../utils/db/dummy";
import { formatMemberSinceDate } from "../../utils/date";
import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { username } = useParams();
  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/user/profile/${username}`);
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

  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

  const isMyProfile = authUser._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = authUser?.following.includes(user?._id);

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

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <div className="flex-[4_4_0] border-r border-gray-800 min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
      {!isLoading && !isRefetching && !user && (
        <p className="text-center text-lg mt-4 text-gray-300">User not found</p>
      )}
      <div className="flex flex-col">
        {!isLoading && !isRefetching && user && (
          <>
            <div className="flex gap-10 px-4 py-2 items-center bg-gray-900 bg-opacity-60">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex flex-col">
                <p className="font-bold text-lg text-white">{user?.fullName}</p>
                <span className="text-sm text-gray-400">{POSTS?.length} posts</span>
              </div>
            </div>

            <div className="relative group/cover">
              <img
                src={coverImg || user?.coverImg || "/cover.png"}
                className="h-52 w-full object-cover brightness-90"
                alt="cover image"
              />
              {isMyProfile && (
                <div
                  className="absolute top-2 right-2 rounded-full p-2 bg-black bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200 hover:bg-opacity-90"
                  onClick={() => coverImgRef.current.click()}
                >
                  <MdEdit className="w-5 h-5 text-white" />
                </div>
              )}

              <input
                type="file"
                hidden
                accept="image/*"
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type="file"
                hidden
                accept="image/*"
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />

              <div className="avatar absolute -bottom-16 left-4">
                <div className="w-32 rounded-full relative group/avatar ring-4 ring-gray-900">
                  <img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
                  {isMyProfile && (
                    <div className="absolute top-5 right-3 p-1 bg-gray-800 rounded-full opacity-0 group-hover/avatar:opacity-100 cursor-pointer hover:bg-gray-700 transition-all">
                      <MdEdit
                        className="w-4 h-4 text-white"
                        onClick={() => profileImgRef.current.click()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end px-4 mt-5">
              {isMyProfile && <EditProfileModal authUser={authUser} />}
              {!isMyProfile && (
                <button
                  className="px-6 py-2 rounded-full text-sm font-medium border border-gray-600 hover:bg-gray-800 transition-colors text-white"
                  onClick={() => follow(user?._id)}
                >
                  {isPending ? "Loading..." : amIFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
              {(coverImg || profileImg) && (
                <button
                  className="px-6 py-2 rounded-full text-sm font-medium bg-gray-800 text-white ml-2 hover:bg-gray-700 transition-colors"
                  onClick={async () => {
                    await updateProfile({ coverImg, profileImg });
                    setProfileImg(null);
                    setCoverImg(null);
                  }}
                >
                  {isUpdatingProfile ? "Updating..." : "Update"}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-14 px-4 text-gray-200">
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white">{user?.fullName}</span>
                <span className="text-sm text-gray-400">@{user?.username}</span>
                <span className="text-sm my-1">{user?.bio}</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {user?.link && (
                  <div className="flex gap-1 items-center">
                    <FaLink className="w-3 h-3 text-gray-400" />
                    <a
                      href={user?.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                      {user?.link}
                    </a>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <IoCalendarOutline className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{memberSinceDate}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-white">{user?.following.length}</span>
                  <span className="text-gray-400 text-sm">Following</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-white">{user?.followers.length}</span>
                  <span className="text-gray-400 text-sm">Followers</span>
                </div>
              </div>
            </div>

            <div className="flex w-full border-b border-gray-800 mt-4">
              <div
                className={`flex justify-center flex-1 p-3 cursor-pointer transition-colors ${
                  feedType === "posts"
                    ? "text-white border-b-2 border-gray-200"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setFeedType("posts")}
              >
                Posts
              </div>
              <div
                className={`flex justify-center flex-1 p-3 cursor-pointer transition-colors ${
                  feedType === "likes"
                    ? "text-white border-b-2 border-gray-200"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setFeedType("likes")}
              >
                Likes
              </div>
            </div>
          </>
        )}
        <Posts feedType={feedType} username={username} userId={user?._id} />
      </div>
    </div>
  );
};

export default ProfilePage;