import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function InvitesReceived() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCounterOfferPopup, setShowCounterOfferPopup] = useState(false);
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
        statusColor: "bg-blue-100",
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
  // Find the booking by ID
  const booking = bookingsData["Invites Received"].find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="p-4 text-[#292929] text-xl font-bold font-['Inter']">
        Invite not found
      </div>
    );
  }

  const handleDeclineInvitation = () => {
    console.log(`Declining invitation with ID: ${id}`);
    // Implement API call or state update to decline invitation
    navigate("/");
  };

  const handleAcceptInvitation = () => {
    console.log(`Accepting invitation with ID: ${id}`);
    // Implement API call to accept invitation
    navigate("/");
  };

  const handleCounterOffer = () => {
    setShowCounterOfferPopup(true);
  };

  const confirmCounterOffer = () => {
    console.log(`Sending counter offer for invitation with ID: ${id}`);
    // Implement counter offer submission logic
    setShowCounterOfferPopup(false);
    navigate("/");
  };

  const closePopup = () => {
    setShowCounterOfferPopup(false);
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
                    {booking.eventType || "Event"}
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
                        {booking.paymentInfo?.totalHours || "N/A"}
                      </div>
                    </div>
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Event Fee
                      </div>
                      <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                        {booking.paymentInfo?.eventFee || "N/A"}
                      </div>
                    </div>
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Booking Fee
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
      {/* Counter Offer Popup */}
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
                  <div className=" pl-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-between items-center overflow-hidden">
                    <input
                      type="number"
                      placeholder="$"
                      className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] outline-none"
                    />
                    <div className="self-stretch p-3 bg-[#ECECEC] inline-flex flex-col justify-between items-center overflow-hidden">
                      <select className="self-stretch inline-flex outline-none bg-[#ECECEC] justify-start items-center gap-1 text-neutral-700 w-fit text-base font-normal font-['Inter'] leading-snug">
                        <option value="perHour">Per Hour</option>
                        <option value="perDay">Per Day</option>
                      </select>
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                      10% Event fee: $10
                    </div>
                    <div className="w-3.5 self-stretch origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                    <div className="justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                      You’ll Receive $90/h
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
