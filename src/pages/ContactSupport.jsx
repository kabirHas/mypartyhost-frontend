import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URLS from "../config";

function ContactSupport() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "",
    category: "",
    subCategory: "",
    description: "",
    files: [], // Array for multiple files
  });
  const [error, setError] = useState(""); // For error feedback
  const [previews, setPreviews] = useState([]); // Store preview URLs

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) => file.size <= 5 * 1024 * 1024 // 5MB limit
      );
      if (validFiles.length !== files.length) {
        setError("All files must be 5MB or smaller.");
      }
      setForm((prev) => ({ ...prev, [name]: validFiles }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  // Generate preview URLs for selected files
  useEffect(() => {
    // Create preview URLs
    const newPreviews = form.files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Clean up URLs on file change or unmount
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [form.files]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append("subject", form.subject);
    formData.append("category", form.category);
    formData.append("subcategory", form.subCategory);
    formData.append("description", form.description);
    form.files.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      const response = await axios.post(`${BASE_URLS.BACKEND_BASEURL}contact`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(-1); // Navigate back on success
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setError(
        error.response?.data?.message || "Failed to submit request. Please try again."
      );
    }
  };

  return (
    <div className="mx-auto py-6">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 mb-4 flex items-center">
        <i className="ri-arrow-left-line mr-1 text-lg" />
        Back
      </button>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="justify-start text-[#292929] text-3xl font-medium font-['Inter'] leading-9 tracking-tigh">Contact Support</h1>
          <p className="text-sm text-[#3D3D3D] mt-1">
            We're here to help! Let us know what you need assistance with.
          </p>
        </div>
        <button className="border-2 border-[#E61E4D] font-semibold text-[#E61E4D] px-4 py-2 text-sm rounded-md hover:bg-pink-50">
          5 Tickets
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Subject */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Enter a Title"
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Category</label>
          <div className="relative">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm appearance-none pr-10 focus:outline-none"
              required
            >
              <option value="">Select a Category</option>
              <option>Account</option>
              <option>Payments</option>
              <option>Technical Issue</option>
              <option>Other</option>
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          </div>
        </div>

        {/* Sub Category */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Sub Category <span className="text-gray-400 text-xs ml-1">(Optional)</span>
          </label>
          <div className="relative">
            <select
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm appearance-none pr-10 focus:outline-none"
            >
              <option value="">Select a Sub Category</option>
              <option>Profile Picture</option>
              <option>Verification</option>
              <option>Bug Report</option>
              <option>Other</option>
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the reason"
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none resize-none"
            required
          />
        </div>

        {/* File Upload */}
        <div className="border-2 w-36 h-12 border-dashed border-[#E61E4D] rounded-md p-4 flex items-center justify-center">
          <label className="cursor-pointer text-[#E61E4D] flex flex-nowrap items-center gap-1">
            <i className="ri-attachment-2 text-xl" />
            <span className="text-xs font-medium">Attach file</span>
            <input
              type="file"
              name="files"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
              multiple
              className="hidden"
            />
          </label>
        </div>
        {/* File Names and Previews */}
        {form.files.length > 0 && (
          <div className="mt-2 space-y-2">
            {form.files.map((file, index) => (
              <div key={index} className="flex items-center gap-2">
                <p className="text-sm text-gray-700 font-medium">{file.name}</p>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              {previews.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md border border-gray-300"
                />
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">Up to 5 mb (JPG, PNG, JPEG)</p>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-gradient-to-l from-pink-600 to-rose-600 text-white px-6 py-3 rounded-md text-sm hover:bg-pink-700"
        >
          Submit Request
        </button>
      </form>

      {/* Note */}
      <div className="bg-gray-50 border border-gray-200 mt-6 p-4 rounded-md text-sm text-gray-600 space-y-2">
        <p>1. You can expect a response from our support team within 1 business days.</p>
        <p>
          2. You may also find answers to common questions in our{" "}
          <a href="#" className="text-[#E61E4D] underline">
            Help Center
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default ContactSupport;