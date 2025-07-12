import React, { useEffect, useState } from "react";
import "../asset/css/OrganizerDashboard.css";
import Calendar from "../components/Calendar";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const events = [
  {
    date: new Date(2024, 0, 1),
    title: "New Year Celebration Party",
    type: "confirmed",
  },
  { date: new Date(2024, 0, 2), title: "Pool Party", type: "confirmed" },
  { date: new Date(2024, 0, 2), title: "Indoor Event", type: "invitation" },
  { date: new Date(2024, 0, 2), title: "Beach party", type: "cancelled" },
  { date: new Date(2024, 0, 15), title: "Bachelor Party", type: "confirmed" },
  { date: new Date(2024, 0, 20), title: "Mom's Birthday", type: "note" },
];

const data = [
  { day: "Mon", views: 4 },
  { day: "Tue", views: 8 },
  { day: "Wed", views: 18 },
  { day: "Thu", views: 21 },
  { day: "Fri", views: 5 },
  { day: "Sat", views: 14 },
  { day: "Sun", views: 25 },
];

const notifications = [
  {
    name: "Emily R.",
    job: "VIP Pool Party Host",
    message: "applied for your",
    ending: "gig! Ready to turn up the heat?",
    link: "Review Application",
  },
  {
    name: "Sofia L.",
    job: "Luxury Yacht Bash",
    message: "wants to join your",
    ending: "– She's a pro at keeping the party alive!",
    link: "Check Her Profile",
  },
  {
    name: "Mia T.",
    job: "DJ Lounge Host",
    message: "just applied to be your",
    ending: "– Let’s keep the beats rolling!",
    link: "Check Her Profile",
  },
  {
    name: "Sofia L.",
    job: "Luxury Yacht Bash",
    message: "wants to join your",
    ending: "– She's a pro at keeping the party alive!",
    link: "Check Her Profile",
  },
];

const StaffDashboard = () => {
  const [date, setDate] = useState(new Date(2024, 0, 1));
  const [isActive, setIsActive] = useState(false); // initial state

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const getEventsForDate = (date) => {
    return events.filter(
      (event) =>
        event.date.getFullYear() === date.getFullYear() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getDate() === date.getDate()
    );
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const dayEvents = getEventsForDate(date);

    return (
      <div className="event-container">
        {dayEvents.map((event, idx) => (
          <div key={idx} className={`event-tag ${event.type}`}>
            {event.title}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="self-stretch inline-flex justify-start items-center gap-4">
        <div className="flex-1 self-stretch p-6 bg-white rounded-2xl inline-flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="justify-start text-black text-xl font-bold font-['Inter'] leading-normal">
                  VIP Gala Night
                </div>
                <div
                  data-property-1="Confirmed"
                  className="w-20 px-4 py-2 bg-lime-100 rounded-full flex justify-center items-center gap-2.5"
                >
                  <div className="justify-start text-Token-Text-Primary text-xs font-normal font-['Inter'] leading-none">
                    Confirmed
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="justify-start text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
                  Role: Hostess
                </div>
                <div className="justify-start text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
                  Rate: $100/hr
                </div>
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-3 flex-wrap content-center">
              <div className="flex justify-start items-center gap-2">
                <i class="ri-map-pin-2-fill"></i>
                <div className="justify-start text-Token-Text-Secondary text-sm font-normal font-['Inter'] leading-tight">
                  123 Harbour Street, Sydney, NSW
                </div>
              </div>
              <div className="flex justify-start items-center gap-2">
                <i class="ri-calendar-check-line"></i>
                <div className="justify-start text-Token-Text-Secondary text-sm font-normal font-['Inter'] leading-tight">
                  15th March 2025
                </div>
              </div>
              <div className="flex justify-start items-center gap-2">
                <i class="ri-time-fill"></i>
                <div className="justify-start text-Token-Text-Secondary text-sm font-normal font-['Inter'] leading-tight">
                  6:00 PM – 11:00 PM
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
            <div className="justify-start text-Token-Text-On-Dark-BG text-sm font-medium font-['Inter'] leading-tight text-white">
              View Details
            </div>
          </div>
        </div>
        <div className="flex-1 self-stretch p-6 bg-white rounded-3xl inline-flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex-1 flex flex-col justify-start items-center gap-4">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="justify-start text-black text-sm font-bold font-['Inter'] leading-tight">
                Booking Request
              </div>
              <div className="justify-start text-black text-4xl font-bold font-['Inter'] leading-10">
                7
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                Samantha R. wants to book you for private party
              </div>
              <div className="self-stretch justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                Joe R. wants to book you for VIP Event
              </div>
              <div className="self-stretch justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                Sam K. wants to book you for private party
              </div>
            </div>
          </div>
          <div className="w-72 h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
            <div className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
              <div className="justify-start text-Token-Text-On-Dark-BG text-sm font-medium font-['Inter'] leading-tight text-white">
                View Booking Request
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 self-stretch p-6 bg-gradient-to-b from-[#fff] to-[#fff1f2] rounded-3xl outline outline-1 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Dark-1 inline-flex flex-col justify-start items-start gap-2 ">
          <div className="self-stretch inline-flex justify-start items-center gap-2">
            <div className="flex-1 flex justify-start items-center gap-2">
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="inline-flex justify-start items-center gap-1">
                      <div className="justify-start text-Token-Text-Primary text-sm font-bold font-['Inter'] leading-tight">
                        Hide Profile from Directory
                      </div>
                      <img src="/images/Info.png" alt="tooltip" className="w-[16px]" />
                    </div>
                    <div className="self-stretch justify-start text-Token-Text-Tertiary text-xs font-normal font-['Inter'] leading-none">
                      Hiding will limit your visibility to organizers
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-12 flex justify-start items-center gap-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isActive}
                  onChange={handleToggle}
                />
                <div
                  className={`w-11 h-6 rounded-full ${
                    isActive ? "bg-[#E61E4D]" : "bg-gray-400"
                  } flex items-center px-1 transition-colors`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      isActive ? "translate-x-5" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="self-stretch inline-flex justify-start items-center gap-2">
            <div className="flex-1 flex justify-start items-center gap-2">
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-start text-Token-Text-Primary text-sm font-bold font-['Inter'] leading-tight">
                    Instant Book
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center gap-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isActive}
                  onChange={handleToggle}
                />
                <div
                  className={`w-11 h-6 rounded-full ${
                    isActive ? "bg-[#E61E4D]" : "bg-gray-400"
                  } flex items-center px-1 transition-colors`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      isActive ? "translate-x-5" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch justify-start text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
              Minimum Instant Booking Rate
            </div>
            <div className="w-72 inline-flex justify-start items-center gap-1">
              <div className="flex-1 flex justify-start items-center gap-2">
                <div className="flex-1 justify-start text-Token-Text-Primary text-sm font-bold font-['Inter'] leading-tight">
                  Base Hourly Rate
                </div>
                <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Dark-1 flex justify-center items-center gap-2.5">
                  <div className="justify-start text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight">
                    $150
                  </div>
                </div>
              </div>
              <i class="fa-solid fa-pen-to-square"></i>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
              <div className="self-stretch justify-start text-Token-Text-Primary text-sm font-bold font-['Inter'] leading-tight">
                Additional Rate Options
              </div>
              <div className="self-stretch justify-start text-Token-Text-Tertiary text-xs font-normal font-['Inter'] leading-none">
                If you work different rates for different job types, add each.
              </div>
            </div>
            <i class="fa-solid fa-pen-to-square"></i>
          </div>
        </div>
      </div>

      <div className="self-stretch inline-flex justify-start items-end gap-4 mt-4">
        <div className="flex-1 self-stretch min-w-80 min-h-48 p-6 bg-[#fff] rounded-2xl inline-flex flex-col justify-start items-start gap-2 overflow-hidden">
          <div style={{ width: "100%", height: 250 }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
              Profile Views
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="#999"
                  padding={{ left: 0, right: 20 }}
                />
                <YAxis stroke="#999" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fill="url(#colorViews)"
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex-1 p-6 bg-gradient-to-b from-[#fff] to-[#FFE4E6] rounded-3xl inline-flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="w-96 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-Token-Text-Primary text-xl font-bold font-['Inter'] leading-normal">
                Boost Your Profile & Get Noticed!
              </div>
              <div className="self-stretch justify-start">
                <span class="text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
                  For only{" "}
                </span>
                <span class="text-Token-Text-Secondary text-base font-bold font-['Inter'] leading-snug">
                  $15
                </span>
                <span class="text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
                  {" "}
                  per week, let your brilliance shine:
                </span>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-Token-Text-Secondary text-sm font-normal font-['Inter'] leading-tight">
                Enhanced Exposure: Get featured on our homepage and appear at
                the top of search results.
              </div>
              <div className="self-stretch justify-start text-Token-Text-Secondary text-sm font-normal font-['Inter'] leading-tight">
                Priority Invitations: Be the first choice for high-profile
                events and exclusive gigs.
              </div>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#656565]"></div>
          <div className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
            <div className="justify-start text-Token-Text-On-Dark-BG text-sm font-medium font-['Inter'] leading-tight text-white">
              Boost My Profile Now
            </div>
          </div>
        </div>
      </div>

      <div className="self-stretch inline-flex justify-start items-start gap-4 mt-8">
        <Calendar />

        <div className="inline-flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex-1 p-4 bg-gradient-to-b from-rose-50 to-Token-BG-Neutral-Light-1 rounded-2xl shadow-[0px_3px_17.5px_-1px_rgba(125,125,125,0.10)] outline outline-1 outline-offset-[-1px] outline-[#F9F9F9] flex flex-col justify-start items-start gap-4 overflow-hidden">
            <div className="self-stretch justify-start text-Token-Text-Primary text-xl font-bold font-['Inter'] leading-normal">
              Upcoming Events
            </div>
            <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-2">
              <div
                data-property-1="Default"
                className="self-stretch p-3 bg-[#fff] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#F9F9F9]"
              >
                <div className="inline-flex justify-start items-start gap-4">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">
                      Events Name
                    </div>
                    <div className="self-stretch justify-start text-Token-Text-Secondary text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-Token-Text-Secondary text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                    0:09 PM - 0:03 AM
                  </div>
                </div>
              </div>

              <div
                data-property-1="Default"
                className="self-stretch p-3 bg-[#fff] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#F9F9F9]"
              >
                <div className="inline-flex justify-start items-start gap-4">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">
                      Conference
                    </div>
                    <div className="self-stretch justify-start text-Token-Text-Secondary text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-Token-Text-Secondary text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                    0:09 PM - 0:03 AM
                  </div>
                </div>
              </div>

              <div
                data-property-1="Default"
                className="self-stretch p-3 bg-[#fff] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#F9F9F9]"
              >
                <div className="inline-flex justify-start items-start gap-4">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">
                      Networking Dinner
                    </div>
                    <div className="self-stretch justify-start text-Token-Text-Secondary text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-Token-Text-Secondary text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                    0:09 PM - 0:03 AM
                  </div>
                </div>
              </div>

              <div
                data-property-1="Default"
                className="self-stretch p-3 bg-[#fff] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#F9F9F9]"
              >
                <div className="inline-flex justify-start items-start gap-4">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">
                      Networking Dinner
                    </div>
                    <div className="self-stretch justify-start text-Token-Text-Secondary text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-Token-Text-Secondary text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                    0:09 PM - 0:03 AM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="notifications !mt-8">
        <h3>Latest Updates and Notifications</h3>
        {notifications &&
          notifications.map((item, idx) => (
            <div className="notification" key={idx}>
              <img src="/images/Update Avatar.png" className="flame-icon" />
              <div>
                <strong>{item.name}</strong>{" "}
                {item.type === "job_invite"
                  ? "invited you to"
                  : "wants to join"}{" "}
                <b>{item.jobTitle}</b> - Let's Start the Party!{" "}
                <span className="link">
                  {item.type === "job_invite" ? "View Job" : "View Application"}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
