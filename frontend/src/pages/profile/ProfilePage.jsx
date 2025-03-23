import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaLink } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
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
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const res = await fetch(`/api/user/profile/${username}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
  });

  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

  const isMyProfile = authUser?._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = authUser?.following?.includes(user?._id);

  // Load user data again whenever username changes
  useEffect(() => {
    refetch();
  }, [username, refetch]);

  // Handle selected image files
  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (state === "coverImg") setCoverImg(reader.result);
      if (state === "profileImg") setProfileImg(reader.result);
    };
    reader.readAsDataURL(file);
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

  // If error or user not found
  if (isError || (!isLoading && !isRefetching && !user)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300">
        <p className="text-center text-lg mt-4 text-red-500">
          {isError ? "Failed to load user profile." : "User not found."}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 border-r border-gray-200 dark:border-gray-800 
                 min-h-screen bg-gradient-to-b from-gray-100 to-white 
                 dark:from-gray-900 dark:to-black text-gray-900 
                 dark:text-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Skeleton while loading */}
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}

      {/* Once loaded, animate the rest of the profile */}
      {user && !isLoading && !isRefetching && (
        <AnimatePresence>
          <motion.div variants={itemVariants} key={user._id}>
            {/* Header Navigation */}
            <div className="flex gap-10 px-4 py-2 items-center bg-gray-200/60 dark:bg-gray-900/60">
              <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex flex-col">
                <p className="font-bold text-lg">{user.fullName}</p>
                {/* Example "x posts" if you track user post count; using dummy data here */}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {POSTS?.length} posts
                </span>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative group/cover">
              <motion.img
                variants={itemVariants}
                src={coverImg || user.coverImg || "/cover.png"}
                className="h-52 w-full object-cover brightness-90"
                alt="cover"
              />
              {isMyProfile && (
                <motion.div
                  variants={itemVariants}
                  className="absolute top-2 right-2 rounded-full p-2 bg-black bg-opacity-75 
                             cursor-pointer opacity-0 group-hover/cover:opacity-100 
                             transition duration-200 hover:bg-opacity-90"
                  onClick={() => coverImgRef.current?.click()}
                >
                  <MdEdit className="w-5 h-5 text-white" />
                </motion.div>
              )}

              {/* Hidden inputs for changing images */}
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

              {/* Profile Image */}
              <div className="avatar absolute -bottom-16 left-4">
                <div className="w-32 rounded-full relative group/avatar ring-4 ring-gray-200 dark:ring-gray-900">
                  <img
                    src={profileImg || user.profileImg || "/avatar-placeholder.png"}
                    alt={user.username}
                  />
                  {isMyProfile && (
                    <div
                      className="absolute top-5 right-3 p-1 bg-gray-800 rounded-full opacity-0 
                                 group-hover/avatar:opacity-100 cursor-pointer 
                                 hover:bg-gray-700 transition-all"
                      onClick={() => profileImgRef.current?.click()}
                    >
                      <MdEdit className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <motion.div
              className="flex justify-end px-4 mt-5"
              variants={itemVariants}
            >
              {isMyProfile && <EditProfileModal authUser={authUser} />}
              {!isMyProfile && (
                <button
                  className="px-6 py-2 rounded-full text-sm font-medium 
                             border border-gray-400 dark:border-gray-600 
                             hover:bg-gray-200 dark:hover:bg-gray-800 
                             transition-colors text-gray-700 dark:text-gray-300"
                  onClick={() => follow(user._id)}
                  disabled={isPending}
                >
                  {isPending
                    ? "Loading..."
                    : amIFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
              {(coverImg || profileImg) && (
                <button
                  className="px-6 py-2 rounded-full text-sm font-medium 
                             bg-gray-800 text-white ml-2 hover:bg-gray-700 
                             transition-colors"
                  onClick={async () => {
                    await updateProfile({ coverImg, profileImg });
                    setProfileImg(null);
                    setCoverImg(null);
                  }}
                >
                  {isUpdatingProfile ? "Updating..." : "Update"}
                </button>
              )}
            </motion.div>

            {/* User Info */}
            <motion.div
              className="flex flex-col gap-4 mt-14 px-4"
              variants={itemVariants}
            >
              <div>
                <span className="font-bold text-lg">{user.fullName}</span>
                <span className="block text-sm text-gray-500 dark:text-gray-400">
                  @{user.username}
                </span>
                <span className="text-sm my-1">{user.bio}</span>
              </div>

              <div className="flex gap-2 flex-wrap text-sm">
                {user.link && (
                  <div className="flex gap-1 items-center">
                    <FaLink className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                    <a
                      href={user.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {user.link}
                    </a>
                  </div>
                )}
                <div className="flex gap-2 items-center text-gray-500 dark:text-gray-400">
                  <IoCalendarOutline className="w-4 h-4" />
                  <span>{memberSinceDate}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex gap-1 items-center">
                  <span className="font-bold">{user.following.length}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Following
                  </span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-bold">{user.followers.length}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Followers
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Tabs: Posts / Likes */}
            <motion.div
              className="flex w-full border-b border-gray-200 dark:border-gray-800 mt-4"
              variants={itemVariants}
            >
              <div
                className={`flex justify-center flex-1 p-3 cursor-pointer transition-colors ${
                  feedType === "posts"
                    ? "text-black dark:text-white border-b-2 border-gray-700 dark:border-gray-200"
                    : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }`}
                onClick={() => setFeedType("posts")}
              >
                Posts
              </div>
              <div
                className={`flex justify-center flex-1 p-3 cursor-pointer transition-colors ${
                  feedType === "likes"
                    ? "text-black dark:text-white border-b-2 border-gray-700 dark:border-gray-200"
                    : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }`}
                onClick={() => setFeedType("likes")}
              >
                Likes
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Posts: feedType changes the displayed feed */}
      <Posts feedType={feedType} username={username} userId={user?._id} />
    </motion.div>
  );
};

export default ProfilePage;
