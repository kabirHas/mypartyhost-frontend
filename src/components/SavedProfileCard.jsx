import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import BASE_URLS from "../config"; // Assuming this is available or import as needed

function SavedProfileCard({ staff, index, jobs, handleRemove, loading }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [message, setMessage] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const handleInviteClick = () => {
    setShowModal(true);
  };

  const handleSendInvite = () => {
    if (!selectedJob) {
      alert('Please select an event.');
      return;
    }

    setInviteLoading(true);

    axios
      .post(
        `${BASE_URLS.BACKEND_BASEURL}jobs/${selectedJob}/invite/${staff._id}`,
        { message },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        console.log("Invite Response:", res.data);
        setShowModal(false);
        setSelectedJob(null);
        setMessage('');
        // You can add a success toast or notification here if you have a library for it
      })
      .catch((err) => {
        console.error("Error sending invite:", err.response?.data || err.message);
        // You can add an error toast here
      })
      .finally(() => {
        setInviteLoading(false);
      });
  };

  return (
    <>
      <div
        key={staff._id + index}
        className="bg-white border md:w-[85%] border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-start gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold capitalize font-['Inter'] leading-normal">{staff.name}</h3>
            <div className="text-sm text-right">
              {staff.staffProfile?.baseRate && (
                <div className="font-medium text-lg">Rate: ${staff.staffProfile.baseRate}/hr</div>
              )}
              <Link to={`/staff-profile/${staff._id}`} className="text-[#E61E4D] no-underline font-medium hover:underline">
                View Profile
              </Link>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 gap-1">
            <i className="ri-star-fill text-yellow-500 text-base" />
            <span className="font-medium text-yellow-500">{staff.averageRating || "0"}/5</span>
            <Link to="#" className="underline justify-start text-[#656565] text-sm font-medium font-['Inter'] underline leading-tight">
              ({staff.reviews?.length || 0} Reviews)
            </Link>
          </div>

          <div className="flex items-center text-sm text-[#656565] mt-1">
            <i className="ri-map-pin-line mr-1 text-base" />
            <span>{staff.city}, {staff.country}</span>
          </div>

          <p className="self-stretch justify-start text-[#656565] my-3 text-base font-normal font-['Inter'] leading-snug">{staff.bio || "No bio available."}</p>

          <p className="justify-start text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug mt-2">
            <span className="font-semibold">Next Available:</span>{" "}
            {staff.staffProfile.availableDates && staff.staffProfile.availableDates.length > 0
              ? new Date(staff.staffProfile.availableDates[0]).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Not available"}
          </p>

          <hr className="border-zinc-100 mt-4 border-2" />

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              onClick={() => handleRemove(staff._id)}
              className="px-4 py-2 border-1 border-[#E61E4D] text-[#E61E4D] rounded-lg hover:bg-[#E61E4D] hover:text-white text-sm flex items-center gap-1"
              disabled={loading[staff._id]}
            >
              {loading[staff._id] ? (
                "Removing..."
              ) : (
                <>
                  Remove From Shortlist <i className="ri-heart-fill text-red-500" />
                </>
              )}
            </button>
            <button
              onClick={handleInviteClick}
              className="px-4 py-2 border-2 border-[#E61E4D] bg-gradient-to-l from-pink-600 to-rose-600 text-white rounded-lg text-sm hover:bg-[#E61E4D]"
            >
              Invite to Job
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Invite */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Invite to Job</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Event:</label>
              {jobs.length === 0 ? (
                <p className="text-gray-500">No events available.</p>
              ) : (
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={selectedJob || ''}
                  onChange={(e) => setSelectedJob(e.target.value)}
                >
                  <option value="">-- Select an Event --</option>
                  {jobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.eventName} ({new Date(job.jobDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Message:</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your invite message..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                disabled={inviteLoading || !selectedJob}
                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
              >
                {inviteLoading ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SavedProfileCard;