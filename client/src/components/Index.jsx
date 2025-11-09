import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Index() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/listings")
      .then((res) => {
        setItems(res.data);
        setFilteredItems(res.data); // initially show all listings
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  // Search handler
  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredItems(items);
      return;
    }

    const results = items.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.country?.toLowerCase().includes(query)
    );
    setFilteredItems(results);
  };

  // Trigger search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

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
    <div className="px-6 py-8">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8 flex gap-2">
        <input
          type="text"
          placeholder="Search listings by title, location, or country"
          className="flex-grow p-3 rounded-xl border border-gray-300 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearch}
          className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-rose-600 transition"
        >
          Search
        </button>
      </div>

      {/* Listings Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No listings found.</p>
      ) : (
        <div className="grid mt-7 mb-4 font-[Lato] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl hover:scale-105 transition"
            >
              <Link to={`/listings/${item._id}`} className="block">
                {/* Hotel Image */}
                <img
                  src={typeof item.image === "string" ? item.image : item.image?.url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />

                {/* Card Content */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
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
      )}
    </div>
  );
}

export default Index;
