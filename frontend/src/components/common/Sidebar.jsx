import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  const navigate = useNavigate();
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

  const logout = () => {
    localStorage.removeItem('token');
    toast.success("Logout Successful");
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

  // Animation variants
  const sidebarVariants = {
    expanded: {
      width: 280,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.8, 0.25, 1],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    collapsed: {
      width: 80,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.8, 0.25, 1],
        when: "afterChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const logoVariants = {
    hover: {
      rotate: 360,
      scale: 1.1,
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  const navItemVariants = {
    hover: {
      scale: 1.05,
      x: 8,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.9,
      transition: { duration: 0.1 }
    }
  };

  /** Desktop Sidebar **/
  const desktopSidebar = (
    <motion.div
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      className="relative h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden"
    >
      {/* Toggle Button */}
      <motion.button
        className="absolute top-6 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-2 z-20 shadow-lg hover:shadow-xl transition-shadow duration-300"
        onClick={toggleSidebar}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <motion.div
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <RiArrowLeftSLine size={20} />
        </motion.div>
      </motion.button>

      {/* Header */}
      <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center w-full">
          <motion.div
            variants={logoVariants}
            whileHover="hover"
            className="flex-shrink-0"
          >
            <XSvg className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                variants={itemVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="ml-4 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
              >
                BlueCourt
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <motion.li
              key={item.path}
              variants={navItemVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`flex items-center rounded-xl p-3 transition-all duration-300 relative overflow-hidden ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                {/* Active indicator */}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r"
                    layoutId="activeBar"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
                
                <motion.div
                  animate={{ 
                    rotate: isActive(item.path) ? 360 : 0,
                    scale: isActive(item.path) ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {item.icon}
                </motion.div>
                
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      variants={itemVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="ml-4 font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {isActive(item.path) && !collapsed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                    layoutId="activeIndicator"
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="p-4">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center w-full rounded-xl p-3 transition-all duration-300 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 text-gray-700 dark:text-gray-300 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          <motion.div
            animate={{ rotate: darkMode ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {darkMode ? (
              <FaSun className="w-5 h-5 text-amber-500" />
            ) : (
              <FaMoon className="w-5 h-5 text-indigo-500" />
            )}
          </motion.div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                variants={itemVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="font-medium whitespace-nowrap"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* User Profile */}
      {user && (
        <motion.div
          className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"} p-2`}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative flex-shrink-0"
            >
              <img
                src={user.profileImg || "/avatar-placeholder.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gradient-to-r from-blue-500 to-purple-500 object-cover"
              />
              <motion.div
                className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    @{user.username}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.button
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={logout}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-300 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <BiLogOut className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  /** Mobile Navbar **/
  const mobileNavbar = (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 inset-x-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50 safe-area-pb"
    >
      <nav className="flex justify-around p-3">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                isActive(item.path)
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <motion.div
                animate={{
                  rotate: isActive(item.path) ? 360 : 0,
                  scale: isActive(item.path) ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                {item.icon}
              </motion.div>
              <span className="text-xs mt-1 font-medium">{item.name}</span>
              {isActive(item.path) && (
                <motion.div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                  layoutId="mobileActiveIndicator"
                />
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <img
                src={user.profileImg || "/avatar-placeholder.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
              />
              <motion.div
                className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{user.username}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              <motion.div
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
              </motion.div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={logout}
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300"
            >
              <BiLogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <>
      <div className="hidden lg:block h-full">{desktopSidebar}</div>
      <div className="lg:hidden">{mobileNavbar}</div>
    </>
  );
};

export default Sidebar;