import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URLS from "../config";
// import 'remixicon/fonts/remixicon.css'; // Import Remix Icons CSS

function ManageBookings() {
  const [activeTab, setActiveTab] = useState("Confirmed Bookings");
  const [bookingsData, setBookingsData] = useState({});
  const [calendarData, setCalendarData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAcceptInvitation = (id) => {
    console.log(`Accepting invitation with ID: ${id}`);
    // Implement API call to accept invitation
    axios.patch(`${BASE_URLS.BACKEND_BASEURL}jobs/invitation/${id}/accept`,{}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        navigate("/dashboard");
        // setNotifications((prev) => prev.map((n) => n._id !== inviteId));
      })
      .catch((error) => {
        console.error(error);
      });
    
  };

  useEffect(() => {
    const { state } = location;
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [location]);

  
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URLS.BACKEND_BASEURL}jobs/manage-bookings`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Manage Booking", response);

        const transformBookings = (bookings, status, statusColor) => {
          return bookings.map((booking) => {
            const isInvite = status === "pending";
            const jobData = isInvite ? booking.job : booking;
            const jobDate = new Date(jobData.jobDate || new Date());
            const startTime = new Date(
              `1970-01-01T${jobData.startTime || "00:00"}:00`
            ).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
            const endTimeMs =
              new Date(
                `1970-01-01T${jobData.startTime || "00:00"}:00`
              ).getTime() +
              (jobData.duration || 0) * 60 * 60 * 1000;
            const endTime = new Date(endTimeMs).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
            const eventFee =
              jobData.paymentType === "fixed"
                ? jobData.rateOffered
                : (jobData.duration || 0) * (jobData.rateOffered || 0);

            const avgRating = (reviews = []) => {
              if (!reviews.length) return "N/A";
              const validRatings = reviews
                .map((r) => r.rating)
                .filter((r) => typeof r === "number");
              if (!validRatings.length) return "N/A";
              return (
                validRatings.reduce((a, b) => a + b, 0) / validRatings.length
              ).toFixed(1);
            };

            return {
              id: isInvite ? booking._id : jobData._id || "unknown",
              jobId: isInvite ? jobData._id : jobData._id || "unknown",
              title: jobData.eventName || "Unnamed Event",
              status:
                status.charAt(0).toUpperCase() + status.slice(1) || "Unknown",
              statusColor,
              applicationOffer:
                jobData.application &&
                `${jobData?.application?.currency} - ${
                  jobData?.application?.offer
                }/${jobData?.application?.duration === "day" ? "-" : "hr"}`,
              role: jobData.jobTitle || "Unknown Role",
              rate: `${jobData.currency || "USD"} ${
                jobData.rateOffered || 0
              }/ ${jobData.paymentType || "Hourly"}`,
              location: `${jobData.suburb || "Unknown"}, ${
                jobData.city || "Unknown"
              }`,
              date:
                jobDate.toLocaleDateString("en-AU", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }) || "Unknown Date",
              time: `${startTime} - ${endTime}`,
              message: `Booking ${status} for ${
                jobData.eventName || "event"
              } on ${jobDate.toLocaleDateString("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`,
              eventType: jobData.eventName || "Unknown Event",
              duration: `${jobData.duration || 0} hours`,
              description: `Scheduled on ${jobDate.toLocaleString("en-AU", {
                dateStyle: "full",
                timeStyle: "short",
              })}`,
              organizer: {
                _id: jobData?.organiser?._id || "unknown",
                name: jobData?.organiser?.name || "Unknown Organizer",
                image:
                  jobData?.organiser?.profileImage ||
                  "https://placehold.co/48x48",
                email: jobData?.organiser?.email || "Not provided",
                phone: jobData?.organiser?.phone || "Not provided",
                city: jobData?.organiser?.city || "Unknown",
                country: jobData?.organiser?.country || "Unknown",
                reviews: jobData?.organiser?.reviews.length || 0,
                // rating: jobData?.organiser?.rating || "N/A",
                rating: avgRating(jobData?.organiser?.reviews) || "0",
              },

              paymentInfo: {
                currency: jobData.currency || "USD",
                totalHours: `${jobData.duration || 0}`,
                eventFee: `${jobData.currency || "USD"} ${eventFee}`,
                bookingFee: `${jobData.currency || "USD"} ${Math.round(
                  eventFee * 0.1
                )}`,
                paidToHostess: `${jobData.currency || "USD"} ${Math.round(
                  eventFee * 0.9
                )}`,
                isPaid: jobData.isPaid || false,
                // paymentStatus: jobData.paymentStatus || "Pending",
              },
            };
          });
        };

        const bookingsData = {
          "Confirmed Bookings": transformBookings(
            response.data.confirmedBookings || [],
            "confirmed",
            "bg-lime-100"
          ),
          "Invites Received": transformBookings(
            response.data.invitesReceived || [],
            "pending",
            "bg-orange-200"
          ),
          "Past Bookings": transformBookings(
            response.data.pastBookings || [],
            "completed",
            "bg-blue-100"
          ),
          "Cancelled Bookings": transformBookings(
            response.data.cancelledBookings || [],
            "cancelled",
            "bg-gray-200"
          ),
        };

        setBookingsData(bookingsData);
        console.log("Bookings Data:", bookingsData);
        setBookingsData(bookingsData);
        console.log("Bookings Data:", bookingsData);
        const firstEventDate =
          response.data.confirmedBookings?.length > 0
            ? new Date(response.data.confirmedBookings[0].jobDate)
            : response.data.invitesReceived?.length > 0
            ? new Date(response.data.invitesReceived[0].job.jobDate)
            : new Date();
        setCurrentMonth(
          new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1)
        );
      } catch (error) {
        console.error(
          "Error fetching bookings:",
          error.response?.data || error.message
        );
        setBookingsData({
          "Confirmed Bookings": [],
          "Invites Received": [],
          "Past Bookings": [],
          "Cancelled Bookings": [],
        });
        setCalendarData({ days: [], month: "N/A" });
        setCurrentMonth(new Date());
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const generateCalendarData = (monthDate) => {
    const month = monthDate.toLocaleString("en-AU", {
      month: "long",
      year: "numeric",
    });
    const daysInMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0
    ).getDate();
    const days = Array.from({ length: 35 }, (_, i) => {
      const day = i + 1;
      if (day > daysInMonth) return { day, opacity: "opacity-0", events: [] };

      const events = Object.values(bookingsData)
        .flat()
        .filter((booking) => {
          const bookingDate = new Date(booking.date);
          return (
            bookingDate.getDate() === day &&
            bookingDate.getMonth() === monthDate.getMonth()
          );
        })
        .map((booking) => ({
          title: booking.title,
          color:
            booking.status === "Confirmed"
              ? "bg-[#E61E4D]"
              : booking.status === "Pending"
              ? "bg-[#FFCCD3]"
              : booking.status === "Completed"
              ? "bg-[#F9F9F9]"
              : "bg-[#656565]",
          emoji: booking.status === "Completed" ? "🎉" : undefined,
          textColor:
            booking.status === "Completed"
              ? "text-[#3D3D3D]"
              : "text-[#FFFFFF]",
          textSize: booking.status === "Completed" ? "text-[6px]" : "text-xs",
        }));

      return { day, events };
    });

    return { month, days };
  };

  useEffect(() => {
    if (currentMonth && Object.keys(bookingsData).length > 0) {
      setCalendarData(generateCalendarData(currentMonth));
    }
  }, [bookingsData, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth) {
      setCurrentMonth((prev) => {
        const newMonth = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
        return newMonth;
      });
    }
  };

  const handleNextMonth = () => {
    if (currentMonth) {
      setCurrentMonth((prev) => {
        const newMonth = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
        return newMonth;
      });
    }
  };

  // Component to render booking cards
  const BookingCard = ({ booking }) => (
    <div className="self-stretch p-6 bg-[#FFFFFF] rounded-2xl flex flex-col justify-start items-start gap-4">
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-start items-center gap-4">
          <div className="flex-1 justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
            {booking.title}
          </div>
          <div
            className={`w-20 px-4 py-2 ${booking.statusColor} rounded-full flex justify-center items-center gap-2.5`}
          >
            <div className="justify-start text-[#292929] text-xs font-normal font-['Inter'] leading-none">
              {booking.status}
            </div>
          </div>
        </div>
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
            Role: {booking.role}
          </div>
          <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
            {booking.applicationOffer ? booking.applicationOffer : booking.rate}
          </div>
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-center gap-3 flex-wrap content-center">
        <div className="flex justify-start items-center gap-2">
          <i className="ri-map-pin-2-fill text-[#656565] w-4 h-4"></i>
          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
            {booking.location}
          </div>
        </div>
        <div className="flex justify-start items-center gap-2">
          <i className="ri-calendar-2-fill text-[#656565] w-4 h-4"></i>
          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
            {booking.date}
          </div>
        </div>
        <div className="flex justify-start items-center gap-2">
          <i className="ri-time-fill text-[#656565] w-4 h-4"></i>
          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
            {booking.time}
          </div>
        </div>
      </div>
      <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
        {booking.message}
      </div>
      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
      <div className="self-stretch inline-flex justify-end items-center gap-4">
        <button className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
          <span
            onClick={
              activeTab === "Confirmed Bookings"
                ? () =>
                    navigate(`/bookings/${booking.id}`, { state: { booking } })
                : activeTab === "Invites Received"
                ? () =>
                    navigate(`/invites/${booking.id}`, { state: { booking } })
                : activeTab === "Past Bookings"
                ? () => {
                    console.log(`/past-booking/${booking.id}`);
                    navigate(`/past-booking/${booking.id}`, {
                      state: { booking },
                    });
                  }
                : () => navigate("/booking")
            }
            className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug"
          >
            View Details
          </span>
        </button>
        <button
          onClick={
            activeTab === "Confirmed Bookings"
              ? () => {
                  // Navigate to messages and open chat with the organiser
                  navigate(`/dashboard/messages`, {
                    state: { userId: booking.organizer?._id },
                  });
                }
              : activeTab === "Invites Received"
              ? () => handleAcceptInvitation(booking.id)
              : activeTab === "Past Bookings"
              ? () => {
                  console.log(`/past-booking/${booking.id}`);
                  navigate(`/past-booking/${booking.id}`, {
                    state: { booking },
                  });
                }
              : () => navigate("/booking")
          }
          disabled={activeTab === "Cancelled Bookings"}
          className={`px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 ${
            activeTab === "Cancelled Bookings" ? "hidden" : ""
          } overflow-hidden`}
        >
          <span className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
            {activeTab === "Confirmed Bookings"
              ? "Message Organiser"
              : activeTab === "Invites Received"
              ? booking.status === "Pending"
                ? "Confirm Booking"
                : "Waiting for payment"
              : activeTab === "Past Bookings"
              ? "Leave a Review"
              : "Cancel Booking"}
          </span>
        </button>
      </div>
    </div>
  );

  // Component to render calendar
  // Component to render calendar
  const Calendar = () => {
    if (isLoading || !calendarData.days) {
      return (
        <div className="flex-1 h-[500px] p-4 bg-[#FFFFFF] rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-center items-center">
          <div>Loading calendar...</div>
        </div>
      );
    }

    return (
      <div className="flex-1 w-full  h-[500px] p-4 bg-[#FFFFFF] rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-4">
            <div className="inline-flex justify-center items-center gap-4">
              <button
                onClick={handlePrevMonth}
                className="p-1 bg-[#F9F9F9] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5"
              >
                <i className="ri-arrow-left-s-line text-[#656565] w-6 h-6"></i>
              </button>
              <div className="justify-center text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                {calendarData.month || "N/A"}
              </div>
              <button
                onClick={handleNextMonth}
                className="p-1 bg-[#F9F9F9] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5"
              >
                <i className="ri-arrow-right-s-line text-[#656565] w-6 h-6"></i>
              </button>
            </div>
            <div className="self-stretch p-2 rounded inline-flex justify-start items-center gap-3 overflow-hidden">
              <div className="flex justify-start items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#E61E4D] rounded-full" />
                <div className="justify-center text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                  Confirmed booking:{" "}
                  {bookingsData["Confirmed Bookings"]?.length || 0}
                </div>
              </div>
              <div className="w-3 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className="flex justify-start items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#FFCCD3] rounded-full" />
                <div className="justify-center text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                  Booking Invitation:{" "}
                  {bookingsData["Invites Received"]?.length || 0}
                </div>
              </div>
              <div className="w-3 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className="flex justify-start items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#656565] rounded-full" />
                <div className="justify-center text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                  Cancelled Bookings:{" "}
                  {bookingsData["Cancelled Bookings"]?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch md:min-w-[484px] min-h-82 p-px bg-[#F9F9F9] rounded-lg inline-flex flex-col justify-start items-start gap-px overflow-hidden">
          <div className="self-stretch inline-flex justify-start items-start gap-px">
            {["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="flex-1 md:min-w-16 px-2 py-0.5 bg-[#292929] flex justify-center items-center gap-2"
              >
                <div className="flex-1 text-center justify-center text-[#FFFFFF] text-xs font-normal font-['Inter'] leading-none">
                  {day}
                </div>
              </div>
            ))}
          </div>
          {[...Array(5)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="self-stretch flex-1 min-h-16 inline-flex justify-start items-start gap-px"
            >
              {calendarData.days
                .slice(rowIndex * 7, (rowIndex + 1) * 7)
                .map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 self-stretch md:min-w-16 min-h-16 p-1.5 bg-white inline-flex flex-col justify-start items-start gap-0.5"
                  >
                    <div
                      className={`self-stretch justify-center text-[#3D3D3D] text-[10px] font-extrabold font-['Avenir'] ${
                        day.opacity || ""
                      }`}
                    >
                      {day.day}
                    </div>
                    {day.events.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`self-stretch ${event.height || "py-px"} ${
                          event.color
                        } rounded-sm inline-flex justify-start items-start gap-0.5 overflow-hidden`}
                      >
                        {event.emoji && (
                          <div className="justify-center text-[#292929] text-[10px] font-extrabold font-['Avenir']">
                            {event.emoji}
                          </div>
                        )}
                        <div
                          className={`flex-1 justify-center ${
                            event.textColor || "text-[#FFFFFF]"
                          } ${
                            event.textSize || "text-xs"
                          } font-normal font-['Inter'] leading-none`}
                        >
                          {event.title}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Component to render tab content
  const TabContent = ({ tab }) => (
    <div className="self-stretch flex flex-col justify-start items-start gap-8">
      <div className="flex flex-col justify-start items-start gap-1">
        <div className="self-stretch justify-start text-[#3D3D3D] text-xl font-bold font-['Inter'] leading-normal">
          {tab}
        </div>
        <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
          {tab === "Confirmed Bookings" &&
            "Your next spotlight awaits—get set to shine at your upcoming gigs!"}
          {tab === "Invites Received" &&
            "Review and respond to your booking invitations."}
          {tab === "Past Bookings" &&
            "View your completed gigs and their details."}
          {tab === "Cancelled Bookings" && "Review your cancelled bookings."}
        </div>
      </div>
      <div className="self-stretch inline-flex flex-col md:flex-row justify-start items-start gap-8">
        <div className="flex-1 inline-flex flex-col justify-end items-start gap-6">
          {bookingsData[tab]?.length > 0 ? (
            bookingsData[tab].map((booking, index) => (
              <BookingCard key={index} booking={booking} />
            ))
          ) : (
            <div>No {tab.toLowerCase()} available at the moment.</div>
          )}
        </div>
        <Calendar />
      </div>
    </div>
  );

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
      <div className="self-stretch flex flex-col justify-start items-start gap-12">
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="self-stretch justify-start text-black text-4xl font-bold font-['Inter'] leading-10">
            Manage Your Bookings
          </div>
          <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
            Keep track of your gigs, review past events, and manage
            cancellations—all in one easy-to-use dashboard.
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-8">
          <div className="border-b overflow-x-auto w-[400px] md:w-full border-[#656565] inline-flex justify-start items-center scrollbar-hide">
            {[
              "Confirmed Bookings",
              "Invites Received",
              "Past Bookings",
              "Cancelled Bookings",
            ].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 border-b-2 flex justify-center items-center gap-2.5 ${
                  activeTab === tab ? "border-[#E61E4D]" : "border-transparent"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <div
                  className={`justify-start text-sm font-medium font-['Inter'] leading-tight ${
                    activeTab === tab ? "text-[#E61E4D]" : "text-[#656565]"
                  }`}
                >
                  {tab}
                </div>
              </button>
            ))}
          </div>
          {TabContent({ tab: activeTab })}
        </div>
      </div>
    </div>
  );
}

export default ManageBookings;
