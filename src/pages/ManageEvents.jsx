import React, { useEffect, useState } from "react";
import "../asset/css/PaymentPage.css";
import ManageEventSidebar from "../components/ManageEventSidebar";
import axios from "axios";
import BASE_URLS from "../config";
import { useNavigate } from "react-router-dom";

const statusColors = {
  Active: "bg-[#D3FFCC] text-[#128807]",
  Pending: "bg-[#FFDBB7] text-[#B25F00]",
  Canceled: "bg-[#FFCCD3] text-[#B00020]",
  Completed: "bg-[#D3FFCC] text-[#128807]",
  Inactive: "bg-[#E0E0E0] text-[#4B4B4B]", // Added for Inactive status
};

const ManageEvents = () => {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventType, setEventType] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false);

  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}jobs`)
      .then((res) => {
        console.log(res.data);
        setEvents(res.data);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
      });
  }, [fetchAgain]);

  // Map API data to match the table's expected structure
  const mappedEvents = events.map((event) => ({
    _id: event._id,
    name: event.eventName,
    organizer: event.organiser.name,
    location: `${event.city}, ${event.country}`,
    date: new Date(event.jobDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    position: `${event.hiredStaff.length}/${event.numberOfPositions}`,
    status: event.isActive ? "Active" : "Inactive",
    staffCategory: event.staffCategory, // For event type filter
    city: event.city, // For location filter
    jobDate: event.jobDate, // For time range filter
  }));

  // Get unique event types and locations for dropdowns
  const uniqueEventTypes = [
    ...new Set(events.map((event) => event.staffCategory)),
  ];
  const uniqueLocations = [...new Set(events.map((event) => event.city))];

  // Filter events based on search and dropdowns
  const filtered = mappedEvents.filter((e) => {
    const matchesSearch = (
      e.name +
      e.organizer +
      e.location +
      e.date +
      e.status
    )
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesEventType = eventType ? e.staffCategory === eventType : true;
    const matchesLocation = locationFilter ? e.city === locationFilter : true;
    const matchesStatus = statusFilter ? e.status === statusFilter : true;

    const matchesTimeRange = timeRange
      ? (() => {
          const jobDate = new Date(e.jobDate);
          const now = new Date();
          if (timeRange === "Last 30 days") {
            return jobDate >= new Date(now.setDate(now.getDate() - 30));
          }
          if (timeRange === "Last 7 days") {
            return jobDate >= new Date(now.setDate(now.getDate() - 7));
          }
          return true;
        })()
      : true;

    return (
      matchesSearch &&
      matchesEventType &&
      matchesLocation &&
      matchesStatus &&
      matchesTimeRange
    );
  });

  return (
    <div className="kaab-payment-container manage-events">
      {/* Header */}
      <div className="kaab-support-header">
        <div>
          <h1 className="kaab-payment-heading">Manage Events</h1>
          <p className="kaab-payment-subtext">
            Review event details, track booking statuses, and update event
            information—all in one place.
          </p>
        </div>
        <button
          onClick={() => navigate("/multi-step")}
          type="button"
          className="px-6 py-3 w-full md:w-fit rounded-lg inline-flex justify-center items-center gap-2 text-white text-base font-medium font-['Inter'] leading-snug overflow-hidden"
          style={{
            background:
              "linear-gradient(272deg, #E31F87 1.58%, #E61E4D 98.73%)",
          }}
        >
          Create New Event
        </button>
      </div>

      {/* Search & Filters */}
      <div className="kaab-search-filter-bar">
        <div className="search-box-c d-flex">
          <img src="/images/search-icon.png" alt="icon" />
          <input
            type="text"
            className="kaab-search-input"
            placeholder="Search events by name, organizer, or event ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4">
          <div className="relative inline-flex items-center">
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
            >
              <option value="">Event Type</option>
              {uniqueEventTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute right-2 pointer-events-none">
              <div className="w-5 h-5 relative flex items-center justify-center">
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </div>
          </div>
          <div className="relative inline-flex items-center">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
            >
              <option value="">Location</option>
              {uniqueLocations.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <div className="absolute right-1 pointer-events-none">
              <div className="w-5 h-5 relative flex items-center justify-center">
                <i className="ri-arrow-down-s-line text-Token-Text-Secondary text-lg" />
              </div>
            </div>
          </div>
          <div className="relative inline-flex items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="absolute right-2 pointer-events-none">
              <div className="w-5 h-5 relative flex items-center justify-center">
                <i className="ri-arrow-down-s-line text-Token-Text-Secondary text-lg" />
              </div>
            </div>
          </div>
          <div className="relative inline-flex items-center">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
            >
              <option value="">All Time</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 7 days">Last 7 days</option>
            </select>
            <div className="absolute right-2 pointer-events-none">
              <div className="w-5 h-5 relative flex items-center justify-center">
                <i className="ri-arrow-down-s-line text-Token-Text-Secondary text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full h-full shrink-0 overflow-x-auto md:overflow-hidden rounded-2xl border border-[#ECECEC] flex flex-col zole-table mt-4">
        {/* Table Head */}
        <div className="flex w-full min-w-[800px] bg-white items-center table-heads">
          {[
            "Event Name",
            "Organizer",
            "Location",
            "Date",
            "Position",
            "Status",
            "Actions",
          ].map((heading, i) => (
            <div
              key={i}
              className={`p-3 border-r border-[#ECECEC] flex justify-center items-center ${
                i === 0 ? "flex-[1.5]" : "flex-1"
              }`}
            >
              <span className="text-[#3D3D3D] text-sm font-medium font-['Inter']">
                {heading}
              </span>
            </div>
          ))}
        </div>

        {/* Table Body */}
        {filtered.map((event, index) => (
          <div
            key={index}
            className="flex w-full min-w-[800px] border-b border-[#656565] items-center table-bodies"
          >
            <div className="p-3 border-r border-[#ECECEC] flex-[1.5] justify-start items-center flex font-semibold text-sm text-[#292929]">
              {event.name}
            </div>
            <div className="p-3 border-r border-[#ECECEC] flex-1 text-rose-600 underline text-sm text-center">
              {event.organizer}
            </div>
            <div className="p-3 border-r border-[#ECECEC] flex-1 text-center text-sm">
              {event.location}
            </div>
            <div className="p-3 border-r border-[#ECECEC] flex-1 text-center text-sm">
              {event.date}
            </div>
            <div className="p-3 border-r border-[#ECECEC] flex-1 text-center text-sm">
              {event.position}
            </div>
            <div className="p-3 border-r border-[#ECECEC] flex-1 flex justify-center">
              <div
                className={`px-4 py-2 rounded-full text-xs font-medium ${
                  statusColors[event.status]
                }`}
              >
                {event.status}
              </div>
            </div>
            <div className="p-3 flex-1 flex justify-center items-center">
              <button
                onClick={() => setSelectedUserId(event._id)}
                className="text-pink-600 border-1 border-pink-600 px-3 py-1 rounded-full hover:underline text-xs"
              >
                View
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-6 min-w-[800px]">
            No events found.
          </div>
        )}
      </div>

      {selectedUserId && (
        <ManageEventSidebar
          userId={selectedUserId}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          onClose={() => {
            setSelectedUserId(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageEvents;
