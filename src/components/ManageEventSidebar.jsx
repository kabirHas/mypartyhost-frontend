import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URLS from "../config";
import { Link } from "react-router-dom";

const ManageEventSidebar = ({ userId, onClose = false }) => {
  const [isActive, setIsActive] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleDelete = () => {
    // TODO: Replace with your API call to delete event
    console.log("Event deleted");
    setShowDeletePopup(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed top-0 right-0 w-full sm:w-[600px] h-full bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto scrollbar-hide">
      <div className="self-stretch w-full px-4 py-6 bg-Token-BG-Neutral-Light-1 border-b border-Token-Border-&-Divider-Neutral-Light-2 inline-flex justify-start items-center gap-6">
        <button onClick={onClose} className="text-gray-800 text-xl">
          <i className="ri-arrow-left-line"></i>
        </button>
        <div className="text-Token-Text-Primary text-xl font-bold font-['Inter'] leading-normal">
          VIP Gala Night
        </div>
      </div>

      <div className="self-stretch px-4 pt-4 pb-6 inline-flex flex-col justify-start items-start gap-4">
        <div className="self-stretch p-4 bg-Token-BG-Neutral-Light-2 rounded-2xl flex flex-col justify-start items-start gap-3.5">
          <div className="text-black text-base font-bold font-['Inter'] leading-snug">
            VIP Gala Night
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
              This exclusive gala event features a high-end experience for VIP
              guests. The event includes a cocktail reception, live
              entertainment, and premium services. All details have been
              verified and approved by the organizer.
            </div>
            <Link to="#" className="text-[#e61e4c] hover:underline font-medium">
              View Job
            </Link>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div
              className="w-full h-0 outline outline-1"
              style={{ outlineColor: "#ECECEC", outlineOffset: "-0.5px" }}
            ></div>
            <div className="w-full flex justify-end items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="text-black text-sm font-medium font-['Inter'] leading-tight">
                  Active
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isActive}
                    onChange={handleToggle}
                  />
                  <div
                    className={`w-11 h-6 rounded-full ${
                      isActive ? "bg-pink-600" : "bg-gray-400"
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
              <button
                onClick={() => setShowDeletePopup(true)}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium font-['Inter'] leading-tight"
                style={{
                  background:
                    "linear-gradient(272deg, #E31F87 1.58%, #E61E4D 98.73%)",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="self-stretch p-4 bg-Token-BG-Neutral-Light-2 rounded-2xl flex flex-col gap-4">
          <div className="text-xl font-bold text-Token-Text-Primary font-['Inter'] leading-normal">
            Basic Information
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="text-base text-Token-Text-Primary">
                  Organizer:
                </div>
                <Link
                  to="#"
                  className="text-[#e61e4c] hover:underline font-medium"
                >
                  Robert John
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-base text-Token-Text-Primary">
                  Location:
                </div>
                <div className="font-medium">Sydney, NSW</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-base text-Token-Text-Primary">Date:</div>
                <div className="font-medium">March 15, 2025</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-base text-Token-Text-Primary">Time:</div>
                <div className="font-medium">6:00 PM – 11:00 PM</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-base text-Token-Text-Primary">
                  Total Positions:
                </div>
                <div className="font-medium">150</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-base text-Token-Text-Primary">
                  Bookings:
                </div>
                <div className="font-medium">120 Confirmed, 30 Pending</div>
              </div>
            </div>
            <div
              className="w-full h-0 outline outline-1"
              style={{ outlineColor: "#ECECEC", outlineOffset: "-0.5px" }}
            ></div>
            <div className="w-full flex justify-end">
              <button
                className="px-4 py-2 rounded-lg outline outline-1 text-sm font-medium font-['Inter'] leading-tight"
                style={{
                  outlineColor: "#E61E4D",
                  color: "#E61E4D",
                  outlineOffset: "-1px",
                }}
              >
                View Detailed Booking List
              </button>
            </div>
          </div>
        </div>

        {/* Revenue & Financials */}
        <div className="self-stretch p-4 bg-Token-BG-Neutral-Light-2 rounded-2xl flex flex-col gap-4">
          <div className="text-xl font-bold text-Token-Text-Primary font-['Inter'] leading-normal">
            Revenue & Financials
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="text-base text-Token-Text-Primary">
                  Total Event Revenue:
                </div>
                <div className="font-medium">$12,000</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-base text-Token-Text-Primary">
                  Payments Made:
                </div>
                <div className="font-medium">$9,500</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-base text-Token-Text-Primary">
                  Pending Payments:
                </div>
                <div className="font-medium">$2,500</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-base text-Token-Text-Primary">
                  Commission Earned:
                </div>
                <div className="font-medium">$1,800</div>
              </div>
            </div>
            <div
              className="w-full h-0 outline outline-1"
              style={{ outlineColor: "#ECECEC", outlineOffset: "-0.5px" }}
            ></div>
            <div className="w-full flex justify-end items-center gap-4">
              <Link to="#" className="text-[#e61e4c] font-medium no-underline">
                Download CSV
              </Link>
              <button
                className="px-4 py-2 rounded-lg outline outline-1 text-sm font-medium font-['Inter'] leading-tight"
                style={{
                  outlineColor: "#E61E4D",
                  color: "#E61E4D",
                  outlineOffset: "-1px",
                }}
              >
                Detailed Transactions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed top-0 right-0 z-50 w-[600px] h-full flex items-center justify-center bg-[#00000047]">
          <div className="bg-white w-[90%] max-w-md rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold text-[#e61e4d]">Delete Event?</h2>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="text-gray-500 text-xl"
              >
                &times;
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              You’re about to permanently delete the event <b>“VIP Gala Night”</b>
            </p>
            <ul className="list-disc pl-5 mt-3 text-sm text-gray-700 space-y-1">
              <li>Cancel all confirmed bookings</li>
              <li>Notify all assigned hostesses and the organizer</li>
              <li>Remove the event and its data from the platform</li>
            </ul>
            <p className="mt-3 text-sm text-gray-600 font-medium">
              This action cannot be undone. Are you sure you want to proceed?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md text-white text-sm font-medium"
                style={{
                  background:
                    "linear-gradient(272deg, #E31F87 1.58%, #E61E4D 98.73%)",
                }}
              >
                Yes, Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEventSidebar;
