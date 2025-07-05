import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import 'remixicon/fonts/remixicon.css'; // Import Remix Icons CSS

function ManageBookings() {
  // State to manage active tab
  const [activeTab, setActiveTab] = useState("Confirmed Bookings");
  const navigate = useNavigate();

  // Booking data for each tab
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

  // Calendar data (shared across tabs for simplicity, can be customized per tab if needed)
  const calendarData = {
    month: "January 2024",
    days: [
      { day: 31, opacity: "opacity-0", events: [] },
      {
        day: 1,
        events: [
          {
            title: "New Year Celebration Party",
            color: "bg-[#E61E4D]",
            type: "Holiday",
          },
        ],
      },
      {
        day: 2,
        events: [
          { title: "Pool Party", color: "bg-[#E61E4D]" },
          { title: "Indoor Event", color: "bg-[#FFCCD3]" },
          { title: "Beach party", color: "bg-[#656565]" },
        ],
      },
      { day: 3, events: [] },
      { day: 4, events: [] },
      { day: 5, events: [] },
      { day: 6, events: [] },
      { day: 7, events: [] },
      { day: 8, events: [] },
      { day: 9, events: [] },
      { day: 10, events: [] },
      { day: 11, events: [] },
      { day: 12, events: [] },
      { day: 13, events: [] },
      { day: 14, events: [] },
      {
        day: 15,
        events: [
          { title: "Bachelor Party", color: "bg-[#E61E4D]", height: "h-8" },
        ],
      },
      { day: 16, events: [] },
      { day: 17, events: [] },
      { day: 18, events: [] },
      { day: 19, events: [] },
      {
        day: 20,
        events: [
          {
            title: "Mom's Birthday",
            color: "bg-[#F9F9F9]",
            emoji: "🎂",
            textColor: "text-[#3D3D3D]",
            textSize: "text-[6px]",
          },
        ],
      },
      { day: 21, events: [] },
      { day: 22, events: [] },
      { day: 23, events: [] },
      { day: 24, events: [] },
      { day: 25, events: [] },
      { day: 26, events: [] },
      { day: 27, events: [] },
      { day: 28, events: [] },
      { day: 29, events: [] },
      { day: 30, events: [] },
      { day: 31, events: [] },
      { day: 31, opacity: "opacity-0", events: [] },
      { day: 31, opacity: "opacity-0", events: [] },
      { day: 31, opacity: "opacity-0", events: [] },
    ],
  };

  // Component to render booking cards
  const BookingCard = ({ booking }) => (
    <div className="self-stretch p-6 bg-[#FFFFFF] rounded-2xl flex flex-col justify-start items-start gap-4">
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-start items-center gap-4">
          <div className="flex-1 justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
            {booking.title}
          </div>
          <div
            className={`w-20 px-4 py-2 ${booking.statusColor} rounded-full flex justify-center items-center gap-2.5`}
          >
            <div className="justify-start text-[#292929] text-xs font-normal font-['Inter'] leading-none">
              {booking.status}
            </div>
          </div>
        </div>
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
            Role: {booking.role}
          </div>
          <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
            {booking.rate}
          </div>
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-center gap-3 flex-wrap content-center">
        <div className="flex justify-start items-center gap-2">
          <i className="ri-map-pin-2-fill text-[#656565] w-4 h-4"></i>
          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
            {booking.location}
          </div>
        </div>
        <div className="flex justify-start items-center gap-2">
          <i className="ri-calendar-2-fill text-[#656565] w-4 h-4"></i>
          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
            {booking.date}
          </div>
        </div>
        <div className="flex justify-start items-center gap-2">
          <i className="ri-time-fill text-[#656565] w-4 h-4"></i>
          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
            {booking.time}
          </div>
        </div>
      </div>
      <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
        {booking.message}
      </div>
      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
      <div className="self-stretch inline-flex justify-end items-center gap-4">
        <button className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
          <span className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
            View Details
          </span>
        </button>
        <button
          onClick={
            activeTab === "Confirmed Bookings"
              ? () => navigate(`/bookings/${booking.id}`)
              : activeTab === "Invites Received"
              ? () => navigate(`/invites/${booking.id}`)
              : activeTab === "Past Bookings"
              ? () => navigate(`/past-booking/${booking.id}`)
              : () => navigate("/booking")
          }
          disabled={activeTab === "Cancelled Bookings"}
          className={`px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 ${
            activeTab === "Cancelled Bookings" ? "hidden" : ""
          } overflow-hidden`}
        >
          <span className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
            {activeTab === "Confirmed Bookings"
              ? "Message Organiser"
              : activeTab === "Invites Received"
              ? "Confirm Booking"
              : activeTab === "Past Bookings"
              ? "Leave a Review"
              : "Cancel Booking"}
          </span>
        </button>
      </div>
    </div>
  );

  // Component to render calendar
  const Calendar = () => (
    <div className="flex-1 h-[500px] p-4 bg-[#FFFFFF] rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-4">
      <div className="self-stretch inline-flex justify-between items-start">
        <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-4">
          <div className="inline-flex justify-center items-center gap-4">
            <button className="p-1 bg-[#F9F9F9] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5">
              <i className="ri-arrow-left-s-line text-[#656565] w-6 h-6"></i>
            </button>
            <div className="justify-center text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              {calendarData.month}
            </div>
            <button className="p-1 bg-[#F9F9F9] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5">
              <i className="ri-arrow-right-s-line text-[#656565] w-6 h-6"></i>
            </button>
          </div>
          <div className="self-stretch p-2 rounded inline-flex justify-start items-center gap-3 overflow-hidden">
            <div className="flex justify-start items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#E61E4D] rounded-full" />
              <div className="justify-center text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                Confirmed booking: 3
              </div>
            </div>
            <div className="w-3 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="flex justify-start items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#FFCCD3] rounded-full" />
              <div className="justify-center text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                Booking Invitation: 1
              </div>
            </div>
            <div className="w-3 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="flex justify-start items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#656565] rounded-full" />
              <div className="justify-center text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                Cancelled Bookings: 1
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch min-w-[484px] min-h-82 p-px bg-[#F9F9F9] rounded-lg inline-flex flex-col justify-start items-start gap-px overflow-hidden">
        <div className="self-stretch inline-flex justify-start items-start gap-px">
          {["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="flex-1 min-w-16 px-2 py-0.5 bg-[#292929] flex justify-center items-center gap-2"
            >
              <div className="flex-1 text-center justify-center text-[#FFFFFF] text-xs font-normal font-['Inter'] leading-none">
                {day}
              </div>
            </div>
          ))}
        </div>
        {[...Array(5)].map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="self-stretch flex-1 min-h-16 inline-flex justify-start items-start gap-px"
          >
            {calendarData.days
              .slice(rowIndex * 7, (rowIndex + 1) * 7)
              .map((day, index) => (
                <div
                  key={index}
                  className="flex-1 self-stretch min-w-16 min-h-16 p-1.5 bg-white inline-flex flex-col justify-start items-start gap-0.5"
                >
                  <div
                    className={`self-stretch justify-center text-[#3D3D3D] text-[10px] font-extrabold font-['Avenir'] ${
                      day.opacity || ""
                    }`}
                  >
                    {day.day}
                  </div>
                  {day.events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`self-stretch ${event.height || "py-px"} ${
                        event.color
                      } rounded-sm inline-flex justify-start items-start gap-0.5 overflow-hidden`}
                    >
                      {event.emoji && (
                        <div className="justify-center text-[#292929] text-[10px] font-extrabold font-['Avenir']">
                          {event.emoji}
                        </div>
                      )}
                      <div
                        className={`flex-1 justify-center ${
                          event.textColor || "text-[#FFFFFF]"
                        } ${
                          event.textSize || "text-xs"
                        } font-normal font-['Inter'] leading-none`}
                      >
                        {event.title}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );

  // Component to render tab content
  const TabContent = ({ tab }) => (
    <div className="self-stretch flex flex-col justify-start items-start gap-8">
      <div className="flex flex-col justify-start items-start gap-1">
        <div className="self-stretch justify-start text-[#3D3D3D] text-xl font-bold font-['Inter'] leading-normal">
          {tab}
        </div>
        <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
          {tab === "Confirmed Bookings" &&
            "Your next spotlight awaits—get set to shine at your upcoming gigs!"}
          {tab === "Invites Received" &&
            "Review and respond to your booking invitations."}
          {tab === "Past Bookings" &&
            "View your completed gigs and their details."}
          {tab === "Cancelled Bookings" && "Review your cancelled bookings."}
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-start gap-8">
        <div className="flex-1 inline-flex flex-col justify-end items-start gap-6">
          {bookingsData[tab]?.length > 0 ? (
            bookingsData[tab].map((booking, index) => (
              <BookingCard key={index} booking={booking} />
            ))
          ) : (
            <div>No {tab.toLowerCase()} available at the moment.</div>
          )}
        </div>
        <Calendar />
      </div>
    </div>
  );

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
      <div className="self-stretch flex flex-col justify-start items-start gap-12">
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="self-stretch justify-start text-black text-4xl font-bold font-['Inter'] leading-10">
            Manage Your Bookings
          </div>
          <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
            Keep track of your gigs, review past events, and manage
            cancellations—all in one easy-to-use dashboard.
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-8">
          <div className="border-b border-[#656565] inline-flex justify-start items-center">
            {[
              "Confirmed Bookings",
              "Invites Received",
              "Past Bookings",
              "Cancelled Bookings",
            ].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 border-b-2 flex justify-center items-center gap-2.5 ${
                  activeTab === tab ? "border-[#E61E4D]" : "border-transparent"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <div
                  className={`justify-start text-sm font-medium font-['Inter'] leading-tight ${
                    activeTab === tab ? "text-[#E61E4D]" : "text-[#656565]"
                  }`}
                >
                  {tab}
                </div>
              </button>
            ))}
          </div>
          {TabContent({ tab: activeTab })}
        </div>
      </div>
    </div>
  );
}

export default ManageBookings;
