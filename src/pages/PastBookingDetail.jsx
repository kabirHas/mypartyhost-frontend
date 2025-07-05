import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PastBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

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
        paymentInfo: {
          totalHours: "5 hours",
          eventFee: "$500",
          bookingFee: "$50",
          paidToHostess: "$450",
        },
      },
      {
        id: "conf-2",
        title: "Corporate Gala – Event Host",
        status: "Confirmed",
        statusColor: "bg-lime-100",
        role: "Host",
        rate: "$120/hr",
        location: "456 George Street, Sydney, NSW",
        date: "20th March 2025",
        time: "7:00 PM – 12:00 AM",
        message: "Organizer left 2 messages for you.",
        eventType: "Corporate Event",
        duration: "5 hours",
        description: "A formal gala with keynote speeches and networking.",
        organizer: {
          name: "James Wilson",
          location: "Sydney, NSW",
          rating: "4.9",
          reviews: 150,
          phone: "+61 2 9876 5432",
          email: "jameswilson@gmail.com",
          image: "https://placehold.co/48x48",
        },
        paymentInfo: {
          totalHours: "5 hours",
          eventFee: "$600",
          bookingFee: "$60",
          paidToHostess: "$540",
        },
      },
    ],
    "Invites Received": [
      {
        id: "inv-1",
        title: "Charity Event – Promotional Staff",
        status: "Pending",
        statusColor: "bg-orange-200",
        role: "Promoter",
        rate: "$80/hr",
        location: "789 Pitt Street, Sydney, NSW",
        date: "25th March 2025",
        time: "5:00 PM – 10:00 PM",
        message: "Organizer invited you to this event.",
        eventType: "Charity Event",
        duration: "5 hours",
        description: "Promote a charity fundraiser with community engagement.",
        organizer: {
          name: "Emma Thompson",
          location: "Sydney, NSW",
          rating: "4.7",
          reviews: 80,
          phone: "+61 2 4567 8901",
          email: "emmathompson@gmail.com",
          image: "https://placehold.co/48x48",
        },
        paymentInfo: {
          totalHours: "5 hours",
          eventFee: "$400",
          bookingFee: "$40",
          paidToHostess: "$360",
        },
      },
    ],
    "Past Bookings": [
      {
        id: "past-1",
        title: "New Year Celebration Party",
        status: "Completed",
        statusColor: "bg-lime-100",
        role: "Hostess",
        rate: "$90/hr",
        location: "101 Bondi Beach, Sydney, NSW",
        date: "1st January 2025",
        time: "8:00 PM – 2:00 AM",
        message: "Event completed successfully.",
        eventType: "New Year Party",
        duration: "6 hours",
        description: "A grand celebration to welcome the new year.",
        organizer: {
          name: "Liam Davis",
          location: "Sydney, NSW",
          rating: "4.6",
          reviews: 200,
          phone: "+61 2 2345 6789",
          email: "liamdavis@gmail.com",
          image: "https://placehold.co/48x48",
        },
        paymentInfo: {
          totalHours: "6 hours",
          eventFee: "$540",
          bookingFee: "$54",
          paidToHostess: "$486",
        },
        organizerFeedback:
          "Samantha’s professionalism and energy made our gala night a success. Highly recommended!",
        organizerRating: 5,
      },
    ],
    "Cancelled Bookings": [
      {
        id: "cancel-1",
        title: "Beach Party – Event Staff",
        status: "Cancelled",
        statusColor: "bg-gray-200",
        role: "Staff",
        rate: "$85/hr",
        location: "321 Manly Beach, Sydney, NSW",
        date: "10th March 2025",
        time: "4:00 PM – 9:00 PM",
        message: "Event was cancelled by the organizer.",
        eventType: "Beach Party",
        duration: "5 hours",
        description:
          "A beach party that was cancelled due to weather conditions.",
        organizer: {
          name: "Sophie Brown",
          location: "Sydney, NSW",
          rating: "4.5",
          reviews: 90,
          phone: "+61 2 3456 7890",
          email: "sophiebrown@gmail.com",
          image: "https://placehold.co/48x48",
        },
        paymentInfo: {
          totalHours: "5 hours",
          eventFee: "$425",
          bookingFee: "$42.50",
          paidToHostess: "$382.50",
        },
      },
    ],
  };

  const booking = bookingsData["Past Bookings"].find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="p-4 text-[#292929] text-xl font-bold font-['Inter']">
        Booking not found
      </div>
    );
  }

  const handleFeedbackSubmit = () => {
    console.log(`Submitting feedback for booking ID: ${id}`, {
      rating,
      feedback,
    });
    // Implement API call to submit feedback
    setRating(0);
    setFeedback("");
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="self-stretch bg-[#F9F9F9] w-full py-12 inline-flex flex-col justify-start items-center gap-8">
      <div className=" flex flex-col justify-start items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2"
        >
          <i className="ri-arrow-left-line text-[#656565] w-6 h-6"></i>
          <span className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
            Back
          </span>
        </button>
        <div className="self-stretch inline-flex justify-center items-start gap-8">
          <div className="inline-flex flex-col justify-center items-start gap-6">
            <div className="w-[746px] p-6 bg-[#FFFFFF] rounded-3xl flex flex-col justify-start items-end gap-6">
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
                    <div className="px-4 py-2 bg-lime-100 rounded-full flex justify-center items-center gap-2.5">
                      <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                        Completed
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
            </div>
            <div className="self-stretch p-6 bg-[#FFFFFF] rounded-2xl flex flex-col justify-start items-start gap-8">
              <div className="w-44 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  Payment Summary
                </div>
                <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                  {booking.paymentInfo?.totalHours} @ {booking.rate}
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Total Hours Booked
                    </div>
                    <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      {booking.paymentInfo?.totalHours || "N/A"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Total Fee
                    </div>
                    <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      {booking.paymentInfo?.eventFee || "N/A"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Deposit Paid
                    </div>
                    <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      {booking.paymentInfo?.bookingFee || "N/A"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      Paid to Hostess
                    </div>
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      {booking.paymentInfo?.paidToHostess || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch p-6 bg-[#FFFFFF] rounded-2xl flex flex-col justify-start items-start gap-6">
              <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Rating and Feedback
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch pb-4 flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-start gap-3">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                        Organizer's Feedback
                      </div>
                      <div className="inline-flex justify-start items-start gap-1.5">
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`ri-star-fill w-4 h-4 ${
                              index < booking.organizerRating
                                ? "text-orange-500"
                                : "text-gray-300"
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    {booking.organizerFeedback || "No feedback provided."}
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                    Leave Your Feedback
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                        Rating
                      </div>
                      <div className="self-stretch inline-flex justify-start items-center gap-2">
                        {[...Array(5)].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleRatingChange(index + 1)}
                            className={`w-6 h-6 ${
                              rating > index
                                ? "text-orange-500"
                                : "text-[#ECECEC]"
                            }`}
                          >
                            <i className="ri-star-fill w-5 h-5"></i>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                          Your Feedback
                        </div>
                        <div className="justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                          Max 250 ch
                        </div>
                      </div>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        maxLength="250"
                        className="self-stretch h-28 rounded-lg border border-[#ECECEC] p-3 text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight outline-none resize-none"
                        placeholder="Write your feedback here..."
                      ></textarea>
                    </div>
                    <div className="self-stretch flex flex-col justify-center items-end gap-2.5">
                      <button
                        onClick={handleFeedbackSubmit}
                        className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden"
                      >
                        <span className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                          Submit Your Feedback
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-[400px] p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-start gap-3">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Counter Offer Popup */}
    </div>
  );
}

export default PastBookingDetail;
