import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import BASE_URLS from "../config";

function Alerts() {
  const [activeTab, setActiveTab] = useState("job_applied");
  const [notifications, setNotifications] = useState([]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Dummy data for bookings
  const dummyBookings = [
    {
      _id: "booking1",
      type: "booking",
      user: {
        name: "Alice Johnson",
        city: "Melbourne",
        country: "Australia",
        profileImage: "https://plus.unsplash.com/premium_photo-1747852228947-34162c2193c8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      metadata: {
        jobId: {
          eventName: "Corporate Gala",
          rateOffered: 20,
          jobDate: "2025-07-15T14:00:00Z",
        },
        jobTitle: "Event Coordinator",
        bookingStatus: "confirmed",
      },
      createdAt: "2025-06-15T10:00:00Z",
    },
    {
      _id: "booking2",
      type: "booking",
      user: {
        name: "Bob Smith",
        city: "Sydney",
        country: "Australia",
        profileImage: "https://plus.unsplash.com/premium_photo-1747852228947-34162c2193c8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      metadata: {
        jobId: {
          eventName: "Wedding Reception",
          rateOffered: 25,
          jobDate: "2025-07-20T18:00:00Z",
        },
        jobTitle: "Caterer",
        bookingStatus: "confirmed",
      },
      createdAt: "2025-06-16T09:30:00Z",
    },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${BASE_URLS.BACKEND_BASEURL}notifications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // Combine API data with dummy bookings
        const apiNotifications = res.data || [];
        const combinedNotifications = [
          ...apiNotifications.filter((n) => n.type !== "booking"), // Exclude any real bookings from API
          ...dummyBookings, // Add dummy bookings
        ];
        setNotifications(combinedNotifications);
        console.log("Notifications fetched successfully:", combinedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        // If API fails, still show dummy bookings
        setNotifications(dummyBookings);
      }
    };

    fetchNotifications();
  }, []);

  const filtered = notifications.filter((n) => n.type === activeTab);

  const handleCancelBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelPopup(true);
  };

  const confirmCancelBooking = () => {
    // Simulate cancelling by removing the booking from the list
    setNotifications((prev) =>
      prev.filter((notif) => notif._id !== selectedBookingId)
    );
    setShowCancelPopup(false);
    setSelectedBookingId(null);
  };

  const renderNotificationCard = (notif) => {
    switch (notif.type) {
      case "job_applied":
        return (
          <div className="flex font-['Inter'] leading-snug flex-col md:flex-row justify-between items-start">
            <div>
              <p className="tracking-tight font-['Inter'] leading-snug text-gray-800">
                <span className="font-semibold capitalize">
                  {notif?.sender?.name || "Someone"}
                </span>{" "}
                applied for{" "}
                <span className="font-semibold">
                  {notif?.metadata?.jobTitle || "a position"}
                </span>{" "}
                – {notif?.metadata?.jobId?.eventName || "an event"}
              </p>
              <p className="mt-2 font-medium text-sm text-gray-600">
                <span className="text-gray-600">Offer Rate:</span> $
                {notif?.metadata?.offerRate || "N/A"}/hr
              </p>
              <p className="mt-1 self-stretch h-10 justify-start text-[#3D3D3D] text-sm font-normal  text-sm">
                {notif?.metadata?.applicationMessage || "No message provided."}
              </p>
              <div className="mt-3 md:mt-0">
                <a
                  href={`/application/${notif?.data?.applicationId}`}
                  className="text-[#E61E4D] font-medium no-underline hover:underline"
                >
                  View Application
                </a>
              </div>
            </div>
            {notif?.createdAt && (
              <p className="text-xs w-16 text-gray-500 mt-2">
                {formatDistanceToNow(new Date(notif.createdAt), {
                  addSuffix: true,
                })}
              </p>
            )}
          </div>
        );

      case "job_invite":
        return (
          <div className="bg-white text-base font-medium font-['Inter'] leading-snug text-[#292929] rounded-2xl">
            {/* Top: Profile & Rate */}
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                <img
                  src={notif?.sender?.profileImage}
                  alt={notif?.sender?.name || "User Profile"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-base">
                    {notif?.sender?.name}
                  </h2>
                  <div className="flex  items-center text-[#3D3D3D] text-sm -mt-2 ">
                    <i className="ri-map-pin-line mr-1 text-lg" />
                    {notif?.sender?.city},
                    {notif?.sender?.country || "Location not specified"}
                  </div>
                </div>
              </div>
              <div className="text-right font-semibold">
                ${notif?.metadata?.jobId?.rateOffered || 12}/hr
              </div>
            </div>

            {/* Event Info */}
            <div className="mt-4">
              {/* <p className="text-[#3D3D3D] text-sm mb-2">
                Invitation Sent for{" "}
                <span className="font-medium">
                  {notif?.metadata?.jobId?.eventName}
                </span>
              </p> */}
              <p className="text-[#3D3D3D] text-sm mb-2">
                <span
                  className="font-medium"
                  dangerouslySetInnerHTML={{ __html: notif?.message }}
                ></span>

              </p>
              <div className="flex items-center text-sm text-gray-500">
                <i className="ri-calendar-event-line mr-1 text-lg" />
                Event Date:{" "}
                {new Date(notif?.metadata?.jobId?.jobDate).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", year: "numeric" }
                ) || "DD, MM, YY"}
              </div>
            </div>

            {/* Status */}
            <div className="mt-4 ">
              {notif?.metadata?.inviteId?.status === "pending" && (
                <span className="text-xs bg-[#FFF1F2] px-4 py-2  rounded-full inline-flex justify-center items-center inline-block">
                  Waiting for response
                </span>
              )}
              {notif?.metadata?.inviteId?.status === "accepted" && (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full inline-block">
                  Accepted
                </span>
              )}
            </div>
            <hr className="border-1 border-zinc-200" />
            {/* Buttons */}
            <div className="mt-2 flex justify-end gap-4 items-center">
              {notif?.metadata?.inviteId?.status === "pending" ? (
                <>
                  <button className="text-sm text-gray-500 hover:text-black">
                    Withdraw Invite
                  </button>
                  <button className="text-sm text-[#E61E4D] font-semibold border-2 border-[#E61E4D] px-4 py-2  rounded-md hover:bg-[#E61E4D] hover:text-white ease-in duration-100 flex items-center gap-1">
                    Send Reminder
                  </button>
                </>
              ) : (
                <>
                  <button className="text-sm text-gray-600 hover:text-black">
                    Cancel
                  </button>
                  <button className="text-sm text-[#E61E4D] border border-pink-500 px-4 py-1.5 rounded-md hover:bg-pink-50">
                    Complete Booking
                  </button>
                </>
              )}
            </div>
          </div>
        );

      case "booking":
        return (
          <div className="bg-white rounded-2xl font-['Inter'] leading-tight">
            {/* Top: Profile & Rate */}
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                <img
                  src={notif?.user?.profileImage || "https://via.placeholder.com/48"}
                  alt={notif?.user?.name || "User Profile"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-base">
                    {notif?.user?.name || "Unknown"}
                  </h2>
                  <div className="flex items-center text-gray-500 text-sm -mt-2">
                    <i className="ri-map-pin-line mr-1 text-lg" />
                    {notif?.user?.city || "Unknown City"},
                    {notif?.user?.country || "Unknown Country"}
                  </div>
                </div>
              </div>
              <div className="text-right font-semibold">
                ${notif?.metadata?.jobId?.rateOffered || "N/A"}/hr
              </div>
            </div>

            {/* Event Info */}
            <div className="mt-4">
              <p className="text-gray-700 text-sm mb-2">
                Booked for{" "}
                <span className="font-medium">
                  {notif?.metadata?.jobId?.eventName || "an event"}
                </span>
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <i className="ri-calendar-event-line mr-1 text-lg" />
                Event Date:{" "}
                {new Date(notif?.metadata?.jobId?.jobDate).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", year: "numeric" }
                ) || "N/A"}
              </div>
            </div>

            {/* Status */}
            <div className="mt-4">
              <span className="text-xs font-normal font-['Inter'] leading-none bg-[#D8F1BF] capitalize text-[#3D3D3D] px-4 py-2 rounded-full inline-block">
                {notif?.metadata?.bookingStatus || "Confirmed"}
              </span>
            </div>

            <hr className="border-1 border-zinc-200" />

            {/* Buttons */}
            <div className="mt-2 flex justify-end gap-4 items-center">
              <div className="px-1.5 py-1 flex place-items-center rounded-full border border-zinc-700">
                <i className="ri-heart-fill  text-red-500 mr-1" />
              </div>
              <button
                onClick={() => handleCancelBooking(notif._id)}
                className="text-sm text-[#E61E4D] font-semibold border-1 border-[#E61E4D] px-4 py-2 rounded-lg  hover:text-white hover:bg-[#E61E4D] ease-in duration-100  flex items-center gap-1"
              >
                {/* <i className="ri-close-line text-lg" /> */}
                Cancel Booking
              </button>
              <button className="text-sm text-white bg-gradient-to-l from-pink-600 to-rose-600 border-1 border-pink-500 px-4 py-2 rounded-md hover:bg-pink-50">
                Message Hostess
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-gray-700 text-sm">
              Unknown notification type: {notif.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto py-6">
      <h1 className="text-3xl font-bold mb-1 ">Notifications</h1>
      <p className="text-gray-500 text-sm mb-6">
        Stay updated with all your event activities in one place!
      </p>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-4">
        {[
          { type: "job_applied", label: "Applications Received" },
          { type: "job_invite", label: "Job Invites" },
          { type: "booking", label: "Bookings" },
        ].map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === type
                ? "border-b-2 border-[#E61E4D] text-[#E61E4D]"
                : "text-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notification Cards */}
      {filtered.length === 0 ? (
        <p className="text-gray-400">No notifications found.</p>
      ) : (
        filtered.map((notif) => (
          <div
            key={notif._id}
            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
          >
            {renderNotificationCard(notif)}
            {/* {notif?.createdAt && (
              <p className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(new Date(notif.createdAt), {
                  addSuffix: true,
                })}
              </p>
            )} */}
          </div>
        ))
      )}

      {/* Cancel Confirmation Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[395px] ">
            <i onClick={() => setShowCancelPopup(false)} className="ri-close-line text-2xl  float-right"></i>
            
            <p className=" text-gray-600">
            Booking fees and deposits are non refundable. 
            </p>
            <p className="text-sm text-gray-600 mt-2">
            Please contact site admin to move this booking to another hostess.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowCancelPopup(false)}
                className="px-4 py-2 text-sm text-[#E61E4D] border-1 border-[#E61E4D] rounded-md hover:bg-gray-100"
              >
                Contact admin
              </button>
              <button
                onClick={confirmCancelBooking}
                className="px-4 py-2 text-sm text-white bg-gradient-to-l from-pink-600 to-rose-600 rounded-md hover:bg-red-600"
              >
                 Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;