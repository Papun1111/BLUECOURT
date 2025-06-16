import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Icons
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";

// Custom Logo
import XSvg from "../../../components/svgs/X";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
const backend_url = import.meta.env.VITE_BACKEND_URL;
  const { mutate, isError, error, isLoading } = useMutation({
    mutationFn: async (userData) => {
      const response = await fetch(`${backend_url}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not sign up, please try again.");
      }
      return data;
    },
    onSuccess: () => {
      setFormData({
        email: "",
        username: "",
        fullName: "",
        password: "",
      });
      toast.success("Signed up successfully! Please check your email to confirm.");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section (Graphic) - Shown on md+ screens */}
      <motion.div
        className="hidden lg:flex flex-1 items-center justify-center bg-blue-900 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <XSvg className="w-2/3 fill-current text-white" />
      </motion.div>

      {/* Right Section (Sign-up Form) */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center bg-blue-50 dark:bg-gray-900 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.form
          className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-200 dark:border-gray-700"
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          {/* Logo for smaller screens */}
          <div className="flex justify-center lg:hidden">
            <XSvg className="w-20 fill-current text-blue-500 dark:text-blue-300" />
          </div>
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-200 text-center"
            variants={itemVariants}
          >
            Join today.
          </motion.h1>

          {/* Email */}
          <motion.label
            className="flex items-center gap-3 p-3 border rounded-lg border-blue-500 hover:border-blue-700 dark:border-blue-400 dark:hover:border-blue-200 transition duration-300"
            variants={itemVariants}
          >
            <MdOutlineMail className="text-2xl text-blue-500 dark:text-blue-300" />
            <input
              type="email"
              className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-100"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              required
            />
          </motion.label>

          {/* Username & Full Name */}
          <div className="flex flex-col gap-4 md:flex-row">
            <motion.label
              className="flex items-center gap-3 p-3 border rounded-lg border-blue-500 hover:border-blue-700 dark:border-blue-400 dark:hover:border-blue-200 transition duration-300 w-full"
              variants={itemVariants}
            >
              <FaUser className="text-2xl text-blue-500 dark:text-blue-300" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-100"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </motion.label>
            <motion.label
              className="flex items-center gap-3 p-3 border rounded-lg border-blue-500 hover:border-blue-700 dark:border-blue-400 dark:hover:border-blue-200 transition duration-300 w-full"
              variants={itemVariants}
            >
              <MdDriveFileRenameOutline className="text-2xl text-blue-500 dark:text-blue-300" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-100"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
                required
              />
            </motion.label>
          </div>

          {/* Password */}
          <motion.label
            className="flex items-center gap-3 p-3 border rounded-lg border-blue-500 hover:border-blue-700 dark:border-blue-400 dark:hover:border-blue-200 transition duration-300"
            variants={itemVariants}
          >
            <MdPassword className="text-2xl text-blue-500 dark:text-blue-300" />
            <input
              type="password"
              className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-100"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
            />
          </motion.label>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition duration-300"
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </motion.button>

          {isError && (
            <motion.p className="text-red-500 text-center" variants={itemVariants}>
              {error?.message || "Something went wrong, please try again."}
            </motion.p>
          )}
        </motion.form>

        {/* Already have an account */}
        <motion.div className="mt-6 text-center" variants={itemVariants}>
          <p className="text-blue-900 dark:text-blue-200">Already have an account?</p>
          <Link to="/login">
            <motion.button
              className="mt-2 py-3 px-6 text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-700 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign in
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
