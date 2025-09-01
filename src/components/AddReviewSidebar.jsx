import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URLS from "../config";
import Notify from "../utils/notify";

const AddReviewSidebar = ({ onClose, reviewDatas }) => {
  console.log(reviewDatas)
  
  const [reviewType, setReviewType] = useState(reviewDatas?.reviewee?.role || "organiser");
  const [reviewerName, setReviewerName] = useState(reviewDatas?.reviewee?.name || "kkdlk");
  const [reviewerId, setReviewerId] = useState(reviewDatas?.reviewee?._id || "");
  const [eventName, setEventName] = useState(reviewDatas?.event?.jobTitle || "");
  const [feedback, setFeedback] = useState(reviewDatas?.comment || "");
  const [rating, setRating] = useState(reviewDatas?.rating || 1);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [events, setEvents] = useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URLS.API}/user`);
        setUsers(res.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on role
  useEffect(() => {
    if (reviewType) {
      const filtered = users.filter(
        (user) => user.role?.toLowerCase() === reviewType.toLowerCase()
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
    if (!reviewDatas){
    setReviewerName("");
    setReviewerId("");
    setSuggestions([]);
    setEvents([]);
    setEventName("");
     }
  }, [reviewType, users]);

  // Handle typing for suggestions
  const handleReviewerNameChange = (e) => {
    const value = e.target.value;
    setReviewerName(value);
    setReviewerId("");
    setEvents([]);
    setEventName("");

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const matchedSuggestions = filteredUsers.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matchedSuggestions);
  };

  // When suggestion is clicked → fetch events for that user
  const handleSuggestionClick = async (user) => {
    setReviewerName(user.name);
    setReviewerId(user._id);
    setSuggestions([]);

    try {
      const res = await axios.get(`${BASE_URLS.API}/jobs`);
      const allEvents = res.data || [];

      // Filter events assigned to this user (adjust key if API differs)
      if (reviewType === "organiser") {
        const userEvents = allEvents.filter(
          (event) => event.organiser?._id === user._id
        );
        setEvents(userEvents);
        if (userEvents.length > 0) {
          setEventName(userEvents[0].title);
        }
      } else {
        setReviewerId(user.user);
        const userEvents = allEvents.filter(
          (event) =>
            Array.isArray(event.hiredStaff) &&
            event.hiredStaff.includes(user.user)
        );

        setEvents(userEvents);

        if (userEvents.length > 0) {
          setEventName(userEvents[0].title);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URLS.API}/jobs`);
      const allEvents = res.data || [];

      if (reviewType === "organiser") {
        const userEvents = allEvents.filter(
          (event) => event.organiser?._id === reviewDatas.reviewee._id
        );
        setEvents(userEvents);
        if (userEvents.length > 0) {
          setEventName(userEvents[0].title);
        }
      } else {
        setReviewerId(reviewDatas.reviewee._id);
        const userEvents = allEvents.filter(
          (event) =>
            Array.isArray(event.hiredStaff) &&
            event.hiredStaff.includes(reviewDatas.reviewee._id)
        );
        setEvents(userEvents);
        if (userEvents.length > 0) {
          setEventName(userEvents[0].title);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  if (reviewDatas) {
    fetchEvents();
  }
}, [reviewDatas, reviewType]);


  const handleSubmit = async (e) => {
    e.preventDefault();


    const reviewData = {
      rating: rating,
      comment: feedback || "",
      event: eventName,
    };

    try {
      const token = localStorage.getItem("token");
      if (reviewDatas?._id) {
        // EDIT MODE
        await axios.patch(`${BASE_URLS.API}/review/${reviewDatas._id}`, reviewData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        Notify.success("Review updated successfully!");
        onClose();
      }
      else {
      await axios.post(`${BASE_URLS.API}/review/${reviewerId}`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      Notify.success("Review submitted successfully!");
      onClose();
    }
    } catch (error) {
      Notify.error("Failed to submit review");
    }
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
                disabled={Boolean(reviewDatas)}
              >
                <option value="">Select Reviewer Type</option>
                <option value="organiser">Organiser</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2 relative">
              <div className="self-stretch justify-start text-Token-Text-Primary text-base font-bold font-['Inter'] leading-snug">
                Reviewer Name
              </div>

              <input
                type="text"
                placeholder="Name (auto fill – while typing or show suggestion)"
                className="self-stretch px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-full outline outline-1 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Dark-1 text-Token-Text-Tertiary text-base font-normal font-['Inter'] leading-snug"
                value={reviewerName}
                onChange={handleReviewerNameChange}
                disabled={Boolean(reviewDatas)}
              />
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50 max-h-40 overflow-y-auto p-0">
                  {suggestions.map((user) => (
                    <li
                      key={user._id}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(user)}
                    >
                      {user.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-Token-Text-Primary text-base font-bold font-['Inter'] leading-snug">
                Event
              </div>

              <select
                className="self-stretch px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-full outline outline-1 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Dark-1 text-Token-Text-Secondary text-base font-medium font-['Inter'] leading-snug"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                disabled={events.length === 0}
              >
                {events.length > 0 ? (
                  <>
                    <option>Please select</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.eventName}
                      </option>
                    ))}
                  </>
                ) : (
                  <option>No events found</option>
                )}
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
          {reviewDatas ? "Update Review" : "Assign & Publish"}
        </button>
      </div>
    </div>
  );
};

export default AddReviewSidebar;
