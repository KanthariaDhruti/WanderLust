import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../App.css";
import { useAuth } from "./AuthContext"; // ✅ added

function Signup() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ added

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:8080/signup", {
        username,
        email,
        password,
      });

      if (res.data.success) {
        login(res.data.user); // ✅ instantly updates auth context
        toast.success("🎉 Signup successful! Redirecting to listings...");
        setTimeout(() => navigate("/listings"), 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md mx-auto my-16 bg-white border border-gray-200 shadow-lg rounded-2xl px-10 py-12 transition-all duration-300 hover:shadow-2xl"
    >
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 font-[Lato]">
        Create Your Account
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
        placeholder="Enter a nice username"
        className={`w-full border rounded-lg py-2.5 px-4 text-gray-800 bg-gray-50 outline-none transition duration-200 ease-in-out mb-1 ${
          errors.username
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        }`}
      />
      {errors.username && (
        <p className="text-red-500 text-sm mb-3">{errors.username}</p>
      )}

      {/* Email */}
      <label
        htmlFor="email"
        className="text-gray-700 font-medium text-lg block mb-2"
      >
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Enter your email"
        className={`w-full border rounded-lg py-2.5 px-4 text-gray-800 bg-gray-50 outline-none transition duration-200 ease-in-out mb-1 ${
          errors.email
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        }`}
      />
      {errors.email && (
        <p className="text-red-500 text-sm mb-3">{errors.email}</p>
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
        placeholder="Enter a strong password"
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
        {loading ? "Creating Account..." : "Sign Up"}
      </button>

      <p className="text-center text-gray-600 text-sm mt-4">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-green-600 font-medium hover:underline hover:text-green-700 transition"
        >
          Log in
        </a>
      </p>
    </form>
  );
}

export default Signup;
