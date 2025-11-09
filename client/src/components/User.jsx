import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "./AuthContext";

function User() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  console.log("user from context:", user);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const res = await axios.get("http://localhost:8080/user", {
          withCredentials: true,
        });
        setListings(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load your listings");
      } finally {
        setLoading(false);
      }
    };
    fetchUserListings();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Loading your listings...</p>;

  return (
    <div className="mx-auto px-4 py-8 max-w-6xl">
      <Toaster />

      {/* 🧑 User Info Section */}
          <div>
            <h2 className="text-2xl italic font-semibold">@{user?.username || "User"}</h2>
            <p className="text-gray-600">{user?.email || "No email found"}</p>
            <p className="text-sm text-gray-500">
              Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        
      {/* 🏠 Listings Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl inline italic text-gray-800">
          @{user ? `${user.username}'s` : "Your"}
        </h2>
        <span className="text-2xl font-bold italic ml-1">Listings</span>
      </div>

      {listings.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven’t created any listings yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="rounded-xl shadow-md hover:shadow-lg transition bg-white"
            >
              <img
                src={listing.image?.url || "https://via.placeholder.com/300"}
                alt={listing.title}
                className="rounded-t-xl h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold my-2">{listing.title}</h3>
                <p className="text-gray-600">
                  <i className="fa-solid fa-location-dot mr-2"></i>
                  {listing.location}
                </p>
                <Link
                  to={`/listings/${listing._id}`}
                  className="text-blue-500 mt-2 inline-block"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default User;
