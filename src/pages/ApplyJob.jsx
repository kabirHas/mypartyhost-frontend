import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import BASE_URLS from "../config";

const ApplyJob = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const job = state?.job;

  
  // Initialize offer, duration, and currency from job data
  const initialOffer = job?.rateOffered ? parseFloat(job.rateOffered) : "";
  const initialDuration = job?.paymentType === "hourly" ? "hour" : "day";
  const currency = job?.currency ;

  const [offer, setOffer] = useState(initialOffer); // Changed from rate to offer
  const [duration, setDuration] = useState(initialDuration); // Changed from rateType to duration
  const [message, setMessage] = useState(""); // Changed from coverLetter to message
  // const [currency, setCurrency] = useState(initialCurrency); 
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!offer || isNaN(offer) || offer <= 0) {
      newErrors.offer = "Please enter a valid offer amount.";
    } else if (duration === "Per Hour" && offer < 50) {
      newErrors.offer = "Minimum offer is 50 per hour.";
    }
    if (!message.trim()) {
      newErrors.message = "Message is required.";
    } else if (message.length > 1000) {
      newErrors.message = "Message must be 1000 characters or less.";
    }
    if (!duration) {
      newErrors.duration = "Please select a duration.";
    }
    if (!currency) {
      newErrors.currency = "Currency is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  


  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  if (!validateForm()) return;

  setIsSubmitting(true);
  setSuccessMessage("");
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Decode token to get staff ID
    let staffId;
    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = atob(base64Payload);
      const payloadObj = JSON.parse(decodedPayload);
      staffId = payloadObj._id;
    } catch (err) {
      console.error("Error decoding token:", err);
      setErrors({ general: "Invalid token. Please log in again." });
      navigate("/login");
      return;
    }

    // Log what we're sending to the API
    // console.log("Submitting application:", {
    //   jobId: job?.id,
    //   payload: { job: job?.id, staff: staffId, offer: parseFloat(offer), message, duration, currency },
    //   token,
    // });

    const response = await axios.post(
      `${BASE_URLS.BACKEND_BASEURL}jobs/${job?.id}/apply`,
      {
        job: job?.id,
        staff: staffId,
        offer: parseFloat(offer),
        message,
        duration,
        currency,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200 || response.status === 201) {
      // console.log("Application successfully submitted for job ID:", job?.id);
      setSuccessMessage("Application submitted successfully!");
      setTimeout(() => navigate("/find-jobs"), 2000);
    } else {
      setErrors({ general: "Failed to submit application. Please try again." });
    }
  } catch (error) {
    console.error("Error submitting application:", error);
    console.error("Error details:", error.response?.data);
    if (error.response?.status === 401) {
      navigate("/login");
    } else if (error.response?.status === 404) {
      setErrors({ general: "Job not found. Please check the job ID." });
    } else if (error.response?.status === 400) {
      setErrors({ general: "Invalid application data. Please check your inputs." });
    } else {
      setErrors({ general: "Error submitting application. Please try again." });
    }
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="self-stretch p-12 w-full bg-[#f9f9f9] inline-flex justify-center items-start gap-2.5">
      <div className="w-[800px] max-w-[800px] mx-auto  inline-flex flex-col justify-start items-start gap-6 ">
        <button
          className="px-3 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <i className="ri-arrow-left-line text-xl text-[#656565]"></i>
          <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
            Back
          </div>
        </button>

        {/* Job Details */}
        <div className="self-stretch flex flex-col justify-start items-start gap-8">
          <div className="self-stretch p-6 bg-[#FFFFFF] rounded-3xl flex flex-col justify-start items-start gap-8">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="self-stretch inline-flex justify-start items-start gap-6">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                      <h1 className="self-stretch justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                        {job?.title}
                      </h1>
                      <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        {job?.category}
                      </p>
                    </div>
                    <p className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                      {job?.rate}
                    </p>
                  </div>
                  <p className="self-stretch justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                    Positions Available: {job?.numberOfPositions}
                  </p>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-6 flex-wrap content-center">
                  <div className="flex justify-start items-center gap-2">
                    <i className="ri-map-pin-line text-xl text-[#656565]"></i>

                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      {job?.location}
                    </span>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <i className="ri-calendar-check-line text-xl text-[#656565]"></i>
                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      {job?.datetime.split("|")[0]}
                    </span>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <i className="ri-time-line text-xl text-[#656565]"></i>
                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      {job?.datetime.split("|")[1]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                {job?.description}
              </p>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className=" flex flex-col justify-start items-start gap-3">
                <p className="self-stretch justify-start text-[#3D3D3D] capitalize mb-0 text-base font-normal font-['Inter'] leading-snug">
                  Gender : {job?.gender}
                </p>
                <div className=" w-full flex items-center gap-2">
                  <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    Travel Compensation
                  </div>
                  <i className="ri-checkbox-circle-fill text-xl text-[#E61E4D]"></i>
                </div>
              </div>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <p className="self-stretch justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                Event Organizer
              </p>
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <img
                  className="w-12 h-12 rounded-full"
                  src={job?.organiser?.profileImage || 'https://placehold.co/48x48'}
                  alt={`${job?.organiser?.name || "Organizer"}'s profile picture`}
                />
                <div className=" inline-flex flex-col justify-start items-start ">
                  <p className="self-stretch mb-0 justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                    {job?.organiser?.name || "Unknown Organizer"}
                  </p>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <i className="ri-map-pin-line text-sm text-[#656565]"></i>
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      {job?.organiser?.city && job?.organiser?.country
                      ? `${job.organiser.city}, ${job.organiser.country}`
                      : job?.location || "Location not specified"}
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <i className="ri-star-fill text-sm text-[#FF8915]"></i>

                      <div className="justify-start text-orange-500 text-sm font-medium font-['Inter'] leading-tight">
                        {job?.organiser?.rating || "0"}
                      </div>
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                      ({job?.organiser?.reviews?.length || 0} Reviews)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Apply Form */}
          <div className="self-stretch p-6 bg-[#FFFFFF] rounded-3xl flex flex-col justify-start items-start gap-8">
            <h2 className="self-stretch justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
              Apply for This Job
            </h2>
            {successMessage && (
              <div className="w-full p-4 bg-green-100 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}
            {errors.general && (
              <div className="w-full p-4 bg-red-100 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}
            <div className="self-stretch flex flex-col justify-start items-start gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                    Your Rate
                  </label>

                  <div className="w-60 h-10 flex rounded-lg overflow-hidden outline outline-1 outline-gray-200 text-[#3D3D3D]">
                    <div className="flex items-center px-3 bg-white border-r border-gray-200">
                      <span className="text-base font-medium font-['Inter']">
                        {currency}
                      </span>
                      <input
                        type="number"
                        value={offer}
                        onChange={(e) => setOffer(e.target.value)}
                        className="w-full pl-2 outline-none bg-transparent text-base text-[#3D3D3D] font-['Inter']"
                        min="0"
                        step="0.01"
                        placeholder="Enter rate"
                      />
                    </div>

                    <div className="flex items-center justify-between px-3 bg-[#F5F5F5] flex-1 relative">
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="appearance-none bg-transparent outline-none w-full pr-6 text-base font-normal font-['Inter']"
                      >
                        <option value="hour">Per Hour</option>
                        <option value="day">Per Day</option>
                      </select>
                      <i className="ri-arrow-down-s-line absolute right-3 text-[#656565] text-sm pointer-events-none"></i>
                    </div>
                  </div>
                  {errors.offer && (
                    <p className="text-red-500 text-xs font-normal font-['Inter'] leading-none">
                      {errors.offer}
                    </p>
                  )}

                  <p className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                     {/* Minimum {currency}50/h */}
                     Minimum {currency}50/{duration === "hour" ? "h" : "day"}
                  </p>
                </div>
                <div
                  data-property-1="default"
                  data-show-icons="false"
                  data-show-instruction-message="true"
                  className="self-stretch h-52 flex flex-col justify-start items-start gap-2"
                >
                  <div className="self-stretch inline-flex justify-start items-center gap-3">
                    <label className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Cover Letter
                    </label>
                    <div className="justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                      Max 1000 ch
                    </div>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    maxLength={1000}
                    placeholder="Write a short note about why you're a great fit for this role. Please do not share contact details or social media accounts."
                    className="w-full h-800 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 text-sm font-normal text-gray-700 placeholder-gray-400 font-['Inter']"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs font-normal font-['Inter'] leading-none">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>
              <div onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(errors).length > 0}
                className={`px-6 py-3 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden 
                  ${
                  isSubmitting || Object.keys(errors).length > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-l from-pink-600 to-rose-600"
                }`}>
                <div className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
