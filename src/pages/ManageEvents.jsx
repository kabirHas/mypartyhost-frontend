import React, { useState } from "react";
import "../asset/css/PaymentPage.css";
import ManageEventSidebar from "../components/ManageEventSidebar";

const events = [
  {
    _id: "heiskjk87389",
    name: "VIP Gala Night",
    organizer: "Robert John",
    location: "Sydney, NSW",
    date: "Mar 15, 2025",
    position: "7/10",
    status: "Active",
  },
  {
    name: "Corporate Launch Party",
    organizer: "John Doe",
    location: "Melbourne, VIC",
    date: "Mar 20, 2025",
    position: "0/15",
    status: "Pending",
  },
  {
    name: "Beach Party Extravaganza",
    organizer: "Mr. Max",
    location: "Brisbane, QLD",
    date: "Apr 02, 2025",
    position: "32/40",
    status: "Canceled",
  },
  {
    name: "Birthday Celebration",
    organizer: "Pat Cummins",
    location: "Perth, WA",
    date: "1 day ago",
    position: "48/50",
    status: "Completed",
  },
];

const statusColors = {
  Active: "bg-[#D3FFCC] text-[#128807]",
  Pending: "bg-[#FFDBB7] text-[#B25F00]",
  Canceled: "bg-[#FFCCD3] text-[#B00020]",
  Completed: "bg-[#D3FFCC] text-[#128807]",
};

const ManageEvents = () => {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const filtered = events.filter((e) =>
    (e.name + e.organizer + e.location + e.date + e.status)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
          className="px-6 py-3 rounded-lg inline-flex justify-center items-center gap-2 text-white text-base font-medium font-['Inter'] leading-snug overflow-hidden"
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
                className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
              >
                <option value="">Event Type</option>
                <option value="organiser">Organiser</option>
                <option value="staff">Staff</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <div className="absolute right-2 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i class="ri-arrow-down-s-line"></i>
                </div>
              </div>
            </div>
            <div className="relative inline-flex items-center">
              <select
                className="pl-3 pr-[25px] py-2  bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
              >
                <option value="">Location</option>
                <option value="1 hr">1 Hour</option>
                <option value="24 hrs">24 Hours</option>
              </select>
              <div className="absolute right-1 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i className="ri-arrow-down-s-line text-Token-Text-Secondary text-lg" />
                </div>
              </div>
            </div>
            <div className="relative inline-flex items-center">
              <select
                className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
              >
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">In Active</option>
              </select>
              <div className="absolute right-2 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i className="ri-arrow-down-s-line text-Token-Text-Secondary text-lg" />
                </div>
              </div>
            </div>
            <div className="relative inline-flex items-center">
              <select
                className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
              >
                <option value="">Last 30 days</option>
                <option value="Active">Active</option>
                <option value="Inactive">In Active</option>
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
      <div className="w-full h-full overflow-hidden rounded-2xl border border-[#ECECEC] flex flex-col zole-table mt-4">
        <div className="flex w-full bg-white items-center table-heads">
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

        {filtered.map((event, index) => (
          <div
            key={index}
            className="flex w-full border-b border-[#656565] items-center table-bodies"
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

        {filtered.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-6">
            No events found.
          </div>
        )}
      </div>

      {selectedUserId && (
        <ManageEventSidebar
          userId={selectedUserId}
          onClose={() => {
            setSelectedUserId(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageEvents;
