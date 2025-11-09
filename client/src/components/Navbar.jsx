import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "./AuthContext"; // ✅ Global auth context

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, loading } = useAuth(); // ✅ Add loading if you have it in context

  // ✅ Add New Listing Handler
  const handleAddNewClick = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get("http://localhost:8080/check-auth", {
        withCredentials: true,
      });

      if (!res.data.isAuthenticated) {
        toast.error("You must be logged in to add a listing!");
        navigate("/login");
      } else {
        navigate("/listings/new");
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      toast.error("Something went wrong. Try again!");
    }
  };

  // ✅ Logout Handler
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:8080/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        logout(); // update global state
        toast.success(res.data.message || "Logged out successfully!");
        navigate("/");
      } else {
        toast.error(res.data.message || "Logout failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Logout failed!");
    }
  };

  // 🧩 Don’t show navbar until auth state is known (optional)
  if (loading || isAuthenticated === null) return null;

  return (
    <>
      <Toaster position="top-center" />

      <div className="flex h-18 justify-between items-center sticky top-0 bg-white shadow-sm px-6">
        {/* Left Section: Logo + Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-indigo-900 font-semibold text-lg">
            <i class="fa-regular fa-compass mr-2 text-red-500 text-xl"></i>
            Home
          </Link>
          <Link
            to="/listings"
            className="text-indigo-900 font-semibold text-lg"
          >
            Explore
          </Link>
        </div>

        {/* 🔻 Right Section: Auth Links */}
        <div className="flex gap-5 items-center">
          <Link
            to="/listings/new"
            onClick={handleAddNewClick}
            className="text-indigo-900 font-medium text-lg"
          >
            Add your property
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/user" className="text-indigo-900 font-medium text-lg">
                Me
              </Link>
              <button
                onClick={handleLogout}
                className="text-lg font-semibold text-indigo-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-lg font-semibold text-indigo-900"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="text-lg font-semibold text-indigo-900"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
