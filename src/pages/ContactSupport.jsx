import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ContactSupport() {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "",
    category: "",
    subCategory: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Request Submitted ✅");
    // Add API submit logic here
  };

  return (
    <div className=" mx-auto  py-6">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 mb-4 flex items-center">
        <i className="ri-arrow-left-line mr-1 text-lg" />
        Back
      </button>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="justify-start text-[#292929] text-3xl font-medium font-['Inter'] leading-9 tracking-tigh">Contact Support</h1>
          <p className="text-sm  text-[#3D3D3D] mt-1">
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
              name="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          {form.file && (
              <p className="text-sm text-gray-700 mt-1 font-medium">{form.file.name}</p>
            )}
        </div>
            <p className="text-xs text-gray-500 mt-2">Up to 5 mb (JPG, PNG, JPEG)</p>

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