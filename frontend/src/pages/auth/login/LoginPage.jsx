import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { backend_url } from "../../../config";
// Icons
import { MdOutlineMail, MdPassword } from "react-icons/md";

// Custom Logo
import XSvg from "../../../components/svgs/X";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await fetch(`${backend_url}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get("Content-Type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong during login");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "An error occurred during login.");
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
      <motion.div
        className="hidden lg:flex flex-1 items-center justify-center bg-blue-900 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <XSvg className="w-2/3 fill-current text-white" />
      </motion.div>

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
          <div className="flex justify-center lg:hidden">
            <XSvg className="w-20 fill-current text-blue-500 dark:text-blue-300" />
          </div>
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-200 text-center"
            variants={itemVariants}
          >
            Let's go.
          </motion.h1>

          <motion.label
            className="flex items-center gap-3 p-3 border rounded-lg border-blue-500 hover:border-blue-700 dark:border-blue-400 dark:hover:border-blue-200 transition duration-300"
            variants={itemVariants}
          >
            <MdOutlineMail className="text-2xl text-blue-500 dark:text-blue-300" />
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

          <motion.button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition duration-300"
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>

          {isError && (
            <motion.p className="text-red-500 text-center" variants={itemVariants}>
              {error?.message || "Something went wrong"}
            </motion.p>
          )}
        </motion.form>

        <motion.div className="mt-6 text-center" variants={itemVariants}>
          <p className="text-blue-900 dark:text-blue-200">Don’t have an account?</p>
          <Link to="/signup">
            <motion.button
              className="mt-2 py-3 px-6 text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-700 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign up
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
