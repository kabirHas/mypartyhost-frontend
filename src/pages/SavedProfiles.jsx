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
  const [sortBy, setSortBy] = useState("Rating");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [loading, setLoading] = useState({}); // Track loading state for each remove action

  useEffect(() => {
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
            // <div
            //   key={staff._id + index}
            //   className="bg-white border md:w-[85%] border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-start gap-4"
            // >
            //   <div className="flex-1">
            //     <div className="flex items-center justify-between">
            //       <h3 className="text-lg capitalize font-semibold">{staff.name}</h3>
            //       <div className="text-sm text-right">
            //         {staff.staffProfile?.baseRate && (
            //           <div className="font-medium text-lg">Rate: ${staff.staffProfile.baseRate}/hr</div>
            //         )}
            //         <a href={`/profile/${staff._id}`} className="text-pink-700 no-underline font-medium hover:underline">
            //           View Profile
            //         </a>
            //       </div>
            //     </div>

            //     <div className="flex items-center text-sm text-gray-500 gap-1">
            //       <i className="ri-star-fill text-yellow-500 text-base" />
            //       <span className="font-medium text-yellow-500">{staff.averageRating || "0"}/5</span>
            //       <Link to="#" className="underline text-zinc-400">
            //         ({staff.reviews?.length || 0} Reviews)
            //       </Link>
            //     </div>

            //     <div className="flex items-center text-sm text-gray-500 mt-1">
            //       <i className="ri-map-pin-line mr-1 text-base" />
            //       <span>{staff.city}, {staff.country}</span>
            //     </div>

            //     <p className="text-sm text-gray-700 mt-2">{staff.bio || "No bio available."}</p>

            //     <p className="text-sm text-gray-900 font-semibold mt-2">
            //       <span className="font-semibold">Next Available:</span>{" "}
            //       {staff.staffProfile.availableDates && staff.staffProfile.availableDates.length > 0
            //         ? new Date(staff.staffProfile.availableDates[0]).toLocaleDateString("en-GB", {
            //             weekday: "long",
            //             day: "numeric",
            //             month: "long",
            //             year: "numeric",
            //           })
            //         : "Not available"}
            //     </p>

            //     <hr className="border-gray-400 mt-4 border-2"  />

            //     <div className="flex items-center justify-end gap-2 mt-4">
            //       <button
            //         onClick={() => handleRemove(staff._id)}
            //         className="px-4 py-2 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-600 hover:text-white text-sm flex items-center gap-1"
            //         disabled={loading[staff._id]}
            //       >
            //         {loading[staff._id] ? (
            //           "Removing..."
            //         ) : (
            //           <>
            //             Remove From Shortlist <i className="ri-heart-fill text-red-500" />
            //           </>
            //         )}
            //       </button>
            //       <button className="px-4 py-2 border-2 border-pink-600 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700">
            //         Invite to Job
            //       </button>
            //     </div>
            //   </div>
            // </div>
            <SavedProfileCard
              key={staff._id + index}
              staff={staff}
              index={index}
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
