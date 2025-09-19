import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URLS from "../config";

function InvitesReceived() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState(null);
  const [showCounterOfferPopup, setShowCounterOfferPopup] = useState(false);
  const [counterOfferRate, setCounterOfferRate] = useState("");
  const [rateType, setRateType] = useState("perHour");
  const [coverLetter, setCoverLetter] = useState("");

  // Function to transform API data to match location.state.booking structure
  const transformApiData = (apiData) => {
    const job = apiData.job;
    const organiser = job.organiser;
    return {
      id: apiData._id,
      jobId: job._id,
      title: job.eventName,
      role: job.jobTitle,
      eventType: job.eventName,
      rate: `${job.currency} ${job.rateOffered}/ fixed`,
      location: `${job.suburb}, ${job.city}`,
      date: new Date(job.jobDate).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: `${job.startTime} - ${new Date(new Date(job.jobDate).setHours(
        new Date(job.jobDate).getHours() + job.duration
      )).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      duration: `${job.duration} hours`,
      description: apiData.message || "No additional description provided.",
      status: apiData.status.charAt(0).toUpperCase() + apiData.status.slice(1),
      statusColor: "bg-orange-200",
      paymentInfo: {
        currency: job.currency,
        totalHours: `${job.duration}`,
        eventFee: `${job.currency} ${job.rateOffered}`,
        bookingFee: `${job.currency} ${Math.round(job.rateOffered * 0.1)}`,
        paidToHostess: `${job.currency} ${Math.round(job.rateOffered * 0.9)}`,
      },
      organizer: {
        _id: organiser._id,
        name: organiser.name,
        email: organiser.email,
        phone: organiser.phone,
        city: organiser.city,
        country: organiser.country,
        image: organiser.profileImage,
        rating: organiser.reviews?.reduce((acc, curr) => acc + curr.rating, 0) / organiser.reviews?.length || "N/A",
        reviews: organiser.reviews?.length || 0,
      },
      message: apiData.message,
    };
  };

  // Fetch invite data if booking is not available
  async function getInviteData() {
    if (booking && booking.id === id) return; // Skip if valid booking exists
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/user/invite/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const transformedData = transformApiData(response.data);
      setBooking(transformedData);
      setError(null);
    } catch (error) {
      console.error("Error fetching invite data:", error);
      setError("Failed to load invite data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getInviteData();
  }, [id]);

  if (loading) {
    return <div className="p-4 text-[#292929] text-xl font-bold font-['Inter']">Loading...</div>;
  }

  if (error || !booking || booking.id !== id) {
    return (
      <div className="p-4 text-[#292929] text-xl font-bold font-['Inter']">
        {error || "Invite not found"}
      </div>
    );
  }

  const handleDeclineInvitation = async () => {
    try {
      await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}jobs/invitation/${id}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error declining invitation:", error);
      alert("Failed to decline invitation. Please try again.");
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}jobs/invitation/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      alert("Failed to accept invitation. Please try again.");
    }
  };

  const handleCounterOffer = () => {
    setShowCounterOfferPopup(true);
  };

  const confirmCounterOffer = async () => {
    const jobId = booking.jobId || id;
    if (!jobId) {
      console.error("Job ID is undefined:", booking);
      alert("Unable to submit counter offer. Job ID is missing.");
      return;
    }
    const apiUrl = `${BASE_URLS.BACKEND_BASEURL}jobs/${jobId}/apply`;
    const payload = {
      jobId,
      staffId: localStorage.getItem("userId") || "authenticatedUserId",
      offer: {
        rate: parseFloat(counterOfferRate) || parseFloat(booking.rate.replace(`${booking.paymentInfo.currency}`, "").trim()),
        type: rateType,
        eventFee: booking.paymentInfo.eventFee || `${booking.paymentInfo.currency} 0`,
        bookingFee: booking.paymentInfo.bookingFee || `${booking.paymentInfo.currency} ${Math.round(parseFloat(booking.paymentInfo.eventFee.replace(`${booking.paymentInfo.currency}`, "")) * 0.1)}`,
        paidToHostess: booking.paymentInfo.paidToHostess || `${booking.paymentInfo.currency} ${Math.round(parseFloat(booking.paymentInfo.eventFee.replace(`${booking.paymentInfo.currency}`, "")) * 0.9)}`,
        currency: booking.paymentInfo.currency,
      },
      message: coverLetter || "No cover letter provided",
      duration: parseInt(booking.duration) || 0,
    };

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Counter offer submitted:", response.data);
      setShowCounterOfferPopup(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting counter offer:", error.response?.data || error.message);
      if (error.response?.status === 404 && error.response?.data?.message === "Job not found") {
        alert("The job you are trying to apply for does not exist. Please check the job ID or contact support.");
      } else if (error.response?.status === 400 && error.response?.data?.message === "You have already applied for this job.") {
        alert("You have already applied for this job. Please check your applications or contact support.");
      } else {
        alert("Failed to submit counter offer. Please try again.");
      }
    }
  };

  const closePopup = () => {
    setShowCounterOfferPopup(false);
    setCounterOfferRate("");
    setCoverLetter("");
  };

  return (
    <div className="self-stretch p-12 w-full bg-[#F9F9F9] inline-flex justify-center items-center gap-2.5">
      <div className="flex-1 self-stretch max-w-[1024px] inline-flex flex-col justify-start items-start gap-8">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2"
        >
          <i className="ri-arrow-left-line text-[#656565] w-6 h-6"></i>
          <span className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
            Back
          </span>
        </button>
        <div className="self-stretch inline-flex justify-start items-start gap-9">
          <div className="w-[646px] p-6 bg-[#FFFFFF] rounded-3xl inline-flex flex-col justify-start items-end gap-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                    {booking.title}
                  </div>
                  <div className="self-stretch justify-start text-[#656565] text-base font-normal font-['Inter'] leading-snug">
                    {booking.eventType}
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                    Rate: {booking.rate}
                  </div>
                  <div className="px-4 py-2 bg-orange-200 rounded-full flex justify-center items-center gap-2.5">
                    <div className="justify-start text-[#292929] text-xs font-normal font-['Inter'] leading-none">
                      Booking Invitation – Pending Your Response
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-bold font-['Inter'] leading-tight">
                  Event Overview
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    Location: {booking.location}
                  </div>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    Date: {booking.date}
                  </div>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    Time: {booking.time} ({booking.duration})
                  </div>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    Description: {booking.description}
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-bold font-['Inter'] leading-tight">
                  Payment Info
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Total Hours Booked
                      </div>
                      <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                        {booking.paymentInfo.totalHours}
                      </div>
                    </div>
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Event Fee
                      </div>
                      <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                        {booking.paymentInfo.eventFee}
                      </div>
                    </div>
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Booking Fee
                      </div>
                      <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                        {booking.paymentInfo.bookingFee}
                      </div>
                    </div>
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                        Paid to Hostess
                      </div>
                      <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                        {booking.paymentInfo.paidToHostess}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="inline-flex justify-start items-center gap-6">
              <button
                className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden"
                onClick={handleDeclineInvitation}
              >
                <span className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                  Decline Invitation
                </span>
              </button>
              <button
                className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden"
                onClick={handleCounterOffer}
              >
                <span className="justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                  Counter Offer
                </span>
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden"
                onClick={handleAcceptInvitation}
              >
                <span className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                  Accept Invitation
                </span>
              </button>
            </div>
          </div>
          <div className="flex-1 p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-start gap-3">
            <div className="self-stretch justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
              Event Organizer
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-2">
              <img
                className="w-12 h-12 rounded-full"
                src={booking.organizer.image || "https://placehold.co/48x48"}
                alt="Organizer avatar"
              />
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    {booking.organizer.name}
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <i className="ri-map-pin-2-line text-[#656565] w-4 h-4"></i>
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      {`${booking.organizer.city}, ${booking.organizer.country}`}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <i className="ri-star-fill text-orange-500 "></i>
                      <div className="justify-start text-orange-500 text-sm font-medium font-['Inter'] leading-tight">
                        {booking.organizer.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                      {booking.organizer.reviews ? `(${booking.organizer.reviews} Reviews)` : "(No Reviews)"}
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                    Contact Details
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Phone: {booking.organizer.phone || "Not provided"}
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Email: {booking.organizer.email || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCounterOfferPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-[800px] p-6 bg-[#FFFFFF] rounded-3xl shadow-[0px_9px_250px_41px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-6 overflow-hidden">
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="flex-1 justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                Counter Offer
              </div>
              <button
                onClick={closePopup}
                className="p-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5"
              >
                <i className="ri-close-line text-[#656565] w-6 h-6"></i>
              </button>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                  Offer Rate: {booking.rate}
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                    Your Counter Offer Rate
                  </div>
                  <div className="pl-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-between items-center overflow-hidden">
                    <input
                      type="number"
                      placeholder="$"
                      value={counterOfferRate}
                      onChange={(e) => setCounterOfferRate(e.target.value)}
                      className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] outline-none"
                    />
                    <div className="self-stretch p-3 bg-[#ECECEC] inline-flex flex-col justify-between items-center overflow-hidden">
                      <select
                        value={rateType}
                        onChange={(e) => setRateType(e.target.value)}
                        className="self-stretch inline-flex outline-none bg-[#ECECEC] justify-start items-center gap-1 text-neutral-700 w-fit text-base font-normal font-['Inter'] leading-snug"
                      >
                        <option value="perHour">Per Hour</option>
                        <option value="perDay">Per Day</option>
                      </select>
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                      10% Event Fee: {booking.paymentInfo.bookingFee}
                    </div>
                    <div className="w-3.5 self-stretch origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                    <div className="justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                      You’ll Receive: {booking.paymentInfo.paidToHostess}
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-52 flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Cover Letter
                    </div>
                    <div className="justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                      Max 1000 ch
                    </div>
                  </div>
                  <div className="self-stretch flex-1 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Write a short note about why you're a great fit for this role."
                      maxLength="1000"
                      className="self-stretch flex-1 text-[#656565] text-sm font-normal font-['Inter'] leading-tight outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
              <button
                className="px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden"
                onClick={confirmCounterOffer}
              >
                <span className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
                  Send Counter Offer
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvitesReceived;