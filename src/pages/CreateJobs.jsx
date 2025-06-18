import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BASE_URLS from "../config";
import axios from "axios";

function CreateJobs() {
  const navigate = useNavigate();

  // State to manage form data
  const [formData, setFormData] = useState({
    eventName: "",
    jobTitle: "",
    jobDescription: "",
    country: "",
    currency: "AUD",
    staffCategory: "",
    numberOfPositions: "",
    jobDate: "",
    startTime: "",
    duration: "",
    city: "",
    suburb: "",
    lookingFor: "female",
    paymentType: "fixed",
    rateOffered: "",
    travelAllowance: "none",
  });

  // State for calculated endTime
  const [endTime, setEndTime] = useState("");
  // State for error messages
  const [error, setError] = useState("");

  // Calculate endTime whenever startTime or duration changes
  useEffect(() => {
    if (formData.startTime && formData.duration) {
      const start = new Date(`1970-01-01T${formData.startTime}:00`);
      const durationHours = parseFloat(formData.duration);
      if (!isNaN(durationHours)) {
        const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
        const hours = end.getHours().toString().padStart(2, "0");
        const minutes = end.getMinutes().toString().padStart(2, "0");
        setEndTime(`${hours}:${minutes}`);
      } else {
        setEndTime("");
      }
    } else {
      setEndTime("");
    }
  }, [formData.startTime, formData.duration]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id || name]: value,
    }));
    setError(""); // Clear error on input change
  };

  // Validate form data
  const validateForm = () => {
    const requiredFields = [
      { field: formData.eventName, name: "Event Name" },
      { field: formData.jobTitle, name: "Job Title" },
      { field: formData.jobDescription, name: "Job Description" },
      { field: formData.country, name: "Country" },
      { field: formData.staffCategory, name: "Staff Category" },
      { field: formData.numberOfPositions, name: "Number of Positions" },
      { field: formData.jobDate, name: "Event Date" },
      { field: formData.startTime, name: "Start Time" },
      { field: formData.duration, name: "Duration" },
      { field: formData.city, name: "City" },
      { field: formData.paymentType, name: "Payment Type" },
      { field: formData.rateOffered, name: "Rate Offered" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field) {
        return `${name} is required.`;
      }
    }
    return "";
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const jobData = {
      eventName: formData.eventName,
      jobTitle: formData.jobTitle,
      jobDescription: formData.jobDescription,
      country: formData.country,
      currency: formData.currency,
      staffCategory: formData.staffCategory,
      numberOfPositions: parseInt(formData.numberOfPositions),
      jobDate: formData.jobDate,
      startTime: formData.startTime,
      duration: parseFloat(formData.duration),
      city: formData.city,
      suburb: formData.suburb,
      lookingFor: formData.lookingFor,
      paymentType: formData.paymentType,
      rateOffered: parseFloat(formData.rateOffered),
      travelAllowance: formData.travelAllowance,
      requiredSkills: [],
    };
    console.log("Job Data:", jobData);

    axios
      .post(`${BASE_URLS.BACKEND_BASEURL}jobs`, jobData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data && res.data.job) {
          console.log("Job created successfully:", res.data.job);
          navigate(`/jobs/${res.data.job._id}`);
        } else {
          setError(res.data.message || "Error creating job.");
        }
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "An error occurred. Please try again.";
        setError(errorMessage);
        console.error("Error creating job:", err);
      });
  };

  return (
    <div className="bg-[#f9f9f9] w-full">
      <div className="max-w-[1200px] p-4 py-12 min-h-screen mx-auto">
        <Link
          className="px-3 py-2 rounded-full border border-zinc-300 text-sm text-zinc-900 flex place-content-center gap-2 w-fit no-underline bg-white"
          to="/dashboard"
        >
          <i className="ri-arrow-left-line"></i>Back
        </Link>
        <h1 className="text-2xl font-semibold mt-8">1. Event and Job Details</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form className="w-full mt-8" onSubmit={handleSubmit}>
          {/* Country */}
          <div className="relative mb-6">
            <label htmlFor="country" className="text-zinc-600 text-md">
              Country
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
              required
            >
              <option value="">Select a country</option>
              <option value="Australia">Australia</option>
              <option value="AF">Afghanistan</option>
              <option value="AX">Åland Islands</option>
              <option value="AL">Albania</option>
              <option value="DZ">Algeria</option>
              <option value="AS">American Samoa</option>
            </select>
            <span className="absolute -right-3 top-[55%] bg-white -translate-x-1/2 border border-zinc-300 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>
          {/* Currency */}
          <div className="mb-6">
            <label className="text-zinc-600 text-md" htmlFor="currency">
              Currency
            </label>
            <div className="flex items-center mt-2 px-3 py-2 border border-zinc-300 w-fit rounded-md font-semibold">
              {formData.currency}
            </div>
          </div>
          {/* Staff Category */}
          <div className="relative mb-6">
            <label htmlFor="staffCategory" className="text-zinc-600 text-md">
              Staff Category
            </label>
            <select
              id="staffCategory"
              value={formData.staffCategory}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
              required
            >
              <option value="">Choose the type of staff</option>
              <option value="Dealer">Dealer</option>
              <option value="Waiter">Waiter</option>
              <option value="Bartender">Bartender</option>
              <option value="Event Hostess">Event Hostess</option>
              <option value="Security">Security</option>
            </select>
            <span className="absolute -right-3 top-[55%] bg-white -translate-x-1/2 border border-zinc-300 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>
          {/* Number of Positions */}
          <div className="mb-6">
            <label className="text-zinc-600 text-md" htmlFor="numberOfPositions">
              Number of Positions
            </label>
            <input
              type="number"
              id="numberOfPositions"
              value={formData.numberOfPositions}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
              placeholder="Enter how many staff you need"
              required
              min="1"
            />
          </div>
          {/* Event Name */}
          <div className="mb-6">
            <label className="text-zinc-600 text-md" htmlFor="eventName">
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
              placeholder="Enter your Event Name"
              required
            />
          </div>
          {/* Job Title */}
          <div className="mb-6">
            <label className="text-zinc-600 text-md" htmlFor="jobTitle">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
              placeholder="Enter your Job Title"
              required
            />
          </div>
          {/* Job Description */}
          <div className="mb-6">
            <div className="flex justify-between">
              <label className="text-zinc-600 text-md" htmlFor="jobDescription">
                Job Description
              </label>
              <span className="text-zinc-600 text-sm">Max 500 ch</span>
            </div>
            <textarea
              id="jobDescription"
              rows="5"
              value={formData.jobDescription}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
              placeholder="Enter the job description"
              maxLength="500"
              required
            ></textarea>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight my-8">
            2. Date, Time and Duration
          </h1>
          <div className="mb-6">
            <label htmlFor="jobDate" className="text-zinc-600 text-md">
              Event Date
            </label>
            <input
              type="date"
              id="jobDate"
              value={formData.jobDate}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
              required
            />
            <div className="mb-6 flex align-center justify-between mt-2">
              <div className="w-1/2 pr-2">
                <label htmlFor="startTime" className="text-zinc-600 text-md">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  required
                />
              </div>
              <div className="w-1/2 pl-2">
                <label htmlFor="duration" className="text-zinc-600 text-md">
                  Duration
                </label>
                <input
                  type="number"
                  id="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  placeholder="Duration (hours)"
                  step="0.5"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <label htmlFor="endTime" className="text-zinc-600 text-md">
                  End Time
                </label>
                <span className="text-zinc-600 text-sm">
                  End time calculated automatically
                </span>
              </div>
              <input
                type="time"
                id="endTime"
                value={endTime}
                className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                disabled
              />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight my-8">
            3. Location & Preferences
          </h1>
          {/* City */}
          <div className="mb-6 relative">
            <label htmlFor="city" className="text-zinc-600 text-md">
              City
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
              placeholder="City"
              required
            />
            <i className="ri-map-pin-line absolute top-1/2 transform -translate-x-1/2 text-xl right-3 text-zinc-400" />
          </div>
          {/* Suburb */}
          <div className="mb-6">
            <label htmlFor="suburb" className="text-zinc-600 text-md">
              Suburb
            </label>
            <input
              type="text"
              id="suburb"
              value={formData.suburb}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
              placeholder="Suburb"
            />
          </div>
          {/* Looking For */}
          <div className="mb-6">
            <label className="text-zinc-600 text-md">Looking For</label>
            <div className="flex items-center space-x-6 mt-5">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="lookingFor"
                  value="male"
                  checked={formData.lookingFor === "male"}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-pink-600"
                />
                <span className="text-gray-700">Male</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="lookingFor"
                  value="female"
                  checked={formData.lookingFor === "female"}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-pink-600"
                />
                <span className="text-gray-700">Female</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="lookingFor"
                  value="any"
                  checked={formData.lookingFor === "any"}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-pink-600"
                />
                <span className="text-gray-700">Any</span>
              </label>
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight my-8">4. Pay</h1>
          {/* Pay Rate */}
          <div className="mb-6">
            <label className="text-zinc-600 text-md">Pay Rate</label>
            <div className="flex items-center space-x-6 mt-5">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentType"
                  value="hourly"
                  checked={formData.paymentType === "hourly"}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-pink-600"
                />
                <span className="text-gray-700">Hourly</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentType"
                  value="fixed"
                  checked={formData.paymentType === "fixed"}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-pink-600"
                />
                <span className="text-gray-700">Fixed</span>
              </label>
            </div>
          </div>
          {/* Rate Offered */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <label htmlFor="rateOffered" className="text-zinc-600 text-md">
                Rate Offered
              </label>
              <span className="text-zinc-600 text-sm">
                Minimum rates apply to ensure fair pay
              </span>
            </div>
            <input
              type="number"
              id="rateOffered"
              value={formData.rateOffered}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
              required
              min="0"
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight my-8">5. Travel</h1>
          <div className="mb-6">
            <div className="flex flex-col gap-3 mt-5">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="travelAllowance"
                  value="none"
                  checked={formData.travelAllowance === "none"}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-pink-600"
                />
                <span className="text-gray-900 font-semibold text-lg">
                  No Allowance
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="travelAllowance"
                  value="uber"
                  checked={formData.travelAllowance === "uber"}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-pink-600"
                />
                <span className="text-gray-900 font-semibold text-lg">Uber</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="travelAllowance"
                  value="50"
                  checked={formData.travelAllowance === "50"}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-pink-600"
                />
                <span className="text-gray-900 font-semibold text-lg">$50</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="travelAllowance"
                  value="100"
                  checked={formData.travelAllowance === "100"}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-pink-600"
                />
                <span className="text-gray-900 font-semibold text-lg">$100</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="travelAllowance"
                  value="150"
                  checked={formData.travelAllowance === "150"}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-pink-600"
                />
                <span className="text-gray-900 font-semibold text-lg">$150</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-pink-600 font-semibold text-white rounded-lg hover:bg-pink-700 transition-colors duration-200"
            >
              Create Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobs;