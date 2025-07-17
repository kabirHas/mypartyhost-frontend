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
  const [isActive, setIsActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRates, setNewRates] = useState([]);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
    setIsAddingNew(false); // Reset adding state when closing modal
    setNewRates([]); // Clear new rates when closing modal
  };

  const handleAddNewRate = () => {
    setIsAddingNew(true);
    setNewRates([...newRates, { service: "Bikini Waitress", rate: "$200" }]);
  };

  const handleSave = () => {
    // Implement save logic here (e.g., API call to save new rates)
    setIsAddingNew(false);
    setIsModalOpen(false);
    setNewRates([]);
  };

  const handleAvailabilityModalToggle = () => {
    setIsAvailabilityModalOpen((prev) => !prev);
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
                  <div className="justify-start text-[#292929] text-xs font-normal font-['Inter'] leading-none">
                    Confirmed
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Role: Hostess
                </div>
                <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Rate: $100/hr
                </div>
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-3 flex-wrap content-center">
              <div className="flex justify-start items-center gap-2">
                <i className="ri-map-pin-2-fill"></i>
                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                  123 Harbour Street, Sydney, NSW
                </div>
              </div>
              <div className="flex justify-start items-center gap-2">
                <i className="ri-calendar-check-line"></i>
                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                  15th March 2025
                </div>
              </div>
              <div className="flex justify-start items-center gap-2">
                <i className="ri-time-fill"></i>
                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                  6:00 PM – 11:00 PM
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
            <div className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight text-white">
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
              <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                Samantha R. wants to book you for private party
              </div>
              <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                Joe R. wants to book you for VIP Event
              </div>
              <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                Sam K. wants to book you for private party
              </div>
            </div>
          </div>
          <div className="w-72 h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
            <div className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
              <div className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight text-white">
                View Booking Request
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 self-stretch p-6 bg-gradient-to-b from-[#fff] to-[#fff1f2] rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#656565] inline-flex flex-col justify-start items-start gap-2">
          <div className="self-stretch inline-flex justify-start items-center gap-2">
            <div className="flex-1 flex justify-start items-center gap-2">
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="inline-flex justify-start items-center gap-1">
                      <div className="justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                        Hide Profile from Directory
                      </div>
                      <div className="relative group">
                        <img
                          src="/images/Info.png"
                          alt="tooltip"
                          className="w-[16px]"
                        />
                        <div className="absolute -bottom-[150px] left-1/3 transform -translate-x-1/2 mb-2 hidden group-hover:block w-80 p-3 bg-[#FFF1F2] z-24 rounded-2xl shadow-[0px_9px_13.699999809265137px_-4px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-[#656565] inline-flex justify-center items-center gap-2.5 overflow-hidden">
                          <div className="flex-1 justify-start">
                            <span className="text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                              If you hide your profile, you are not visible to
                              event organisers. You will only be visible to them
                              when you apply for their events.
                            </span>
                            <span className="text-[#E61E4D] text-sm font-normal font-['Inter'] underline leading-tight">
                              Learn More
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
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
                  <div className="self-stretch justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
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
            <div className="self-stretch justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
              Minimum Instant Booking Rate
            </div>
            <div className="w-full inline-flex justify-start items-center gap-1">
              <div className="flex-1 flex justify-start items-center gap-2">
                <div className="flex-1 justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                  Base Hourly Rate
                </div>
                <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5">
                  <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                    $150
                  </div>
                </div>
              </div>
              <i className="fa-solid fa-pen-to-square"></i>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
              <div className="self-stretch justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                Additional Rate Options
              </div>
              <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                If you work different rates for different job types, add each.
              </div>
            </div>
            <i
              id="addtionalRateOptions"
              className="fa-solid fa-pen-to-square cursor-pointer"
              onClick={handleModalToggle}
            ></i>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="p-6 bg-white rounded-2xl shadow-[0px_0px_231.1999969482422px_9px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-[#656565] inline-flex flex-col justify-center items-start gap-4 overflow-hidden">
            <div className="self-stretch inline-flex justify-end items-center gap-2.5">
              <div className="flex-1 justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Manage Instant Booking
              </div>
              <div
                className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5 cursor-pointer"
                onClick={handleModalToggle}
              >
                <i className="ri-close-line text-lg"></i>
              </div>
            </div>
            <div className="w-[517px] flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-[#656565] text-base font-bold font-['Inter'] leading-snug">
                  Instant Booking Rate
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                      Base Hourly Rate
                    </div>
                    <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5">
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        $150
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-[#656565] text-base font-bold font-['Inter'] leading-snug">
                    Rate By Services
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-4">
                    <div className="flex-1 justify-start text-black text-sm font-bold font-['Inter'] leading-tight">
                      Bikini Waitress
                    </div>
                    <div className="flex justify-start items-center gap-2">
                      <div className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center">
                        <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          $200
                        </div>
                      </div>
                      <div className="py-0.2 px-1 bg-zinc-600 rounded-sm text-white flex justify-start items-center gap-2.5">
                        <i className="ri-subtract-line"></i>
                      </div>
                    </div>
                  </div>
                  {newRates.map((rate, index) => (
                    <div
                      key={index}
                      className="w-[509px] inline-flex justify-between items-center"
                    >
                      <div className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Dark-2 flex justify-center items-center gap-2.5">
                        <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                          {rate.service}
                        </div>
                        <i className="ri-arrow-down-s-line"></i>
                      </div>
                      <div className="flex justify-start items-center gap-2">
                        <div className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Dark-2 flex justify-center items-center gap-2.5">
                          <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                            {rate.rate}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
                  onClick={isAddingNew ? handleSave : handleAddNewRate}
                >
                  <div className="justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                    {isAddingNew ? "Save" : "Add New"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAvailabilityModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-[479px] p-6 bg-white rounded-2xl shadow-[0px_0px_231.1999969482422px_9px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch inline-flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                    Select Available Dates
                  </div>
                  <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    15 Date Selected
                  </div>
                </div>
                <div
                  className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5 cursor-pointer"
                  onClick={handleAvailabilityModalToggle}
                >
                  <i className="ri-close-line text-lg"></i>
                </div>
              </div>
              <div
                data-select-all="true"
                data-select-button="true"
                data-unselect-all="false"
                className="self-stretch min-w-80 p-4 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-start items-start gap-3"
              >
                <div className="self-stretch shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.25)] inline-flex justify-between items-center">
                  <i className="ri-arrow-left-s-line text-lg"></i>
                  <div className="text-center justify-center text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    March 2025
                  </div>
                  <i className="ri-arrow-right-s-line text-lg"></i>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                    <div className="text-center justify-center text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      SUN
                    </div>
                  </div>
                  <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                    <div className="text-center justify-center text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      MON
                    </div>
                  </div>
                  <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                    <div className="text-center justify-center text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      TUE
                    </div>
                  </div>
                  <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                    <div className="text-center justify-center text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      WED
                    </div>
                  </div>
                  <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                    <div className="text-center justify-center text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      THU
                    </div>
                  </div>
                  <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                    <div className="text-center justify-center text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      FRI
                    </div>
                  </div>
                  <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                    <div className="text-center justify-center text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      SAT
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div
                      data-property-1="Previous"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">
                        26
                      </div>
                    </div>
                    <div
                      data-property-1="Previous"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">
                        27
                      </div>
                    </div>
                    <div
                      data-property-1="Previous"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">
                        28
                      </div>
                    </div>
                    <div
                      data-property-1="Previous"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">
                        29
                      </div>
                    </div>
                    <div
                      data-property-1="Previous"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">
                        30
                      </div>
                    </div>
                    <div
                      data-property-1="Previous"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">
                        31
                      </div>
                    </div>
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div
                      data-property-1="Today"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#ffffff] text-sm font-normal font-['Inter'] leading-tight">
                        2
                      </div>
                    </div>
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        3
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        4
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        5
                      </div>
                    </div>
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        6
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        7
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        8
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        9
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        10
                      </div>
                    </div>
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        11
                      </div>
                    </div>
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        12
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        13
                      </div>
                    </div>
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        14
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        15
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        16
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        17
                      </div>
                    </div>
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        18
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        19
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        20
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        21
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        22
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        23
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        24
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        25
                      </div>
                    </div>
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        26
                      </div>
                    </div>
                    <div
                      data-property-1="Selected"
                      className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#FFFFFF] text-sm font-normal font-['Inter'] leading-tight">
                        27
                      </div>
                    </div>
                    <div
                      data-property-1="Default"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                        28
                      </div>
                    </div>
                    <div
                      data-property-1="Previous"
                      className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5"
                    >
                      <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">
                        1
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch inline-flex justify-end items-center gap-3">
                  <div className="px-2 py-1 bg-[#FFF1F2] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-start items-center gap-2">
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Select All
                    </div>
                    <i className="ri-check-line"></i>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden">
                <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                  Update Availability
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Boost Your Profile & Get Noticed!
              </div>
              <div className="self-stretch justify-start">
                <span className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  For only{" "}
                </span>
                <span className="text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                  $15
                </span>
                <span className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  {" "}
                  per week, let your brilliance shine:
                </span>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                Enhanced Exposure: Get featured on our homepage and appear at
                the top of search results.
              </div>
              <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                Priority Invitations: Be the first choice for high-profile
                events and exclusive gigs.
              </div>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#656565]"></div>
          <div className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
            <div className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight text-white">
              Boost My Profile Now
            </div>
          </div>
        </div>
      </div>

      <div className="self-stretch inline-flex justify-start items-start gap-4 mt-8">
        <Calendar setIsAvailabilityModalOpen={setIsAvailabilityModalOpen} />
        <div className="inline-flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex-1 p-4 bg-gradient-to-b from-rose-50 to-[#FFFFFF] rounded-2xl shadow-[0px_3px_17.5px_-1px_rgba(125,125,125,0.10)] outline outline-1 outline-offset-[-1px] outline-[#F9F9F9] flex flex-col justify-start items-start gap-4 overflow-hidden">
            <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              Upcoming Events
            </div>
            <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-2">
              <div
                data-property-1="Default"
                className="self-stretch p-3 bg-[#fff] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#F9F9F9]"
              >
                <div className="inline-flex justify-start items-start gap-4">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Events Name
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
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
                    <div className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Conference
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
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
                    <div className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Networking Dinner
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
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
                    <div className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Networking Dinner
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
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
                <b>{item.job}</b> - {item.ending}{" "}
                <span className="link">{item.link}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
