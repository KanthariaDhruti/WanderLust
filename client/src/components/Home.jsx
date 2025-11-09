import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredListings, setFilteredListings] = useState([]);

  // Fetch few random listings for homepage preview
  useEffect(() => {
    axios
      .get("http://localhost:8080/listings")
      .then((res) => {
        const randomListings = res.data.sort(() => 0.5 - Math.random()).slice(0, 4);
        setFeatured(randomListings);
        setFilteredListings(randomListings); // initially show all
      })
      .catch((err) => console.log(err));
  }, []);

  // Handle search
  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      setFilteredListings(featured);
      return;
    }

    const results = featured.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.country?.toLowerCase().includes(query)
    );

    setFilteredListings(results);
  };

  // Optional: search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="font-[Poppins]">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col justify-center items-center text-center text-white">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Beach background"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Wanderlust
          </h1>
          <p className="text-lg md:text-2xl mb-8 drop-shadow-md">
            Discover unique stays and unforgettable experiences around the world.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-2 w-[90%] max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search destinations, hotels, or experiences"
              className="flex-grow outline-none text-gray-700 px-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center mb-10">Top Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-10">
          {[
            {
              name: "Goa",
              image:
                "https://images.unsplash.com/photo-1625505826977-66d796089d73?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=914",
            },
            {
              name: "Manali",
              image:
                "https://images.unsplash.com/photo-1704795272663-68ed3010197c?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=435",
            },
            {
              name: "Jaipur",
              image:
                "https://images.unsplash.com/photo-1557690756-62754e561982?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=319",
            },
            {
              name: "Kerala",
              image:
                "https://images.unsplash.com/photo-1589983846997-04788035bc83?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1374",
            },
          ].map((place, i) => (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition"
            >
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-2xl text-white font-semibold">{place.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Popular Listings</h2>
        {(filteredListings.length > 0 ? filteredListings : featured).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10">
            {(filteredListings.length > 0 ? filteredListings : featured).map((item) => (
              <Link
                key={item._id}
                to={`/listings/${item._id}`}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl hover:scale-105 transition block"
              >
                <img
                  src={typeof item.image === "string" ? item.image : item.image?.url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 mt-1">📍 {item.location}, {item.country}</p>
                  <p className="text-gray-700 font-medium mt-2">₹ {item.price?.toLocaleString("en-IN")} / night</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No results found</p>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-red-500 text-white text-center py-10 mx-10 px-6 rounded-3xl">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Ready to start your next adventure?
        </h2>
        <p className="text-lg mb-6">
          Explore cozy stays, exotic destinations, and unique experiences with Wanderlust.
        </p>
        <Link
          to="/listings"
          className="bg-white text-red-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Explore All Listings
        </Link>
      </section>
    </div>
  );
}

export default Home;
