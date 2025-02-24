import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import XSvg from "../../../components/svgs/X";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const { mutate, isError, error, isLoading } = useMutation({
    mutationFn: async (userData) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not sign up, please try again.");
      }

      return data;
    },
    onSuccess: (data) => {
      // Assuming you want to navigate or clear form here
      setFormData({
        email: "",
        username: "",
        fullName: "",
        password: "",
      });
      toast.success("Signed up successfully! Please check your email to confirm.");
    },
    onError: (error) => {
      toast.error(error.message);
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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen items-center justify-center bg-gray-100">
      <div className="hidden lg:flex flex-1 items-center justify-center">
        <XSvg className="w-2/3" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-10">
        <form
          className="w-full max-w-lg space-y-6 bg-white p-8 shadow-lg rounded-lg"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 mx-auto lg:hidden" />
          <h1 className="text-3xl font-bold text-center text-gray-800">Join today.</h1>
          <div className="flex items-center gap-2 border border-gray-300 rounded p-2">
            <MdOutlineMail className="text-gray-500" />
            <input
              type="email"
              className="w-full focus:outline-none"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 border border-gray-300 rounded p-2 flex-1">
              <FaUser className="text-gray-500" />
              <input
                type="text"
                className="w-full focus:outline-none"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </div>
            <div className="flex items-center gap-2 border border-gray-300 rounded p-2 flex-1">
              <MdDriveFileRenameOutline className="text-gray-500" />
              <input
                type="text"
                className="w-full focus:outline-none"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded p-2">
            <MdPassword className="text-gray-500" />
            <input
              type="password"
              className="w-full focus:outline-none"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-500 hover:bg-blue-600 rounded-full py-2 font-semibold transition duration-200 ease-in-out transform hover:scale-105"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
          {isError && (
            <p className="text-red-500 text-center mt-2">
              {error.message || "Something went wrong, please try again."}
            </p>
          )}
        </form>
        <div className="mt-6 flex flex-col items-center w-full max-w-lg">
          <p className="text-gray-700">Already have an account?</p>
          <Link to="/login">
            <button className="w-full text-blue-500 hover:text-blue-600 border border-blue-500 hover:border-blue-600 rounded-full py-2 mt-4 transition duration-200 ease-in-out">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
