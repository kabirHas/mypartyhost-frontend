import React, { useState } from "react";
import { Link } from "react-router-dom";

const CreateEventMultiStepForm = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    jobTitle: "",
    jobDescription: "",
    jobDate: "",
    startTime: "",
    duration: "",
    endTime: "",
    country: "",
    city: "",
    suburb: "",
    staffCategory: "",
    payType: "",
    rateOffered: "",
    travelAllowance: "",
    currency: "",
    lookingFor: "",
    numberOfPositions: "",
    currency: "AUD",
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle final form submission
    console.log("Submitted Data:", formData);
    alert("Form submitted successfully!");
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-[#f9f9f9] w-full">
      <div className="max-w-[1200px] p-4 py-12 min-h-screen mx-auto">
        <Link
          className="px-3 py-2 rounded-full border border-zinc-300 text-sm text-zinc-900 flex place-content-center gap-2 w-fit no-underline bg-white"
          to="/dashboard"
        >
          <i className="ri-arrow-left-line"></i>Back
        </Link>

        {/* <h1 className="text-2xl font-semibold mt-8">Step {step} of 4</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>} */}

        <form className="w-full mt-8" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="self-stretch my-4 inline-flex flex-col justify-start items-start gap-1">
                <div className="self-stretch justify-start text-black text-3xl font-medium font-['Inter'] leading-9 tracking-tight">
                  Post an Event
                </div>
                <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Fill in the details and find the perfect staff for your
                  event—fast and hassle-free!
                </div>
              </div>
              <div className="justify-start my-4 text-black text-2xl font-bold font-['Inter'] leading-7">Job Details: 1/5</div>
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
                <label
                  htmlFor="staffCategory"
                  className="text-zinc-600 text-md"
                >
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
                <label
                  className="text-zinc-600 text-md"
                  htmlFor="numberOfPositions"
                >
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
                  rows="5"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  placeholder="Enter the job description"
                  maxLength="500"
                  required
                ></textarea>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                2. Date, Time & Duration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="jobDate"
                  className="p-2 border rounded"
                  value={formData.jobDate}
                  onChange={handleInputChange}
                />
                <input
                  type="time"
                  name="startTime"
                  className="p-2 border rounded"
                  value={formData.startTime}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g., 4 hours)"
                  className="p-2 border rounded"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
                <input
                  type="time"
                  name="endTime"
                  className="p-2 border rounded"
                  value={formData.endTime}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                3. Location & Preferences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="p-2 border rounded"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="suburb"
                  placeholder="Suburb"
                  className="p-2 border rounded"
                  value={formData.suburb}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="lookingFor"
                  placeholder="Looking For (e.g., Bartenders)"
                  className="p-2 border rounded col-span-1 md:col-span-2"
                  value={formData.lookingFor}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-xl font-semibold mb-4">4. Pay</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="payType"
                  className="p-2 border rounded"
                  value={formData.payType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Pay Type</option>
                  <option value="hourly">Hourly</option>
                  <option value="fixed">Fixed</option>
                </select>
                <input
                  type="text"
                  name="rateOffered"
                  placeholder="Rate Offered"
                  className="p-2 border rounded"
                  value={formData.rateOffered}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="travelAllowance"
                  placeholder="Travel Allowance"
                  className="p-2 border rounded"
                  value={formData.travelAllowance}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div className="flex justify-end mt-12">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] mr-5 text-[#e61e4d] inline-flex justify-center items-center gap-2 overflow-hidden"
              >
                Previous
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg px-5 py-2 text-white"
              >
                Next
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                className="bg-pink-600 text-white px-5 py-2 rounded-md"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventMultiStepForm;
