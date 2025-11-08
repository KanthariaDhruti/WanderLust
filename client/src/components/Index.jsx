import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Index() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    axios
      .get("http://localhost:8080/listings")
      .then((res) => setItems(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-103 max-h-screen">
        <i className="fa-solid fa-spinner fa-spin mx-2 text-5xl"></i>
        <p className="text-gray-500 font-semibold text-5xl font-[Poppins]">
          Loading...
        </p>
      </div>
    );
  return (
    <>
      <div className="grid mt-7 mb-4 font-[Lato] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl hover:scale-105 transition"
          >
            <Link to={`/listings/${item._id}`} className="block">
              {/* Hotel Image */}
              <img
                src={
                  typeof item.image === "string" ? item.image : item.image?.url
                }
                alt={item.title}
                className="w-full h-48 object-cover"
              />

              {/* Card Content */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h2>

                <p className="text-gray-600 mt-1">
                  📍 {item.location}, {item.country}
                </p>

                <p className="text-gray-700 font-medium mt-2">
                  ₹ {item.price?.toLocaleString("en-IN")} / night
                </p>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {item.description || "No description available."}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default Index;
