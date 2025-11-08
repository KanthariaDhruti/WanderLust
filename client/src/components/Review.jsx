import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Review() {
  const { id } = useParams(); // ✅ get listing id from URL
  const [view, setView] = useState({ reviews: [] });
  const [currUser, setcurrUser] = useState(null);

  // ✅ Fetch listing and its reviews
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8080/check-auth", {
          withCredentials: true,
        });
        if (res.data.isAuthenticated) {
          setcurrUser(res.data.user);
        } else {
          setcurrUser(null);
        }
      } catch (err) {
        console.log(err);
        setcurrUser(null);
      }
    };

    checkAuth(); // ✅ call it once
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/listings/${id}`)
      .then((res) => setView(res.data))
      .catch(() => {
        toast.error("Listing not found or deleted!");
      });
  }, [id]);

  // ✅ Submit a new review
  const submission = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const comment = formData.get("review[comment]");
    const rating = formData.get("review[rating]");

    try {
      const res = await axios.post(
        `http://localhost:8080/listings/${id}/reviews`,
        { review: { comment, rating } },
        { withCredentials: true }
      );

      toast.success("Review added successfully!");

      // Update reviews instantly
      setView((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), res.data.review],
      }));

      e.target.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add review.");
    }
  };

  // ✅ Delete review
  const handleDelete = async (reviewID) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/listings/${id}/reviews/${reviewID}`,
        { withCredentials: true }
      );
      toast.success("Review deleted!");

      // Remove from state
      setView((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r._id !== reviewID),
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review.");
    }
  };

  return (
    <div className="mt-16 max-w-4xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-md">
      {/* ✅ Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#333",
            fontWeight: "500",
            fontFamily: "Lato, sans-serif",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
        Reviews
      </h2>

      {/* Add Review Form */}
      {currUser ? (
        <div>
          <form
            onSubmit={submission}
            className="bg-white p-6 rounded-xl shadow-inner space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Leave a Review
            </h3>

            <textarea
              name="review[comment]"
              placeholder="Write your review..."
              rows="4"
              required
              className="w-full border resize-none border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none placeholder-gray-400"
            ></textarea>

            <div>
              <label className="text-gray-700 font-medium ml-2">Rating:</label>
              <fieldset className="starability-fade mt-2">
                <legend className="sr-only">Rate this listing:</legend>

                <input
                  type="radio"
                  id="rate1"
                  name="review[rating]"
                  value="1"
                />
                <label htmlFor="rate1" title="Terrible">
                  1 star
                </label>

                <input
                  type="radio"
                  id="rate2"
                  name="review[rating]"
                  value="2"
                />
                <label htmlFor="rate2" title="Not good">
                  2 stars
                </label>

                <input
                  type="radio"
                  id="rate3"
                  name="review[rating]"
                  value="3"
                  defaultChecked
                />
                <label htmlFor="rate3" title="Average">
                  3 stars
                </label>

                <input
                  type="radio"
                  id="rate4"
                  name="review[rating]"
                  value="4"
                />
                <label htmlFor="rate4" title="Very good">
                  4 stars
                </label>

                <input
                  type="radio"
                  id="rate5"
                  name="review[rating]"
                  value="5"
                />
                <label htmlFor="rate5" title="Amazing">
                  5 stars
                </label>
              </fieldset>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
            >
              Submit Review
            </button>
          </form>
          <div>
            <h1 className="text-2xl mt-6 font-semibold mb-4">All Reviews</h1>

            <div className="gap-6 grid grid-cols-2 justify-center items-center">
              {view.reviews && view.reviews.length > 0 ? (
                view.reviews.map((rev, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                  >
                    <h1 className="font-semibold text-gray-800">
                      {rev.author?.username || "Anonymous"}
                    </h1>
                    <p className="text-gray-800 mt-1">{rev.comment}</p>
                    <p className="text-yellow-500 font-semibold mt-2">
                      {"★".repeat(rev.rating)}{" "}
                      <span className="text-gray-500 text-sm">
                        ({rev.rating} / 5)
                      </span>
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {currUser &&
                    rev.author &&
                    currUser._id === rev.author._id ? (
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="border p-2 text-white mt-3 block rounded-lg bg-red-600 hover:bg-red-700 transition"
                      >
                        DELETE
                      </button>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl mt-6 font-semibold mb-4">All Reviews</h1>

          <div className="gap-6 grid grid-cols-2 justify-center items-center">
            {view.reviews && view.reviews.length > 0 ? (
              view.reviews.map((rev, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  <h1 className="font-semibold text-gray-800">
                    {rev.author?.username || "Anonymous"}
                  </h1>
                  <p className="text-gray-800 mt-1">{rev.comment}</p>
                  <p className="text-yellow-500 font-semibold mt-2">
                    {"★".repeat(rev.rating)}{" "}
                    <span className="text-gray-500 text-sm">
                      ({rev.rating} / 5)
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Review;
