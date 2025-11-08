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
        {/* 🔻 Left Section: Logo + Links */}
        <div className="flex items-center gap-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-7 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
            />
          </svg>

          <Link to="/" className="text-indigo-900 font-semibold text-lg">
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
            <button
              onClick={handleLogout}
              className="text-lg font-semibold text-indigo-900"
            >
              Logout
            </button>
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
