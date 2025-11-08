import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "../App.css";
import { useAuth } from "./AuthContext";

function Login() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = (username, password) => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    const formErrors = validateForm(username, password);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/login",
        { username, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        login(res.data.user);

        // ✅ Same toast style as all other success popups
        toast.success("Login successful! Redirecting...");
        const redirectPath =
          res.data.redirectUrl ||
          localStorage.getItem("redirectAfterLogin") ||
          "/listings";
        localStorage.removeItem("redirectAfterLogin");
        setTimeout(() => navigate(redirectPath), 1500);
      } else {
        toast.error("Invalid credentials. Please try again!");
      }
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Invalid username or password!");
      } else {
        toast.error("Login failed. Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md mx-auto my-16 bg-white border border-gray-200 shadow-lg rounded-2xl px-10 py-12 transition-all duration-300 hover:shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 font-[Lato]">
          Login to Your Account
        </h1>

        {/* Username */}
        <label
          htmlFor="username"
          className="text-gray-700 font-medium text-lg block mb-2"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          className={`w-full border rounded-lg py-2.5 px-4 text-gray-800 bg-gray-50 outline-none transition duration-200 ease-in-out mb-1 ${
            errors.username
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          }`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-3">{errors.username}</p>
        )}

        {/* Password */}
        <label
          htmlFor="password"
          className="text-gray-700 font-medium text-lg block mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          className={`w-full border rounded-lg py-2.5 px-4 text-gray-800 bg-gray-50 outline-none transition duration-200 ease-in-out mb-1 ${
            errors.password
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-3">{errors.password}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-4`}
        >
          {loading ? "Logging you in..." : "Login"}
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-green-600 font-medium hover:underline hover:text-green-700 transition"
          >
            SignUp
          </a>
        </p>
      </form>

      {/* ✅ Hot Toast Notifications (global styling) */}
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
    </>
  );
}

export default Login;
