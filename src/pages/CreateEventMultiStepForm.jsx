import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CreateEventMultiStepForm = () => {
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

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [endTime, setEndTime] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Handle input changes for text, number, select, and radio inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Calculate end time based on start time and duration
  useEffect(() => {
    if (formData.startTime && formData.duration) {
      const start = new Date(`1970-01-01T${formData.startTime}:00`);
      const durationHours = parseFloat(formData.duration);
      if (!isNaN(durationHours) && durationHours > 0) {
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

  // Validate fields for the current step
  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.staffCategory)
        newErrors.staffCategory = "Staff category is required";
      if (!formData.numberOfPositions || formData.numberOfPositions < 1)
        newErrors.numberOfPositions = "Number of positions must be at least 1";
      if (!formData.eventName) newErrors.eventName = "Event name is required";
      if (!formData.jobTitle) newErrors.jobTitle = "Job title is required";
      if (!formData.jobDescription)
        newErrors.jobDescription = "Job description is required";
    } else if (step === 2) {
      if (!formData.jobDate) newErrors.jobDate = "Event date is required";
      if (!formData.startTime) newErrors.startTime = "Start time is required";
      if (!formData.duration || formData.duration <= 0)
        newErrors.duration = "Duration must be greater than 0";
    } else if (step === 3) {
      if (!formData.city) newErrors.city = "City is required";
    } else if (step === 4) {
      if (!formData.rateOffered || formData.rateOffered <= 0)
        newErrors.rateOffered = "Rate offered must be greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log("Submitted Data:", formData);
      alert("Form submitted successfully!");
    } else {
      alert("Please fill in all required fields correctly.");
    }
  };

  // Move to the next step
  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  // Move to the previous step
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Handle preview button click
  const handlePreview = () => {
    if (validateStep()) {
      setIsPreviewOpen(true);
    } else {
      alert("Please fill in all required fields correctly before previewing.");
    }
  };

  // Close preview popup
  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <div className="bg-[#f9f9f9] w-full">
      <div className="max-w-[1200px] p-4 py-12 min-h-screen mx-auto">
        <Link
          className="px-3 py-2 rounded-full mt-8 border border-zinc-300 text-sm text-zinc-900 flex place-content-center gap-2 w-fit no-underline bg-white"
          to="/dashboard"
        >
          <i className="ri-arrow-left-line"></i>Back
        </Link>
        <form className="w-full mt-8" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="self-stretch my-2 inline-flex flex-col justify-start items-start gap-1">
                <div className="self-stretch justify-start text-black text-3xl font-medium font-['Inter'] leading-9 tracking-tight">
                  Post an Event
                </div>
                <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Fill in the details and find the perfect staff for your
                  event—fast and hassle-free!
                </div>
              </div>
              <div className="justify-start my-4 text-black text-2xl font-bold font-['Inter'] leading-7">
                Job Details: 1/5
              </div>
              {/* Country */}
              <div className="relative mb-6">
                <label htmlFor="country" className="text-zinc-600 text-md">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  required
                >
                  <option value="">Select a country</option>
                  <option value="Australia">Australia</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Åland Islands">Åland Islands</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="American Samoa">American Samoa</option>
                </select>
                {errors.country && (
                  <span className="text-red-500 text-sm">{errors.country}</span>
                )}
                <span className="absolute -right-3 top-[42%] bg-white -translate-x-1/2 border border-zinc-300 rounded-full p-1">
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
                <label
                  htmlFor="staffCategory"
                  className="text-zinc-600 text-md"
                >
                  Staff Category
                </label>
                <select
                  id="staffCategory"
                  name="staffCategory"
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
                {errors.staffCategory && (
                  <span className="text-red-500 text-sm">
                    {errors.staffCategory}
                  </span>
                )}
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
                <label
                  className="text-zinc-600 text-md"
                  htmlFor="numberOfPositions"
                >
                  Number of Positions
                </label>
                <input
                  type="number"
                  id="numberOfPositions"
                  name="numberOfPositions"
                  value={formData.numberOfPositions}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  placeholder="Enter how many staff you need"
                  required
                  min="1"
                />
                {errors.numberOfPositions && (
                  <span className="text-red-500 text-sm">
                    {errors.numberOfPositions}
                  </span>
                )}
              </div>
              {/* Event Name */}
              <div className="mb-6">
                <label className="text-zinc-600 text-md" htmlFor="eventName">
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  placeholder="Enter your Event Name"
                  required
                />
                {errors.eventName && (
                  <span className="text-red-500 text-sm">
                    {errors.eventName}
                  </span>
                )}
              </div>
              {/* Job Title */}
              <div className="mb-6">
                <label className="text-zinc-600 text-md" htmlFor="jobTitle">
                  Job Title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  placeholder="Enter your Job Title"
                  required
                />
                {errors.jobTitle && (
                  <span className="text-red-500 text-sm">
                    {errors.jobTitle}
                  </span>
                )}
              </div>
              {/* Job Description */}
              <div className="mb-6">
                <div className="flex justify-between">
                  <label
                    className="text-zinc-600 text-md"
                    htmlFor="jobDescription"
                  >
                    Job Description
                  </label>
                  <span className="text-zinc-600 text-sm">Max 500 ch</span>
                </div>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows="5"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  placeholder="Enter the job description"
                  maxLength="500"
                  required
                ></textarea>
                {errors.jobDescription && (
                  <span className="text-red-500 text-sm">
                    {errors.jobDescription}
                  </span>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="justify-start my-5 text-black text-2xl font-bold font-['Inter'] leading-7">
                Date, Time and Duration: 2/5
              </div>
              <div className="mb-6">
                <label htmlFor="jobDate" className="text-zinc-600 text-md">
                  Event Date
                </label>
                <input
                  type="date"
                  id="jobDate"
                  name="jobDate"
                  value={formData.jobDate}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  required
                />
                {errors.jobDate && (
                  <span className="text-red-500 text-sm">{errors.jobDate}</span>
                )}
              </div>
              <div className="mb-6 flex align-center justify-between mt-2">
                <div className="w-1/2 pr-2">
                  <label htmlFor="startTime" className="text-zinc-600 text-md">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                    required
                  />
                  {errors.startTime && (
                    <span className="text-red-500 text-sm">
                      {errors.startTime}
                    </span>
                  )}
                </div>
                <div className="w-1/2 pl-2">
                  <label htmlFor="duration" className="text-zinc-600 text-md">
                    Duration
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                    placeholder="Duration (hours)"
                    step="0.5"
                    min="0"
                    required
                  />
                  {errors.duration && (
                    <span className="text-red-500 text-sm">
                      {errors.duration}
                    </span>
                  )}
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
            </>
          )}

          {step === 3 && (
            <>
              <div className="justify-start my-4 text-black text-2xl font-bold font-['Inter'] leading-7">
                Event Location: 3/5
              </div>
              {/* City */}
              <div className="mb-6 relative">
                <label htmlFor="city" className="text-zinc-600 text-md">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  placeholder="City"
                  required
                />
                {errors.city && (
                  <span className="text-red-500 text-sm">{errors.city}</span>
                )}
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
                  name="suburb"
                  value={formData.suburb}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  placeholder="Suburb"
                />
              </div>
              {/* Looking For */}
              <div className="mb-6">
                <label className="text-zinc-600 text-md">Looking For</label>
                <div className="flex items-center space-x-6 mt-3">
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
            </>
          )}

          {step === 4 && (
            <>
              <div className="justify-start my-4 text-black text-2xl font-bold font-['Inter'] leading-7">
                Pay: 4/5
              </div>
              {/* Pay Rate */}
              <div className="mb-6">
                <label className="text-zinc-600 text-md">Pay Rate</label>
                <div className="flex items-center space-x-6 mt-3">
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
                  <label
                    htmlFor="rateOffered"
                    className="text-zinc-600 text-md"
                  >
                    Rate Offered
                  </label>
                  <span className="text-zinc-600 text-sm">
                    Minimum rates apply to ensure fair pay
                  </span>
                </div>
                <input
                  type="number"
                  id="rateOffered"
                  name="rateOffered"
                  value={formData.rateOffered}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  required
                  min="0"
                />
                {errors.rateOffered && (
                  <span className="text-red-500 text-sm">
                    {errors.rateOffered}
                  </span>
                )}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div className="justify-start text-black text-2xl font-bold font-['Inter'] leading-7">Travel: 5/5</div>
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
                    <span className="justify-start text-black text-base font-medium font-['Inter'] leading-snug">
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
                    <span className="justify-start text-black text-base font-medium font-['Inter'] leading-snug">
                      Uber
                    </span>
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
                    <span className="justify-start text-black text-base font-medium font-['Inter'] leading-snug">
                      $50
                    </span>
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
                    <span className="justify-start text-black text-base font-medium font-['Inter'] leading-snug">
                      $100
                    </span>
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
                    <span className="justify-start text-black text-base font-medium font-['Inter'] leading-snug">
                      $150
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end mt-12">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 rounded-lg outline outline-1 font-semibold outline-offset-[-1px] outline-[#E61E4D] mr-5 text-[#e61e4d] inline-flex justify-center items-center gap-2 overflow-hidden"
              >
                Previous
              </button>
            )}
            {step < 5 && (
              <button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-l from-pink-600 to-rose-600 font-semibold rounded-lg px-6 py-3 text-white select-none"
              >
                Next
              </button>
            )}
            {step === 5 && (
              <button
                type="button"
                onClick={handlePreview}
                className="px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden mr-4 text-[#e61e4d] font-semibold"
              >
                Preview Job
              </button>
            )}
            {step === 5 && (
              <button
                type="submit"
                className="bg-gradient-to-l from-pink-600 to-rose-600 font-semibold rounded-lg px-5 py-2 text-white"
              >
                Submit
              </button>
            )}
          </div>
        </form>

        {/* Preview Popup */}
        {isPreviewOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closePreview}
          >
            <div
              className="w-[800px] p-6 bg-white rounded-2xl inline-flex flex-col justify-start items-start gap-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="justify-start text-black text-base font-bold font-['Inter'] leading-snug">
                  Job Details
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                  <div className="self-stretch justify-start text-gray-600 text-base font-normal font-['Inter'] leading-snug">
                    {formData.jobDescription || "No description provided."}
                  </div>
                  <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch justify-start text-gray-600 text-base font-medium font-['Inter'] leading-snug">
                      Positions Available: {formData.numberOfPositions || "N/A"}
                    </div>
                    <div className="self-stretch inline-flex justify-start items-center gap-6 flex-wrap content-center">
                      <div className="flex justify-start items-center gap-2">
                      <i className="ri-map-pin-2-fill BG-ZINC-800 text-lg"></i>
                        <div className="justify-start text-gray-600 text-base font-normal font-['Inter'] leading-snug">
                          {formData.suburb
                            ? `${formData.suburb}, ${formData.city}, ${formData.country}`
                            : formData.city
                            ? `${formData.city}, ${formData.country}`
                            : formData.country || "N/A"}
                        </div>
                      </div>
                      <div className="flex justify-start items-center gap-2">
                      <i className="ri-calendar-check-fill text-zinc-800 text-lg"></i>
                        <div className="justify-start text-gray-600 text-base font-normal font-['Inter'] leading-snug">
                          {formData.jobDate || "N/A"}
                        </div>
                      </div>
                      <div className="flex justify-start items-center gap-2">
                      <i className="ri-time-fill text-zinc-800 text-lg"></i>
                        <div className="justify-start text-gray-600 text-base font-normal font-['Inter'] leading-snug">
                          {formData.startTime && endTime
                            ? `${formData.startTime} – ${endTime}`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch justify-start text-gray-600 text-base font-medium font-['Inter'] leading-snug">
                      Pay & Perks
                    </div>
                    <div className="self-stretch inline-flex justify-start items-center gap-6 flex-wrap content-center">
                      <div className="flex justify-start items-center gap-2">
                      <i className="ri-money-dollar-circle-fill text-zinc-800 text-lg"></i>
                        <div className="justify-start text-gray-600 text-base font-normal font-['Inter'] leading-snug">
                          {formData.rateOffered
                            ? `${formData.currency} ${formData.rateOffered}/${
                                formData.paymentType === "hourly" ? "H" : "Fixed"
                              }`
                            : "N/A"}
                        </div>
                      </div>
                      <div className="flex justify-start items-center gap-2">
                      <i className="ri-taxi-fill text-zinc-800 text-lg"></i>
                        <div className="justify-start text-gray-600 text-base font-normal font-['Inter'] leading-snug">
                          {formData.travelAllowance === "none"
                            ? "No Allowance"
                            : formData.travelAllowance === "uber"
                            ? "Uber"
                            : `${formData.currency} ${formData.travelAllowance}`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
                  <div className="w-44 flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch justify-start text-gray-600 text-base font-normal font-['Inter'] leading-snug">
                      Gender: {formData.lookingFor.charAt(0).toUpperCase() + formData.lookingFor.slice(1) || "N/A"}
                    </div>
                    <div className="self-stretch justify-start text-gray-600 text-base font-normal font-['Inter'] leading-snug">
                      Job Type: {formData.staffCategory || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch py-4 inline-flex justify-end items-center gap-4">
                <button
                  className="px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#e61e4d] flex justify-center items-center gap-2 overflow-hidden"
                  onClick={closePreview}
                >
                  <div className="justify-start text-[#E61E4D]  text-base font-medium font-['Inter'] leading-snug">
                    Edit
                  </div>
                </button>
                <button
                  className="px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden"
                  onClick={handleSubmit}
                >
                  <div className="justify-start text-white text-base font-medium font-['Inter'] leading-snug">
                    Post Job
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEventMultiStepForm;