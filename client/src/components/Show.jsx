import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../App.css";
import "./Review.css"
import Review from "./Review";
import toast, { Toaster } from "react-hot-toast";

function Show() {
  const { id } = useParams();
  const [view, setView] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [currUser, setcurrUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/check-auth", { withCredentials: true })
      .then((res) => {
        if (res.data.isAuthenticated) {
          setcurrUser(res.data.user); // assuming backend sends user object
        }
      })
      .catch((err) => toast.error("Auth check failed:", err));

    // ✅ show flash message (from "new" page)
    if (location.state?.flashMessage) {
      toast.success(location.state.flashMessage);
      setTimeout(() => toast.success, 3000);
    }

    // ✅ fetch the listing
    axios
      .get(`http://localhost:8080/listings/${id}`)
      .then((res) => setView(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          // ✅ show red flash message for deleted listing
          toast.error("This listing has been deleted or does not exist!");

          // redirect after short delay
          setTimeout(() => {
            navigate("/listings");
          }, 3000);
        } else {
          console.error(err);
        }
      });
  }, [id]);

  if (!view)
    return (
      <div className="flex items-center justify-center h-103 max-h-screen">
        <i className="fa-solid fa-spinner fa-spin mx-2 text-5xl"></i>
        <p className="text-gray-500 font-semibold text-5xl font-[Poppins]">
          Loading...
        </p>
      </div>
    );

  const handleEditClick = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/check-auth", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!data.isAuthenticated) {
        // ✅ Show only one toast — no double trigger
        toast.dismiss(); // clear any existing toasts
        toast.error("You must be logged in to edit a listing!", {
          duration: 1500,
        });

        // 🚀 redirect *after* toast fully disappears
        setTimeout(() => navigate("/login"), 1600);
        return;
      }

      // ✅ Authenticated → go to edit page
      navigate(`/listings/${id}/edit`);
    } catch (err) {
      console.error("Auth check failed:", err);
      toast.dismiss();
      toast.error("Something went wrong. Try again!");
    }
  };

  const handleSubmit = async () => {
    try {
      // ✅ check authentication first
      const authRes = await fetch("http://localhost:8080/check-auth", {
        method: "GET",
        credentials: "include", // send cookies/session
      });

      const authData = await authRes.json();

      if (!authData.isAuthenticated) {
        toast.error("You must be logged in to delete a listing!");

        // ⏳ Wait 1.5 seconds before redirecting
        setTimeout(() => {
          navigate("/login");
        }, 1500);

        return;
      }

      // confirm delete
      if (!window.confirm("Are you sure you want to delete this listing?"))
        return;

      // ✅ if authenticated, delete listing
      await axios.delete(`http://localhost:8080/listings/${id}`, {
        withCredentials: true, // ensure cookies go with request
      });

      toast.success("Listing deleted successfully!");

      setTimeout(() => {
        navigate("/listings");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete listing.");
      setTimeout(() => toast.error, 3000);
    }
  };

  return (
    <div className="px-6 py-8">
      <Toaster position="top-center" />

      <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        {view.title}
      </h1>

      {/* Image on top, Info below */}
      <div className="flex justify-left gap-20 items-center mx-5">
        {/* Image */}
        <div className="w-full max-w-[600px]">
          {view.image ? (
            <div className="w-full h-90 overflow-hidden rounded-xl shadow-lg">
              <img
                src={
                  typeof view.image === "file" ? view.image : view.image.url
                }
                alt={view.image.filename || "Listing Image"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <p className="text-gray-400 text-center">No image available</p>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5 p-6 text-lg ">
          <p className="text-gray-500 text-sm">
            Owned by @{view.owner.username}
          </p>
          <p className="text-gray-700">
            {view.description || "No description"}
          </p>

          <p className="text-lg font-semibold text-green-700">
            {view.price != null
              ? `₹ ${view.price.toLocaleString("en-IN")}`
              : "Not specified"}
            <span className="font-normal text-gray-500">/ night</span>
          </p>

          <p className="text-gray-800 font-medium">
            <span className="font-semibold text-gray-900">Location:</span>{" "}
            {view.location || "Unknown"}
          </p>

          <p className="text-gray-800 font-medium">
            <span className="font-semibold text-gray-900">Country:</span>{" "}
            {view.country || "Unknown"}
          </p>

          {currUser && view.owner && currUser._id === view.owner._id && (
            <div className="mt-8">
              <button
                type="button"
                onClick={handleEditClick}
                className="px-4 py-2 mr-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <Review />
    </div>
  );
}

export default Show;
