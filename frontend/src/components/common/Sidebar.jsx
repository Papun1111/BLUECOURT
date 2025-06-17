import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser, FaMoon, FaSun } from "react-icons/fa";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import XSvg from "../svgs/X";

const Sidebar = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate=useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [darkMode]);

  // Build headers including token if exists
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const logout=()=>{
    localStorage.removeItem('token');
    toast.success(

      "Logout Successful"
    );
    navigate("/login");
  }

  const { data: user } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await fetch(`${backend_url}/api/auth/me`, {
        headers: getHeaders(),
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      return response.json();
    },
    retry: false,
  });

  const navItems = [
    { path: "/", name: "Home", icon: <MdHomeFilled className="w-6 h-6" /> },
    { path: "/notifications", name: "Notifications", icon: <IoNotifications className="w-6 h-6" /> },
    { path: user ? `/profile/${user.username}` : "/profile", name: "Profile", icon: <FaUser className="w-6 h-6" /> },
  ];

  const isActive = (path) => location.pathname === path;
  const toggleSidebar = () => setCollapsed(!collapsed);

  /** Desktop Sidebar **/
  const desktopSidebar = (
    <motion.div
      initial={{ width: collapsed ? 80 : 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 h-screen flex flex-col bg-white dark:bg-gray-900 shadow-lg overflow-y-auto relative"
    >
      <motion.button
        className="absolute top-6 -right-3 bg-blue-600 text-white rounded-full p-1 z-10 hidden md:flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors duration-300"
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {collapsed ? <RiArrowRightSLine size={20} /> : <RiArrowLeftSLine size={20} />}
      </motion.button>

      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <XSvg className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="ml-3 text-xl font-bold text-gray-900 dark:text-white"
              >
                BlueCourt
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <motion.li key={item.path} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={item.path}
                className={`flex items-center rounded-xl p-3 transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <motion.div
                  whileHover={{ rotate: isActive(item.path) ? 0 : 10 }}
                  className={isActive(item.path) ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}
                >
                  {item.icon}
                </motion.div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive(item.path) && !collapsed && (
                  <motion.div
                    className="ml-auto h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"
                    layoutId="activeIndicator"
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="p-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center w-full rounded-xl p-3 ${
            collapsed ? "justify-center" : "justify-between"
          } transition-colors duration-300 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300`}
        >
          {darkMode ? <FaSun className="w-5 h-5 text-amber-500" /> : <FaMoon className="w-5 h-5 text-indigo-500" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-medium">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {user && (
        <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"} p-2`}>
            <motion.div whileHover={{ scale: 1.1 }} className="relative">
              <img
                src={user.profileImg || "/avatar-placeholder.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!collapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => logout()}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  <BiLogOut className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );

  /** Mobile Navbar **/
  const mobileNavbar = (
    <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 flex flex-col">
      <nav className="flex justify-around p-2">
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            className={`flex flex-col items-center transition-colors duration-300 ${
              isActive(item.path) ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>

      {user && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.1 }} className="relative">
              <img
                src={user.profileImg || "/avatar-placeholder.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-blue-500"
              />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDarkMode(!darkMode)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300">
              {darkMode ? <FaSun /> : <FaMoon />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.2, rotate: 15 }} whileTap={{ scale: 0.9 }} onClick={() => logout()} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
              <BiLogOut />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{desktopSidebar}</div>
      <div className="md:hidden">{mobileNavbar}</div>
    </>
  );
};

export default Sidebar;
