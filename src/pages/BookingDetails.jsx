import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BookingDetails() {
  const bookingsData = {
    "Confirmed Bookings": [
      {
        id: "conf-1",
        title: "Exclusive Beach Party – Energetic Hostess Required",
        status: "Confirmed",
        statusColor: "bg-lime-100",
        role: "Hostess",
        rate: "$100/hr",
        location: "123 Harbour Street, Sydney, NSW",
        date: "15th March 2025",
        time: "6:00 PM – 11:00 PM",
        message: "Organizer left 1 message for you.",
        eventType: "Beach Party",
        duration: "5 hours",
        description: "A vibrant beach party with live music and entertainment.",
        organizer: {
          name: "Olivia Parker",
          location: "Sydney, NSW",
          rating: "4.8",
          reviews: 120,
          phone: "+61 2 1234 5678",
          email: "oliviaparker@gmail.com",
          image: "https://placehold.co/48x48",
        },
      },
      {
        id: "conf-2",
        title: "Exclusive Beach Party – Energetic Hostess Required",
        status: "Confirmed",
        statusColor: "bg-lime-100",
        role: "Hostess",
        rate: "$100/hr",
        location: "123 Harbour Street, Sydney, NSW",
        date: "15th March 2025",
        time: "6:00 PM – 11:00 PM",
        message: "Organizer left 1 message for you.",
        eventType: "Beach Party",
        duration: "5 hours",
        description: "A vibrant beach party with live music and entertainment.",
        organizer: {
          name: "Olivia Parker",
          location: "Sydney, NSW",
          rating: "4.8",
          reviews: 120,
          phone: "+61 2 1234 5678",
          email: "oliviaparker@gmail.com",
          image: "https://placehold.co/48x48",
        },
      },
    ],
    "Invites Received": [
      {
        id: 1,
        title: "Charity Event – Promotional Staff",
        status: "Pending",
        statusColor: "bg-yellow-100",
        role: "Promoter",
        rate: "$80/hr",
        location: "789 Pitt Street, Sydney, NSW",
        date: "25th March 2025",
        time: "5:00 PM – 10:00 PM",
        message: "Organizer invited you to this event.",
      },
    ],
    "Past Bookings": [
      {
        id: 1,
        title: "New Year Celebration Party",
        status: "Completed",
        statusColor: "bg-blue-100",
        role: "Hostess",
        rate: "$90/hr",
        location: "101 Bondi Beach, Sydney, NSW",
        date: "1st January 2025",
        time: "8:00 PM – 2:00 AM",
        message: "Event completed successfully.",
      },
    ],
    "Cancelled Bookings": [
      {
        id: 1,
        title: "Beach Party – Event Staff",
        status: "Cancelled",
        statusColor: "bg-gray-200",
        role: "Staff",
        rate: "$85/hr",
        location: "321 Manly Beach, Sydney, NSW",
        date: "10th March 2025",
        time: "4:00 PM – 9:00 PM",
        message: "Event was cancelled by the organizer.",
      },
    ],
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  // Find the booking by ID
  const booking = Object.values(bookingsData)
    .flat()
    .find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="p-4 text-[#292929] text-xl font-bold font-['Inter']">
        Booking not found
      </div>
    );
  }

  const handleCancelBooking = () => {
    setShowCancelPopup(true);
  };

  const confirmCancelBooking = () => {
    console.log(`Cancelling booking with ID: ${id}`);
    // Implement API call or state update to cancel booking
    setShowCancelPopup(false);
    navigate("/");
  };

  const closePopup = () => {
    setShowCancelPopup(false);
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
        <div className="self-stretch inline-flex justify-start items-start gap-8">
          <div className="w-[646px] p-6 bg-[#FFFFFF] rounded-3xl inline-flex flex-col justify-start items-end gap-6">
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
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                    Rate: {booking.rate}
                  </div>
                  <div
                    className={`px-4 py-2 ${booking.statusColor} rounded-full flex justify-center items-center gap-2.5`}
                  >
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      {booking.status === "Confirmed"
                        ? "Upcoming – Confirmed"
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
                onClick={() => handleAction(booking.id, booking.status)}
              >
                <span className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                  {booking.status === "Confirmed"
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
                      {booking.organizer?.location || "Location not specified"}
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
      {/* Cancel Confirmation Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-[594px] p-6 bg-[#FFF1F2] rounded-2xl inline-flex flex-col justify-start items-start gap-6">
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

// Action handlers (placeholders, implement as needed)
// const handleCancelBooking = () => {
//   setShowCancelPopup(true);
// };

const handleAction = (id, status) => {
  console.log(`Action for booking ID: ${id}, Status: ${status}`);
  // Implement actions based on status:
  // - Confirmed: Open messaging modal
  // - Pending: Confirm booking API call
  // - Completed: Open review modal
};

export default BookingDetails;
