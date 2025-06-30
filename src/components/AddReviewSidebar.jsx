import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URLS from "../config";
import { Link } from "react-router-dom";

const AddReviewSidebar = ({ onClose }) => {
  const [reviewType, setReviewType] = useState("Event Organizer");
  const [reviewerName, setReviewerName] = useState("");
  const [eventName, setEventName] = useState(
    "Private yacht party – March 2025"
  );
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(4);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      reviewType,
      reviewerName,
      eventName,
      feedback,
      rating,
    };
    console.log("Submitted Review:", reviewData);
    // You can now POST to backend if needed
    onClose(); // Close after submit
  };

  return (
    <div className="fixed top-0 right-0 w-full sm:w-[600px] h-full bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto scrollbar-hide">
      <div className="self-stretch w-full px-4 py-6 bg-Token-BG-Neutral-Light-1 border-b border-Token-Border-&-Divider-Neutral-Light-2 inline-flex justify-start items-center gap-6 ">
        <button onClick={onClose} className="text-gray-800 text-xl">
          <i className="ri-arrow-left-line"></i>
        </button>
        <div className="text-Token-Text-Primary text-xl font-bold font-['Inter'] leading-normal">
          Add New Review
        </div>
      </div>

      <div className="self-stretch h-[100%] relative overflow-hidden">
        <div className="self-stretch p-4 bg-Token-BG-Neutral-Light-2 rounded-2xl flex flex-col justify-start items-start gap-4 bg-[#F9F9F9] m-[10px]">
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-Token-Text-Primary text-base font-bold font-['Inter'] leading-snug">
                Reviewer Type
              </div>
              <select
                className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-full outline outline-1 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Dark-1 text-Token-Text-Secondary text-base font-medium font-['Inter'] leading-snug"
                value={reviewType}
                onChange={(e) => setReviewType(e.target.value)}
              >
                <option value="Event Organizer">Event Organizer</option>
                <option value="Client">Client</option>
                <option value="Guest">Guest</option>
              </select>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-Token-Text-Primary text-base font-bold font-['Inter'] leading-snug">
                Reviewer Name
              </div>

              <input
                type="text"
                placeholder="Name (auto fill – while typing or show suggestion)"
                className="self-stretch px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-full outline outline-1 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Dark-1 text-Token-Text-Tertiary text-base font-normal font-['Inter'] leading-snug"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
              />
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-Token-Text-Primary text-base font-bold font-['Inter'] leading-snug">
                Event
              </div>

              <select
                className="self-stretch px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-full outline outline-1 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Dark-1 text-Token-Text-Secondary text-base font-medium font-['Inter'] leading-snug"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              >
                <option>Private yacht party – March 2025</option>
                <option>VIP Gala Night</option>
                <option>Corporate Launch Party</option>
              </select>
            </div>
            <div className="self-stretch h-40 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch inline-flex justify-start items-center gap-3">
                <div className="flex-1 justify-start text-Token-Text-Secondary text-base font-bold font-['Inter'] leading-snug">
                  Feedback
                </div>
              </div>
              <textarea
                placeholder="Write Feedback"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="self-stretch flex-1 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Dark-1 text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug"
              />
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-Token-Text-Secondary text-base font-bold font-['Inter'] leading-snug">
                Rating
              </div>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    onClick={() => setRating(star)}
                    className={` ri-star-fill w-8 h-8 cursor-pointer ${
                      star <= rating ? "text-yellow-400" : "text-gray-300 "
                    } text-xl`}
                  ></i>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[100%] p-4 left-0 top-[877px] absolute bg-Token-BG-Neutral-Light-1 border-t border-Token-Border-&-Divider-Neutral-Light-2 inline-flex justify-end items-center gap-3">
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-400 text-sm font-medium"
          >
            Cancel
          </button>
        <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg text-white text-sm font-medium"
            onClick={handleSubmit}
          >
            Assign & Publish
          </button>
      </div>
    </div>
  );
};

export default AddReviewSidebar;
