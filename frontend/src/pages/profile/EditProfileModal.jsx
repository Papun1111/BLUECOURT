import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserEdit } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  // Populate form fields from the authenticated user
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  // Handle all text input changes
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Variants for the modal content (Framer Motion)
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  };

  // Open the modal
  const openModal = () => {
    document.getElementById("edit_profile_modal").showModal();
  };

  // Close the modal
  const closeModal = () => {
    document.getElementById("edit_profile_modal").close();
  };

  return (
    <>
      {/* Button to open modal */}
      <button
        className="btn btn-sm rounded-full border border-gray-300 dark:border-gray-600
                   text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-200/40 
                   dark:hover:bg-gray-800/50 flex items-center gap-2 transition-all"
        onClick={openModal}
      >
        <FaUserEdit className="text-base" />
        <span>Edit profile</span>
      </button>

      {/* Native <dialog> element for the popup */}
      <dialog
        id="edit_profile_modal"
        className="modal open:backdrop:bg-black/60 open:backdrop:backdrop-blur-sm 
                   p-0 m-0 border-0 max-w-none"
      >
        {/* Modal content (animated via Framer Motion) */}
        <motion.div
          className="modal-box relative w-[95vw] max-w-xl bg-gradient-to-br 
                     from-gray-100 to-white dark:from-gray-900 dark:to-black 
                     border border-gray-300 dark:border-gray-800 rounded-lg shadow-2xl 
                     text-gray-800 dark:text-gray-300 p-6 mx-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Close button (top-right) */}
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 
                       hover:text-gray-700 dark:hover:text-gray-200 transition"
            onClick={closeModal}
          >
            <MdClose size={20} />
          </button>

          {/* Modal Title */}
          <h3
            className="text-2xl font-bold mb-6 
                       bg-gradient-to-r from-blue-600 to-purple-500 
                       bg-clip-text text-transparent"
          >
            Update Profile
          </h3>

          {/* Main Form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            {/* Row 1: Full Name & Username */}
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="flex-1 bg-gray-200 dark:bg-gray-800/50 border 
                           border-gray-300 dark:border-gray-700 rounded-lg p-3 
                           text-gray-800 dark:text-gray-300 placeholder-gray-400 
                           dark:placeholder-gray-500 focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="flex-1 bg-gray-200 dark:bg-gray-800/50 border 
                           border-gray-300 dark:border-gray-700 rounded-lg p-3 
                           text-gray-800 dark:text-gray-300 placeholder-gray-400 
                           dark:placeholder-gray-500 focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Row 2: Email & Bio */}
            <div className="flex flex-wrap gap-3">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="flex-1 bg-gray-200 dark:bg-gray-800/50 border 
                           border-gray-300 dark:border-gray-700 rounded-lg p-3 
                           text-gray-800 dark:text-gray-300 placeholder-gray-400 
                           dark:placeholder-gray-500 focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="flex-1 bg-gray-200 dark:bg-gray-800/50 border 
                           border-gray-300 dark:border-gray-700 rounded-lg p-3 
                           text-gray-800 dark:text-gray-300 placeholder-gray-400 
                           dark:placeholder-gray-500 focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent h-24 resize-none"
              />
            </div>

            {/* Row 3: Current Password & New Password */}
            <div className="flex flex-wrap gap-3">
              <input
                type="password"
                placeholder="Current Password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="flex-1 bg-gray-200 dark:bg-gray-800/50 border 
                           border-gray-300 dark:border-gray-700 rounded-lg p-3 
                           text-gray-800 dark:text-gray-300 placeholder-gray-400 
                           dark:placeholder-gray-500 focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="flex-1 bg-gray-200 dark:bg-gray-800/50 border 
                           border-gray-300 dark:border-gray-700 rounded-lg p-3 
                           text-gray-800 dark:text-gray-300 placeholder-gray-400 
                           dark:placeholder-gray-500 focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Row 4: Profile Link */}
            <input
              type="text"
              placeholder="Link"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className="bg-gray-200 dark:bg-gray-800/50 border 
                         border-gray-300 dark:border-gray-700 rounded-lg p-3 
                         text-gray-800 dark:text-gray-300 placeholder-gray-400 
                         dark:placeholder-gray-500 focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent w-full"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="btn mt-4 bg-gradient-to-r from-blue-600 to-purple-600 
                         border-none text-white rounded-full hover:from-blue-700 
                         hover:to-purple-700 transition-all disabled:opacity-50 
                         flex justify-center items-center gap-2"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <span className="animate-pulse">Updating...</span>
              ) : (
                "Update Profile"
              )}
            </button>
          </form>
        </motion.div>

        {/* Clicking outside the modal content closes it */}
        <form method="dialog" className="modal-backdrop">
          <button className="cursor-default"></button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
