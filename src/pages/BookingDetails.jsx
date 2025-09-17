import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BASE_URLS from "../config";

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelPopup, setShowCancelPopup] = useState(false);
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
      console.log(reviews);
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
      statusColor: getStatusColor(apiBooking.status), // Helper function to map status to color
      applicationOffer: apiBooking.application
        ? `${apiBooking.application?.currency} - ${
            apiBooking.application?.offer
          }/${apiBooking.application?.duration === "day" ? "-" : "hr"}`
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
  const getBookingData = () => {
    if (bookingFromState) {
      setBooking(bookingFromState);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        console.log("Response ::", response.data);
        const transformedBooking = transformApiBooking(response.data);
        console.log(transformedBooking);
        setBooking(transformedBooking);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching booking:", error);
        setError("Failed to fetch booking details");
        setLoading(false);
      });
  };

  useEffect(() => {
    getBookingData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 text-[#292929] text-xl font-bold font-['Inter']">
        Loading...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-4 text-[#292929] text-xl font-bold font-['Inter']">
        {error || "Booking not found"}
      </div>
    );
  }

  const handleCancelBooking = () => {
    setShowCancelPopup(true);
  };

  const confirmCancelBooking = () => {
    console.log(`Cancelling booking with ID: ${booking.jobId}`);
    axios
      .post(
        `${BASE_URLS.BACKEND_BASEURL}jobs/${booking.jobId}/cancel-booking`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        console.log("Booking cancelled successfully:", response.data);
        setShowCancelPopup(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error cancelling booking:", error);
        setShowCancelPopup(false);
      });
  };

  const closePopup = () => {
    setShowCancelPopup(false);
  };

  const handleAction = (id, status) => {
    console.log(`Action for booking ID: ${id}, Status: ${status}`);
    // Implement actions based on status:
    // - Confirmed: Open messaging modal
    // - Pending: Confirm booking API call
    // - Completed: Open review modal
  };

  return (
    <div className="self-stretch bg-[#F9F9F9] w-full h-screen p-12 inline-flex justify-center items-start">
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
                    {booking.eventType || "Event"}
                  </div>
                </div>
                <div className="self-stretch  inline-flex flex-col md:flex-row gap-2 justify-between md:items-center">
                  <div className="justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                    Rate: {booking.applicationOffer || booking.rate}
                  </div>
                  <div
                    className={`px-4 py-2 ${booking.statusColor} w-fit  rounded-full flex justify-center items-center gap-2.5`}
                  >
                    <div className="justify-start text-[#292929] text-xs text-base font-medium font-['Inter'] leading-snug">
                      {booking.status === "Confirmed"
                        ? "Upcoming – Confirmed"
                        : booking.status == "Open"
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
                    Time: {booking.time} (
                    {booking.duration || "Duration not specified"})
                  </div>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    Description:{" "}
                    {booking.description ||
                      "No additional description provided."}
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="inline-flex justify-start items-center gap-6">
              <button
                className={`py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden ${
                  booking.status === "Cancelled" ||
                  booking.status === "Completed"
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
                className={`px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 ${
                  booking.status === "Cancelled" ? "hidden" : ""
                } overflow-hidden`}
                onClick={() =>
                  booking.status === "Confirmed" || booking.status === "Open"
                    ? navigate(`/dashboard/messages`, {
                        state: { userId: booking.organizer._id },
                      })
                    : console.log("Message Organizer")
                }
              >
                <span className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                  {booking.status === "Confirmed" || booking.status === "Open"
                    ? "Message Organizer"
                    : booking.status === "Pending"
                    ? "Confirm Booking"
                    : "Leave a Review"}
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
                src={booking.organizer?.image || "https://placehold.co/48x48"}
                alt="Organizer avatar"
              />
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    {booking.organizer?.name || "Unknown Organizer"}
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <i className="ri-map-pin-2-line text-[#656565] w-4 h-4"></i>
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      {booking.organizer?.city || "Unknown"},{" "}
                      {booking.organizer?.country || "Unknown"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <i className="ri-star-fill text-orange-500 w-4 h-4"></i>
                      <div className="justify-start text-orange-500 text-sm font-medium font-['Inter'] leading-tight">
                        {booking.organizer?.rating || "N/A"}
                      </div>
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                      {booking.organizer?.reviews
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
                      Phone: {booking.organizer?.phone || "Not provided"}
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Email: {booking.organizer?.email || "Not provided"}
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
                  onClick={closePopup}
                  className="p-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5"
                >
                  <i className="ri-close-line text-[#656565] w-6 h-6"></i>
                </button>
              </div>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                Booking cancellations within 7 days of an event incur a{" "}
                <span className="font-bold">$50 penalty charge.</span>
                <br />
                <span className="font-bold">No-shows</span> will also result in
                a $50 penalty charge and{" "}
                <span className="font-bold">
                  possible removal from the site.
                </span>
              </div>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch inline-flex justify-end items-center gap-4">
              <button
                onClick={closePopup}
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
    </div>
  );
}

export default BookingDetails;
