import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URLS from "../config";
import { Link } from "react-router-dom";
import SavedProfileCard from "../components/SavedProfileCard";

// Inline Switch Component
function Switch({ checked, onCheckedChange }) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        checked ? "bg-pink-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SavedProfiles() {
  const [staffList, setStaffList] = useState([]);
  const [jobs, setJobs] = useState([]); // New state for organizer's events/jobs
  const [sortBy, setSortBy] = useState("Rating");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [loading, setLoading] = useState({}); // Track loading state for each remove action

  useEffect(() => {
    // Fetch saved staff profiles
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}save-profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        console.log("Staff List Response:", res.data);
        setStaffList(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching staff list:", err);
      });

    // Fetch organizer's events/jobs
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}jobs/my-jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        console.log("Jobs List Response:", res.data);
        setJobs(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
      });
  }, []);

  // Handle removing a profile from the shortlist
  const handleRemove = (staffId) => {
    if (loading[staffId]) return; // Prevent multiple clicks
    setLoading((prev) => ({ ...prev, [staffId]: true }));

    axios
      .put(
        `${BASE_URLS.BACKEND_BASEURL}save-profile/${staffId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        console.log("Remove Profile Response:", res.data);
        // Update staffList by filtering out the removed profile
        setStaffList((prev) => prev.filter((staff) => staff._id !== staffId));
      })
      .catch((err) => {
        console.error(
          "Error removing profile:",
          err.response?.data || err.message
        );
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, [staffId]: false }));
      });
  };

  const sortedList = [...staffList].sort((a, b) => {
    if (sortBy === "Rating")
      return (b.averageRating || 0) - (a.averageRating || 0);
    if (sortBy === "Location") return a.city.localeCompare(b.city);
    if (sortBy === "Rate")
      return (a.staffProfile?.baseRate || 0) - (b.staffProfile?.baseRate || 0);
    return 0;
  });

  const filteredList = availabilityOnly
    ? sortedList.filter((item) => item.staffProfile?.instantBook)
    : sortedList;

  return (
    <div className="mx-auto py-6">
      <h2 className="self-stretch justify-start text-[#292929] text-3xl font-bold font-['Inter'] leading-9 tracking-tight">
        Saved Event Staff
      </h2>
      <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
        Keep track of your top-rated event staff for quick and easy bookings
        when you need them.
      </p>

      <div className="flex items-center justify-end gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Availability</span>
          <Switch
            checked={availabilityOnly}
            onCheckedChange={setAvailabilityOnly}
          />
        </div>

        <div className="relative px-3 py-2 bg-zinc-100 rounded-full outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-2">
          <select
            className="appearance-none bg-transparent text-base font-medium font-['Inter'] leading-snug text-zinc-600 pr-8 focus:outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Rating</option>
            <option value="location">Location</option>
            <option value="rate">Rate</option>
          </select>
          <div className="absolute right-2 pointer-events-none w-6 h-4">
            <svg
              className="w-6 h-4 text-zinc-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 7l4-4 4 4" />
              <path d="M8 17l4 4 4-4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <p className="text-gray-500">No saved profiles found.</p>
        ) : (
          filteredList.map((staff, index) => (
            <SavedProfileCard
              key={staff._id + index}
              staff={staff}
              index={index}
              jobs={jobs} // Pass jobs to each card
              handleRemove={handleRemove}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default SavedProfiles;