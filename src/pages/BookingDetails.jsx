import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BASE_URLS from "../config";

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bookingFromState = location.state?.booking;

  // Function to transform API response to match the state data format
  const transformApiBooking = (apiBooking) => {
    const jobDate = new Date(apiBooking.jobDate || new Date());
    const startTime = new Date(
      `1970-01-01T${apiBooking.startTime || "00:00"}:00`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const endTimeMs =
      new Date(`1970-01-01T${apiBooking.startTime || "00:00"}:00`).getTime() +
      (apiBooking.duration || 0) * 60 * 60 * 1000;
    const endTime = new Date(endTimeMs).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const eventFee =
      apiBooking.paymentType === "fixed"
        ? apiBooking.rateOffered
        : (apiBooking.duration || 0) * (apiBooking.rateOffered || 0);

    const avgRating = (reviews = []) => {
      if (!reviews.length) return "N/A";
      const validRatings = reviews
        .map((r) => r.rating)
        .filter((r) => typeof r === "number");
      if (!validRatings.length) return "N/A";
      return (
        validRatings.reduce((a, b) => a + b, 0) / validRatings.length
      ).toFixed(1);
    };

    return {
      id: apiBooking._id || "unknown",
      jobId: apiBooking._id || "unknown",
      title: apiBooking.eventName || "Unnamed Event",
      status:
        apiBooking.status.charAt(0).toUpperCase() +
          apiBooking.status.slice(1) || "Unknown",
      statusColor: getStatusColor(apiBooking.status),
      applicationOffer: apiBooking.application
        ? `${apiBooking.application.currency} ${apiBooking.application.offer}/${
            apiBooking.application.duration === "day" ? "day" : "hr"
          }`
        : null,
      role: apiBooking.jobTitle || "Unknown Role",
      rate: `${apiBooking.currency || "USD"} ${apiBooking.rateOffered || 0}/${
        apiBooking.paymentType || "Hourly"
      }`,
      location: `${apiBooking.suburb || "Unknown"}, ${
        apiBooking.city || "Unknown"
      }`,
      date:
        jobDate.toLocaleDateString("en-AU", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }) || "Unknown Date",
      time: `${startTime} - ${endTime}`,
      message: `Booking ${apiBooking.status} for ${
        apiBooking.eventName || "event"
      } on ${jobDate.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      eventType: apiBooking.eventName || "Unknown Event",
      duration: `${apiBooking.duration || 0} hours`,
      description:
        apiBooking.jobDescription || "No additional description provided.",
      organizer: {
        _id: apiBooking.organiser?._id || "unknown",
        name: apiBooking.organiser?.name || "Unknown Organizer",
        image:
          apiBooking.organiser?.profileImage || "https://placehold.co/48x48",
        email: apiBooking.organiser?.email || "Not provided",
        phone: apiBooking.organiser?.phone || "Not provided",
        city: apiBooking.organiser?.city || "Unknown",
        country: apiBooking.organiser?.country || "Unknown",
        reviews: apiBooking.organiser?.reviews?.length || 0,
        rating: avgRating(apiBooking.organiser?.reviews) || "N/A",
      },
      paymentInfo: {
        currency: apiBooking.currency || "USD",
        totalHours: `${apiBooking.duration || 0}`,
        eventFee: `${apiBooking.currency || "USD"} ${eventFee}`,
        bookingFee: `${apiBooking.currency || "USD"} ${Math.round(
          eventFee * 0.1
        )}`,
        paidToHostess: `${apiBooking.currency || "USD"} ${Math.round(
          eventFee * 0.9
        )}`,
        isPaid: apiBooking.isPaid || false,
      },
    };
  };

  // Helper function to map status to color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "open":
        return "bg-lime-100";
      case "pending":
        return "bg-yellow-100";
      case "completed":
        return "bg-blue-100";
      case "cancelled":
        return "bg-gray-200";
      default:
        return "bg-gray-200";
    }
  };

  // Fetch booking data from API if no state data is available
  const getBookingData = async () => {
    if (bookingFromState && bookingFromState.id === id) {
      setBooking(bookingFromState);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const transformedBooking = transformApiBooking(response.data);
      setBooking(transformedBooking);
      setError(null);
    } catch (error) {
      console.error("Error fetching booking:", error);
      setError("Failed to fetch booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookingData();
  }, [id]);

  const handleCancelBooking = () => {
    setShowCancelPopup(true);
  };

  const confirmCancelBooking = async () => {
    try {
      const response = await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}jobs/${booking.jobId}/cancel-booking`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Booking cancelled successfully:", response.data);
      // Update booking status to reflect cancellation
      setBooking((prev) => ({
        ...prev,
        status: "Cancelled",
        statusColor: "bg-gray-200",
        message: `Booking cancelled for ${prev.eventName} on ${new Date(
          prev.date
        ).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`,
      }));
      setShowCancelPopup(false);
      setShowSuccessPopup(true); // Show success popup after cancellation
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
      setShowCancelPopup(false);
    }
  };

  const closeCancelPopup = () => {
    setShowCancelPopup(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate("/dashboard"); // Navigate to dashboard after closing success popup
  };

  const handleAction = (id, status) => {
    if (status === "Confirmed" || status === "Open") {
      navigate(`/dashboard/messages`, { state: { userId: booking.organizer._id } });
    } else if (status === "Pending") {
      axios
        .post(
          `${BASE_URLS.BACKEND_BASEURL}jobs/${id}/confirm`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        )
        .then((response) => {
          console.log("Booking confirmed:", response.data);
          setBooking((prev) => ({
            ...prev,
            status: "Confirmed",
            statusColor: "bg-lime-100",
          }));
        })
        .catch((error) => {
          console.error("Error confirming booking:", error);
          alert("Failed to confirm booking. Please try again.");
        });
    } else if (status === "Completed") {
      navigate(`/dashboard/reviews`, { state: { bookingId: id } });
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-[#292929] text-xl font-bold font-['Inter']">
        Loading...
      </div>
    );
  }

  if (error || !booking || booking.id !== id) {
    return (
      <div className="p-4 text-[#292929] text-xl font-bold font-['Inter']">
        {error || "Booking not found"}
      </div>
    );
  }

  return (
    <div className="self-stretch bg-[#F9F9F9] w-full min-h-screen p-12 inline-flex justify-center items-start">
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
        <div className="self-stretch flex-col md:flex-row inline-flex justify-start items-start gap-8">
          <div className="md:w-[646px] w-full p-6 bg-[#FFFFFF] rounded-3xl inline-flex flex-col justify-start items-end gap-6">
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
                <div className="self-stretch inline-flex flex-col md:flex-row gap-2 justify-between md:items-center">
                  <div className="justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                    Rate: {booking.applicationOffer || booking.rate}
                  </div>
                  <div
                    className={`px-4 py-2 ${booking.statusColor} w-fit rounded-full flex justify-center items-center gap-2.5`}
                  >
                    <div className="justify-start text-[#292929] text-xs font-normal font-['Inter'] leading-none">
                      {booking.status === "Confirmed"
                        ? "Upcoming – Confirmed"
                        : booking.status === "Open"
                        ? "Upcoming"
                        : booking.status}
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
                className={`py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden ${
                  booking.status === "Cancelled" || booking.status === "Completed"
                    ? "hidden"
                    : ""
                }`}
                onClick={handleCancelBooking}
              >
                <span className="justify-start text-red-600 text-base font-medium font-['Inter'] leading-snug">
                  Cancel Booking
                </span>
              </button>
              <button
                className={`px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden`}
                onClick={() => handleAction(booking.jobId, booking.status)}
              >
                <span className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                  {booking.status === "Confirmed" || booking.status === "Open"
                    ? "Message Organizer"
                    : booking.status === "Pending"
                    ? "Confirm Booking"
                    : booking.status === "Completed"
                    ? "Leave a Review"
                    : "View Details"}
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
                src={booking.organizer.image}
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
                      {booking.organizer.city}, {booking.organizer.country}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <i className="ri-star-fill text-orange-500 w-4 h-4"></i>
                      <div className="justify-start text-orange-500 text-sm font-medium font-['Inter'] leading-tight">
                        {booking.organizer.rating}
                      </div>
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                      {booking.organizer.reviews
                        ? `(${booking.organizer.reviews} Reviews)`
                        : "(No Reviews)"}
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                    Contact Details
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Phone: {booking.organizer.phone}
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Email: {booking.organizer.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="md:w-[594px] p-6 bg-[#FFF1F2] rounded-2xl inline-flex flex-col justify-start items-start gap-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="flex-1 justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                  Confirm Cancellation
                </div>
                <button
                  onClick={closeCancelPopup}
                  className="p-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5"
                >
                  <i className="ri-close-line text-[#656565] w-6 h-6"></i>
                </button>
              </div>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                Are you sure you want to cancel this booking? Cancellations within 7 days of an event incur a{" "}
                <span className="font-bold">{booking.paymentInfo.currency} 50 penalty charge</span>.
                <br />
                <span className="font-bold">No-shows</span> will also result in a {booking.paymentInfo.currency} 50 penalty charge and{" "}
                <span className="font-bold">possible removal from the site</span>.
              </div>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch inline-flex justify-end items-center gap-4">
              <button
                onClick={closeCancelPopup}
                className="px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2 overflow-hidden"
              >
                <span className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                  No, Back to Main Page
                </span>
              </button>
              <button
                onClick={confirmCancelBooking}
                className="px-6 py-3 bg-red-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden"
              >
                <span className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
                  Yes, Cancel Booking
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="md:w-[594px] p-6 bg-[#E6FFE6] rounded-2xl inline-flex flex-col justify-start items-start gap-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="flex-1 justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                  Booking Cancelled Successfully
                </div>
                <button
                  onClick={closeSuccessPopup}
                  className="p-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5"
                >
                  <i className="ri-close-line text-[#656565] w-6 h-6"></i>
                </button>
              </div>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                Your booking for <span className="font-bold">{booking.title}</span> has been successfully cancelled.
                {new Date(booking.date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 && (
                  <>
                    <br />
                    As this cancellation occurred within 7 days of the event, a{" "}
                    <span className="font-bold">{booking.paymentInfo.currency} 50 penalty charge</span> may apply.
                  </>
                )}
              </div>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch inline-flex justify-end items-center gap-4">
              <button
                onClick={closeSuccessPopup}
                className="px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden"
              >
                <span className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
                  Return to Dashboard
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingDetails;