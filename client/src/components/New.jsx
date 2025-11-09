import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "../App.css";

function New() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Handle image input
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    else if (formData.price <= 0)
      newErrors.price = "Price must be greater than 0.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!imageFile) newErrors.image = "Image is required.";
    return newErrors;
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fill all required fields properly!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Prepare FormData
      const data = new FormData();
      data.append("listing[title]", formData.title);
      data.append("listing[description]", formData.description);
      data.append("listing[price]", formData.price);
      data.append("listing[location]", formData.location);
      data.append("listing[country]", formData.country);
      data.append("listing[image]", imageFile);

      const res = await axios.post("http://localhost:8080/listings", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("🎉 New listing added successfully!");
      setTimeout(() => navigate(`/listings/${res.data.listing._id}`), 1500);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("You must be logged in to create a listing!");
        localStorage.setItem("redirectAfterLogin", "/listings/new");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        toast.error("Failed to add listing. Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Create a New Listing
      </h1>

      <form
        className="space-y-6"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            type="text"
            placeholder="Enter title"
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
              errors.title
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className={`w-full border rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-1 ${
              errors.description
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Image Upload */}
        {/* Image Upload */}
<div>
  <label htmlFor="image" className="block mb-1 font-medium">
    Upload Image
  </label>

  <label
    htmlFor="image"
    className={`flex items-center w-full border rounded-md overflow-hidden cursor-pointer ${
      errors.image ? "border-red-500" : "border-gray-300"
    }`}
  >
    {/* Left side: Choose File */}
    <div className="bg-gray-200 px-4 py-2 text-black font-medium">
      Choose a file
    </div>
    {/* Right side: file name */}
    <div className="flex-1 px-3 py-2 text-black">
      {imageFile ? imageFile.name : "No file chosen"}
    </div>

    {/* Hidden input */}
    <input
      id="image"
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />
  </label>

  {errors.image && (
    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
  )}
</div>


        {/* Price */}
        <div>
          <label htmlFor="price" className="block mb-1 font-medium">
            Price
          </label>
          <input
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            placeholder="Enter price"
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
              errors.price
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block mb-1 font-medium">
            Country
          </label>
          <input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            type="text"
            placeholder="Enter country"
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
              errors.country
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block mb-1 font-medium">
            Location
          </label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            type="text"
            placeholder="Enter location"
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
              errors.location
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        {/* Submit Button */}
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
              <span>Uploading...</span>
            </div>
          ) : (
            "Add Listing"
          )}
        </button>
      </form>
    </div>
  );
}

export default New;
