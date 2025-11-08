import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch existing listing
  useEffect(() => {
    const fetchListing = async () => {
      try {
        // ✅ Get logged-in user info
        const authRes = await axios.get("http://localhost:8080/check-auth", {
          withCredentials: true,
        });

        const authData = authRes.data;

        if (!authData.isAuthenticated) {
          toast.error("Please log in to edit listings!");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        // ✅ Fetch the listing
        const res = await axios.get(`http://localhost:8080/listings/${id}`);
        const listing = res.data;

        // ✅ Compare user IDs
        if (listing.owner._id !== authData.user._id) {
          toast.error("You don't have permission to edit this listing!");
          setTimeout(() => navigate(`/listings/${id}`), 1500);
          return;
        }

        // ✅ If authorized → fill the form
        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          price: listing.price || "",
          location: listing.location || "",
          country: listing.country || "",
          image: listing.image?.url || listing.image || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while fetching the listing!");
      }
    };

    fetchListing();
  }, [id, navigate]);

  if (!formData.title) return <p className="text-center py-6">Loading...</p>;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setFormData({ ...formData, image: files[0] }); // store File object
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    else if (formData.price <= 0)
      newErrors.price = "Price must be greater than 0.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("listing[title]", formData.title);
      data.append("listing[description]", formData.description);
      data.append("listing[price]", formData.price);
      data.append("listing[location]", formData.location);
      data.append("listing[country]", formData.country);
      if (formData.image instanceof File) {
        data.append("listing[image]", formData.image); // ✅ file upload
      }

      await axios.put(`http://localhost:8080/listings/${id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Listing updated successfully!");
      navigate(`/listings/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update listing!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Edit Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 
              ${
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
              placeholder="Enter title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 h-32 resize-none focus:outline-none focus:ring-1 
              ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 
              ${
                errors.price
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 
              ${
                errors.location
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
              placeholder="Enter location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 
              ${
                errors.country
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
              placeholder="Enter country"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Image URL
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Enter image URL"
            />
            {formData.image && !(formData.image instanceof File) && (
              <img
                src={formData.image}
                alt="Current"
                className="mt-2 w-32 h-32 object-cover rounded-md border"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md font-semibold transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Edit;
