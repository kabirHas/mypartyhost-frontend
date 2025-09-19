import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import BASE_URLS from "../config";
import axios from "axios";

function StaffPublicProfile() {
  const { user: stateUser } = ChatState();
  console.log(stateUser);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedEventType, setSelectedEventType] =
    useState("Atmosphere Model");
  const [selectedStartTime, setSelectedStartTime] = useState("6 PM");
  const [selectedHours, setSelectedHours] = useState(4);
  const [currentMonth, setCurrentMonth] = useState(2); // March (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const fetchStaffDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URLS.BACKEND_BASEURL}user/${id}`);
      const data = await response.json();
      console.log("user data", data);
      setUser(data);
    } catch (error) {
      console.error("Error fetching staff details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${BASE_URLS.BACKEND_BASEURL}jobs/my-jobs`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const { data } = response;
      console.log(data);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchStaffDetails();
  }, [id]);

  useEffect(() => {
    if (showModal && stateUser) {
      fetchEvents();
    }
  }, [showModal, stateUser]);

  useEffect(() => {
    if (selectedEventType !== "Atmosphere Model" && isActive) {
      setIsActive(false);
    }
  }, [selectedEventType, isActive]);

  const handleToggle = () => {
    setIsActive((prev) => !prev);
    // Reset dates when switching modes
    setSelectedDate(null);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sections = user
    ? [
      {
        title: "ABOUT ME",
        content: user.bio,
      },
      {
        title: "RATES",
        content: `Base Rate: $${user.baseRate}/hour\nDaily Rate: $${user?.dailyRate
          }/day\nInstant Booking Rate: $${user?.instantBookingRate
          }/booking\nAdditional Rates:\n${user?.additionalRates
            ?.map((r) => `${r.label}: $${r.amount}`)
            .join("\n")}`,
      },
      {
        title: "AVAILABLE FOR",
        content: `Skills:\n${user?.skills
          ?.map((s) => `${s.title} ($${s.pricePerHour}/hr)`)
          .join("\n")}\n\nAvailable Dates: ${user.availableDates
            ?.map((d) => new Date(d).toDateString())
            .join(", ")}`,
      },
      {
        title: "JOB HISTORY",
        content:
          user.reviews?.length === 0
            ? "No job history yet."
            : user.reviews?.map((r) => r.comment).join("\n"),
      },
    ]
    : [];

  const times = ["5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];
  const hoursOptions = [3, 4, 5, 6, 7, 8];
  const eventTypes = [
    "Party Dress",
    "Customer Service",
    "Poker/Card Dealer",
    "Atmosphere Model",
    "Topless Waitress",
    "Waitress",
  ];

  const getRate = () => {
    if (!user) return 0;
    if (isActive) return user.dailyRate;
    const skill = user.skills?.find(
      (s) => s.title.toLowerCase() === selectedEventType.toLowerCase()
    );
    return skill ? skill.pricePerHour : user.baseRate;
  };

  const calculateDays = () => {
    if (!selectedStartDate || !selectedEndDate) return 1;
    const diffTime = selectedEndDate.getTime() - selectedStartDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
    return Math.max(1, diffDays);
  };

  const quantity = isActive ? calculateDays() : selectedHours;
  const rate = getRate();
  const total = rate * quantity;

  const parseTime = (time) => {
    const [h, ampm] = time.split(" ");
    let hour = parseInt(h);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return hour;
  };

  const getEndTime = () => {
    const startHour = parseTime(selectedStartTime);
    let endHour = startHour + selectedHours;
    const endAmpm = endHour >= 12 ? "PM" : "AM";
    endHour = endHour % 12 || 12;
    return `${endHour} ${endAmpm}`;
  };

  const getCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth, -i);
      days.push({ day: date.getDate(), type: "Previous", date });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({ day: i, type: "Default", date });
    }

    let nextDay = 1;
    while (days.length < 42) {
      const date = new Date(currentYear, currentMonth + 1, nextDay);
      days.push({ day: nextDay, type: "Next", date });
      nextDay++;
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  const prevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const nextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString(
    "default",
    { month: "long" }
  );

  const handleConfirmInvite = () => {
    if (!stateUser) {
      navigate("/login");
      return;
    }
    if (!selectedEvent) {
      alert("Please select an event");
      return;
    }
    const inviteDetails = {
      staffId: id,
      staffName: user?.name,
      eventType: selectedEventType,
      bookingType: isActive ? "Daily" : "Hourly",
      date: isActive
        ? {
          startDate: selectedStartDate
            ? selectedStartDate.toDateString()
            : "Not selected",
          endDate: selectedEndDate
            ? selectedEndDate.toDateString()
            : "Not selected",
        }
        : selectedDate
          ? selectedDate.toDateString()
          : "Not selected",
      startTime: isActive ? "N/A" : selectedStartTime,
      endTime: isActive ? "N/A" : getEndTime(),
      duration: isActive ? `${quantity} Days` : `${selectedHours} Hours`,
      rate: `$${rate}${isActive ? "/day" : "/hour"}`,
      totalCost: `$${total}`,
      selectedEvent: selectedEvent,
      timestamp: new Date().toISOString(),
    };
    console.log("Invite Sent:", inviteDetails);
    setShowModal(false);
  };

  const averageRating =
    user && user.reviews.length > 0
      ? user.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
      user.reviews.length
      : 0;
  const roundedStars = Math.max(0, Math.min(5, Math.round(averageRating)));

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-[#3D3D3D] text-xl font-medium font-['Inter']">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-[#3D3D3D] text-xl font-medium font-['Inter']">
          Error: User not found
        </div>
      </div>
    );
  }

  return (
    <div className="w-[100%] relative bg-[#F9F9F9] inline-flex flex-col justify-start items-start overflow-hidden">
      <div className="self-stretch pt-20 pb-40 flex flex-col justify-center items-center gap-2.5">
        <div className="w-full max-w-[1200px] flex flex-col justify-start items-center gap-6">
          <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
            <div
              onClick={() => navigate(-1)}
              className="px-3 py-2 cursor-pointer rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2"
            >
              <i className="ri-arrow-left-line w-6 h-6 text-[#656565]"></i>
              <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
                Back
              </div>
            </div>
          </div>
          <div className="w-full max-w-[1200px] inline-flex justify-start items-start gap-12">
            <div className="w-[588px] inline-flex flex-col justify-center items-center gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                <img
                  className="self-stretch object-cover object-top h-[630px] relative rounded-lg"
                  src={`https://mypartyhost.onrender.com${user.profileImage}`}
                />
                <div className="self-stretch inline-flex justify-start items-start gap-1.5">
                  {user.photos?.length > 0 && (
                    <div className="flex-1 h-28 flex flex-wrap justify-start items-start gap-2">
                      {user.photos.map((photo, i) => (
                        <img
                          key={i}
                          className="w-[24%] h-44 object-cover object-top self-stretch rounded-lg"
                          src={photo}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-center gap-4 overflow-hidden">
                <div className="self-stretch h-32 relative">
                  <div className="left-0 top-0 absolute inline-flex justify-start items-center gap-2">
                    {user.reviews.length === 0 ? (
                      <div className="w-[480px] max-w-[480px] min-w-[480px] p-4 bg-[#FFFFFF] outline outline-1 outline-offset-[-1px] outline-[#292929] inline-flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          No reviews yet.
                        </div>
                      </div>
                    ) : (
                      user.reviews.map((review, i) => (
                        <div
                          key={i}
                          className="w-[480px] max-w-[480px] min-w-[480px] p-4 bg-[#FFFFFF] outline outline-1 outline-offset-[-1px] outline-[#292929] inline-flex flex-col justify-start items-start gap-2"
                        >
                          <div className="self-stretch inline-flex justify-start items-start gap-3">
                            <img
                              className="w-12 h-12 rounded-full"
                              src={
                                review.image ||
                                "https://images.unsplash.com/photo-1664763079262-056e908630e1?q=80&w=821&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                              }
                            />
                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                              <div className="self-stretch capitalize justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                                {review.reviewer?.name || "Anonymous"}
                              </div>
                              <div className="inline-flex justify-start items-start gap-1.5">
                                {[...Array(review.rating || 0)].map(
                                  (_, j) => (
                                    <i
                                      key={j}
                                      className="ri-star-fill w-4 h-4 text-[#292929]"
                                    ></i>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                            {review.comment}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="justify-start text-[#E61E4D] text-base font-normal font-['Inter'] underline leading-snug">
                  SEE MORE
                </div>
              </div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="inline-flex justify-start items-center gap-4">
                    <div className="flex justify-start items-center gap-2">
                      <div className="flex justify-start items-center gap-1">
                        {[...Array(roundedStars)].map((_, i) => (
                          <i
                            key={`filled-${i}`}
                            className="ri-star-fill text-[#292929]"
                          ></i>
                        ))}
                        {[...Array(5 - roundedStars)].map((_, i) => (
                          <i
                            key={`empty-${i}`}
                            className="ri-star-line text-[#292929]"
                          ></i>
                        ))}
                        <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                          {averageRating.toFixed(1)}
                        </div>
                      </div>
                      <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] underline leading-snug">
                        ({user.reviews.length} Reviews)
                      </div>
                    </div>
                    <div className="w-4 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-[#656565]"></div>
                    <div className="flex justify-start items-center gap-2">
                      <i className="ri-map-pin-line text-blue-900"></i>
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        {user.city}, {user.country}
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch capitalize justify-start text-[#292929] text-6xl font-bold font-['Inter'] leading-[60.60px]">
                      {user.name}
                    </div>
                    <div className="self-stretch h-40 p-3 relative outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-start gap-3">
                      <div className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        {user.bio}
                      </div>
                      <div className="w-2 h-7 left-[552px] top-[4px] absolute bg-neutral-200 rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-end gap-4 flex-wrap content-end">
                  {user.skills?.map((skill, i) => (
                    <div
                      key={i}
                      data-property-1="Variant2"
                      className="rounded-lg inline-flex flex-col justify-center items-center gap-2"
                    >
                      <div className="h-8 w-8 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5">
                        <i className={`${skill.icon} text-[#292929]`}></i>
                      </div>
                      <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        {skill.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="self-stretch px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <div className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
                  Book Now/Invite to Event
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-center gap-2">
                <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-2">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26 5H6C5.44772 5 5 5.44772 5 6V26C5 26.5523 5.44772 27 6 27H26C26.5523 27 27 26.5523 27 26V6C27 5.44772 26.5523 5 26 5Z" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M22 3V7" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10 3V7" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5 11H27" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11.5 19L14.5 22L20.5 16" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                    Confirm Booking
                  </div>
                </div>
                <div className="p-1 rounded-lg flex justify-start items-center gap-2.5">
                  <i className="ri-arrow-right-line w-4 h-4 text-[#292929]"></i>
                </div>
                <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13H20" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 17H20" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M13.1337 24L15.1337 27.5C15.2211 27.6533 15.3475 27.7808 15.5001 27.8694C15.6527 27.9581 15.826 28.0047 16.0025 28.0047C16.179 28.0047 16.3523 27.9581 16.5049 27.8694C16.6575 27.7808 16.7839 27.6533 16.8713 27.5L18.8713 24H27C27.2652 24 27.5196 23.8946 27.7071 23.7071C27.8946 23.5196 28 23.2652 28 23V7C28 6.73478 27.8946 6.48043 27.7071 6.29289C27.5196 6.10536 27.2652 6 27 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7V23C4 23.2652 4.10536 23.5196 4.29289 23.7071C4.48043 23.8946 4.73478 24 5 24H13.1337Z" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                    Connect with Hostess
                  </div>
                </div>
                <div className="p-1 rounded-lg flex justify-start items-center gap-2.5">
                  <i className="ri-arrow-right-line w-4 h-4 text-[#292929]"></i>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 23.3489C18.545 28.9451 13.455 18.0551 2 23.6514V8.65137C13.455 3.05512 18.545 13.9451 30 8.34887V23.3489Z" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6 12V18" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M26 14V20" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                    Pay with Cash on the Day
                  </div>
                </div>
                <div className="p-1 rounded-lg flex justify-start items-center gap-2.5">
                  <i className="ri-arrow-right-line w-4 h-4 text-[#292929]"></i>
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-2">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.06107 25.6901L11.6248 7.64255C11.6806 7.48836 11.7745 7.35077 11.8977 7.24253C12.0208 7.13429 12.1693 7.05891 12.3294 7.02338C12.4895 6.98785 12.656 6.99332 12.8134 7.03928C12.9708 7.08524 13.114 7.17021 13.2298 7.2863L24.7148 18.7713C24.8306 18.8872 24.9153 19.0305 24.961 19.1878C25.0067 19.3451 25.0119 19.5114 24.9763 19.6713C24.9407 19.8312 24.8652 19.9795 24.757 20.1025C24.6488 20.2256 24.5114 20.3193 24.3573 20.375L6.30982 26.9388C6.13553 27.0025 5.94668 27.015 5.7655 26.975C5.58433 26.9349 5.41836 26.8439 5.28716 26.7127C5.15595 26.5815 5.06497 26.4155 5.02491 26.2344C4.98486 26.0532 4.9974 25.8643 5.06107 25.6901Z" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M21 9C21 9 21 6 24 6C27 6 27 3 27 3" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M18 2V5" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M27 14L29 16" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M27 10L30 9" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9.76172 12.7612L19.2392 22.2387" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.6388 24.6388L7.36133 19.3613" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                    It’s Party Time!
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    data-property-1="Default"
                    className="self-stretch border-b border-[#ECECEC] flex flex-col justify-start items-start cursor-pointer"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="self-stretch p-2 inline-flex justify-between items-center gap-4">
                      <div className="flex-1 justify-start text-[#292929] text-sm font-medium font-['Inter'] leading-tight">
                        {section.title}
                      </div>
                      <i
                        className={`ri-arrow-right-down-line w-5 h-5 text-[#292929] transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                          }`}
                      ></i>
                    </div>
                    <div
                      className={`self-stretch p-2 ${openIndex === index ? "opacity-100" : "opacity-0 h-0"
                        } inline-flex justify-start items-center gap-2.5 transition-all duration-100`}
                    >
                      <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="partners w-full">
          <h3>Featured In</h3>
          <div className="partners-gallary">
            <img
              alt="Partners"
              src="https://res.cloudinary.com/dympqasl5/image/upload/v1749808567/mypartyhost/mgxyktcsdrlxrquye4wr.png"
            />
            <img
              alt="Partners"
              src="https://res.cloudinary.com/dympqasl5/image/upload/v1749808567/mypartyhost/rcdysubqhuvsavfvhjzx.png"
            />
            <img
              alt="Partners"
              src="https://res.cloudinary.com/dympqasl5/image/upload/v1749808567/mypartyhost/qqoikrb4mcyqvwcwrjet.png"
            />
            <img
              alt="Partners"
              src="https://res.cloudinary.com/dympqasl5/image/upload/v1749808567/mypartyhost/sieqnpibsfhushnyoqd3.png"
            />
            <img
              alt="Partners"
              src="https://res.cloudinary.com/dympqasl5/image/upload/v1749808567/mypartyhost/hpvn28nwddpczzxmwakt.png"
            />
          </div>
        </div>
        <div className="w-[100%] mt-4 h-[738px] relative bg-black overflow-hidden">
          <img
            className="w-[747px] object-cover h-[934px] left-[-13px] top-[-44px] absolute"
            src="/images/staffProfiles.png"
          />
          <div className="w-[859px] left-[380px] top-[57px] absolute text-right justify-start">
            <span className="text-white text-7xl font-bold font-['Inter'] uppercase leading-[80px]">
              The Party{" "}
            </span>
            <span className="text-white text-7xl font-thin font-['Inter'] uppercase leading-[80px]">
              Starts <br /> Here!
            </span>
          </div>
          <div className="w-[509px] left-[760px] top-[233px] absolute justify-start text-[#FFFFFF] text-base font-normal font-['Inter'] leading-snug">
            Get ready to party with our gorgeous, fun, and flirty hostesses.
            Whether you're keeping it classy or turning up the heat, our
            stunning team is here to make your event unforgettable. Every detail
            is designed to dazzle, ensuring that your celebration is nothing
            short of spectacular.
          </div>
          <div className="w-[498px] left-[735px] top-[578px] absolute inline-flex flex-col justify-center items-end gap-2">
            <div className="self-stretch text-right justify-start">
              <span className="text-[#FFFFFF] text-5xl font-thin font-['Inter'] uppercase leading-10">
                THE EVENT
              </span>
              <span className="text-[#FFFFFF] text-5xl font-extralight font-['Inter'] uppercase leading-10">
                {" "}
              </span>
              <span className="text-[#FFFFFF] text-5xl font-bold font-['Inter'] uppercase leading-10">
                OF THE YEAR
              </span>
            </div>
            <div className="inline-flex justify-start items-center gap-[5px]">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="ri-star-fill w-6 h-6 text-[#F9F9F9]"></i>
              ))}
            </div>
          </div>
        </div>
        <div className="self-stretch h-[938px] relative bg-white overflow-hidden">
          <img
            className="w-[570px] h-[737px] left-[870px] top-[0.09px] absolute"
            src="/images/Rectangle%20637.png"
          />
          <div className="w-[758px] h-[820px] left-[60px] top-[60px] absolute inline-flex flex-col justify-start items-start gap-12">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch justify-start">
                <span className="text-[#292929] text-7xl font-['Poppins'] uppercase leading-[76px]">
                  FREQUENTLY <br />
                </span>
                <span className="text-[#292929] text-7xl font-bold font-['Poppins'] uppercase leading-[76px]">
                  ASKED QUESTIONS
                </span>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
                {[
                  "What is MyPartyHostess?",
                  "How do I select the best event staff for my event?",
                  "How do I post a job?",
                  "How much does it cost to hire event staff?",
                  "How do I pay?",
                  "What will the event staff wear to my event?",
                  "What happens if I need to cancel?",
                  "What happens if the event staff cancels?",
                ].map((question, index) => (
                  <div
                    key={index}
                    className="self-stretch h-12 px-6 outline outline-1 outline-offset-[-1px] outline-[#292929] inline-flex justify-center items-center gap-2.5 overflow-hidden"
                  >
                    <div className="flex-1 flex justify-between items-center">
                      <div className="justify-center text-[#292929] text-xl font-light font-['Inter'] uppercase leading-tight tracking-wide">
                        {question}
                      </div>
                      <i className="ri-arrow-right-down-line w-4 h-4 text-[#292929]"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-80 px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
              <div className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
                Get In Touch
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-end max-w-[1200px] mx-auto">
            <div className="w-[578px] right-0 top-[148px] absolute bg-white rounded-2xl shadow-[0px_0px_231.1999969482422px_9px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-[#ececec] inline-flex flex-col justify-start items-center overflow-hidden">
              <div className="self-stretch px-6 py-8 relative flex flex-col justify-start items-end gap-8">
                <div
                  className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] inline-flex justify-start items-center gap-2.5 cursor-pointer"
                  onClick={() => setShowModal(false)}
                >
                  <i className="ri-close-line text-[32px] leading-[32px]"></i>
                </div>
                <div className="self-stretch h-[100%] flex flex-col justify-start items-start gap-8">
                  <div className="self-stretch flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="flex-1 justify-start">
                          <span className="text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                            Rate:{" "}
                          </span>
                          <span className="text-Token-Text-Tertiary text-xs font-normal font-['Inter'] leading-none">
                            (Minimum $50)
                          </span>
                        </div>
                        <div className="px-4 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                          <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">
                            ${rate}
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">
                          Event type
                        </div>
                        <div className="self-stretch inline-flex justify-start items-start gap-3 flex-wrap content-start">
                          {eventTypes.map((type, i) => (
                            <div
                              key={i}
                              data-property-1={
                                selectedEventType === type
                                  ? "active"
                                  : "Default"
                              }
                              className={`px-3 py-2 rounded-lg flex justify-center items-center gap-2.5 ${selectedEventType === type
                                ? "bg-[#FFF1F2] outline outline-1 outline-offset-[-1px] outline-[#E61E4D]"
                                : "bg-Token-BG-Neutral-Light-1 outline outline-1 outline-offset-[-1px] outline-[#ececec]"
                                } cursor-pointer`}
                              onClick={() => setSelectedEventType(type)}
                            >
                              <div
                                className={`justify-start text-sm font-normal font-['Inter'] leading-tight ${selectedEventType === type
                                  ? "text-[#E61E4D]"
                                  : "text-[#3D3D3D]"
                                  }`}
                              >
                                {type}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {selectedEventType === "Atmosphere Model" && (
                        <div className="self-stretch inline-flex justify-between items-center">
                          <div className="justify-start text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">
                            Book By Day
                          </div>
                          <div data-property-1="ToggleLeft" className="w-12 h-12 relative">
                            <div className="h-12 flex flex-start items-center gap-2">
                              <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={isActive}
                                  onChange={handleToggle}
                                />
                                <div
                                  className={`w-11 h-6 rounded-full ${isActive ? "bg-[#E61E4D]" : "bg-gray-400"
                                    } flex items-center px-1 transition-colors`}
                                >
                                  <div
                                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isActive ? "translate-x-5" : ""
                                      }`}
                                  ></div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        className={`self-stretch flex flex-col justify-start items-start gap-6 ${!isActive ? "hidden" : ""
                          }`}
                      >
                        <div className="self-stretch flex flex-col justify-start items-start gap-3">
                          <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">
                            Start Date
                          </div>
                          <div
                            data-select-all="true"
                            data-select-button="false"
                            data-unselect-all="true"
                            className="self-stretch min-w-80 p-4 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex flex-col justify-start items-start gap-3"
                          >
                            <div className="self-stretch inline-flex justify-between items-center">
                              <i
                                className="ri-arrow-left-s-line text-[24px] text-[#656565] cursor-pointer"
                                onClick={prevMonth}
                              ></i>
                              <div className="text-center justify-center text-Token-BG-Neutral-Dark-2 text-base font-medium font-['Inter'] leading-snug">
                                {monthName} {currentYear}
                              </div>
                              <i
                                className="ri-arrow-right-s-line text-[24px] text-[#292929] cursor-pointer"
                                onClick={nextMonth}
                              ></i>
                            </div>
                            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ececec]"></div>
                            <div className="self-stretch inline-flex justify-between items-center">
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  SUN
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  MON
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  TUE
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  WED
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  THU
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  FRI
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  SAT
                                </div>
                              </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                              {Array.from(
                                { length: Math.ceil(calendarDays.length / 7) },
                                (_, week) => (
                                  <div
                                    key={week}
                                    className="self-stretch inline-flex justify-between items-center"
                                  >
                                    {calendarDays
                                      .slice(week * 7, (week + 1) * 7)
                                      .map((d, j) => {
                                        let prop = d.type;
                                        const isToday =
                                          d.date.toDateString() ===
                                          new Date().toDateString();
                                        const isAvailable =
                                          user.availableDates.some(
                                            (ad) =>
                                              new Date(ad).toDateString() ===
                                              d.date.toDateString()
                                          );
                                        const isSelected =
                                          selectedStartDate &&
                                          selectedStartDate.toDateString() ===
                                          d.date.toDateString();
                                        if (isSelected) prop = "Selected";
                                        else if (isAvailable)
                                          prop = "available";
                                        else if (isToday) prop = "Today";

                                        let textColor = "";
                                        if (
                                          prop === "Previous" ||
                                          prop === "Next"
                                        )
                                          textColor = "text-zinc-500";
                                        else if (prop === "Selected")
                                          textColor = "text-[#fff]";
                                        else if (prop === "available")
                                          textColor = "text-[#656565]";
                                        else if (prop === "Today")
                                          textColor = "text-[#E61E4D]";
                                        else
                                          textColor = "text-Token-Text-Primary";

                                        let bg = "";
                                        if (prop === "Selected")
                                          bg =
                                            "bg-[#E61E4D] outline outline-1 outline-offset-[-1px] outline-[#E61E4D]";
                                        else if (prop === "available")
                                          bg = "bg-[#FFF1F2]";
                                        else if (prop === "Today") bg = "";

                                        return (
                                          <div
                                            key={j}
                                            data-property-1={prop}
                                            className={`flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5 ${bg} ${d.type === "Default"
                                              ? "cursor-pointer"
                                              : ""
                                              }`}
                                            onClick={() => {
                                              if (d.type === "Default") {
                                                setSelectedStartDate(d.date);
                                                if (
                                                  selectedEndDate &&
                                                  d.date > selectedEndDate
                                                ) {
                                                  setSelectedEndDate(null);
                                                }
                                              }
                                            }}
                                          >
                                            <div
                                              className={`self-stretch text-center justify-center ${textColor} text-sm font-normal font-['Inter'] leading-tight`}
                                            >
                                              {d.day}
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                          <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">
                              Selected Start Date
                            </div>
                            <div className="flex justify-start items-center gap-4">
                              <div className="justify-start text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
                                {selectedStartDate
                                  ? selectedStartDate.toDateString()
                                  : "Not selected"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-3">
                          <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">
                            End Date
                          </div>
                          <div
                            data-select-all="true"
                            data-select-button="false"
                            data-unselect-all="true"
                            className="self-stretch min-w-80 p-4 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex flex-col justify-start items-start gap-3"
                          >
                            <div className="self-stretch inline-flex justify-between items-center">
                              <i
                                className="ri-arrow-left-s-line text-[24px] text-[#656565] cursor-pointer"
                                onClick={prevMonth}
                              ></i>
                              <div className="text-center justify-center text-Token-BG-Neutral-Dark-2 text-base font-medium font-['Inter'] leading-snug">
                                {monthName} {currentYear}
                              </div>
                              <i
                                className="ri-arrow-right-s-line text-[24px] text-[#292929] cursor-pointer"
                                onClick={nextMonth}
                              ></i>
                            </div>
                            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ececec]"></div>
                            <div className="self-stretch inline-flex justify-between items-center">
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  SUN
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  MON
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  TUE
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  WED
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  THU
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  FRI
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  SAT
                                </div>
                              </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                              {Array.from(
                                { length: Math.ceil(calendarDays.length / 7) },
                                (_, week) => (
                                  <div
                                    key={week}
                                    className="self-stretch inline-flex justify-between items-center"
                                  >
                                    {calendarDays
                                      .slice(week * 7, (week + 1) * 7)
                                      .map((d, j) => {
                                        let prop = d.type;
                                        const isToday =
                                          d.date.toDateString() ===
                                          new Date().toDateString();
                                        const isAvailable =
                                          user.availableDates.some(
                                            (ad) =>
                                              new Date(ad).toDateString() ===
                                              d.date.toDateString()
                                          );
                                        const isSelected =
                                          selectedEndDate &&
                                          selectedEndDate.toDateString() ===
                                          d.date.toDateString();
                                        if (isSelected) prop = "Selected";
                                        else if (isAvailable)
                                          prop = "available";
                                        else if (isToday) prop = "Today";

                                        let textColor = "";
                                        if (
                                          prop === "Previous" ||
                                          prop === "Next"
                                        )
                                          textColor = "text-zinc-500";
                                        else if (prop === "Selected")
                                          textColor = "text-[#fff]";
                                        else if (prop === "available")
                                          textColor = "text-[#656565]";
                                        else if (prop === "Today")
                                          textColor = "text-[#E61E4D]";
                                        else
                                          textColor = "text-Token-Text-Primary";

                                        let bg = "";
                                        if (prop === "Selected")
                                          bg =
                                            "bg-[#E61E4D] outline outline-1 outline-offset-[-1px] outline-[#E61E4D]";
                                        else if (prop === "available")
                                          bg = "bg-[#FFF1F2]";
                                        else if (prop === "Today") bg = "";

                                        return (
                                          <div
                                            key={j}
                                            data-property-1={prop}
                                            className={`flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5 ${bg} ${d.type === "Default" &&
                                              (!selectedStartDate ||
                                                d.date >= selectedStartDate)
                                              ? "cursor-pointer"
                                              : ""
                                              }`}
                                            onClick={() => {
                                              if (
                                                d.type === "Default" &&
                                                (!selectedStartDate ||
                                                  d.date >= selectedStartDate)
                                              ) {
                                                setSelectedEndDate(d.date);
                                              }
                                            }}
                                          >
                                            <div
                                              className={`self-stretch text-center justify-center ${textColor} text-sm font-normal font-['Inter'] leading-tight`}
                                            >
                                              {d.day}
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                          <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">
                              Selected End Date
                            </div>
                            <div className="flex justify-start items-center gap-4">
                              <div className="justify-start text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
                                {selectedEndDate
                                  ? selectedEndDate.toDateString()
                                  : "Not selected"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">
                            Number of Days
                          </div>
                          <div className="self-stretch inline-flex justify-start items-center gap-3">
                            <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                              {quantity} Days
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${isActive ? "hidden" : "flex flex-col gap-[24px]"
                          }`}
                      >
                        <div className="self-stretch flex flex-col justify-start items-start gap-3">
                          <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">
                            Select Date
                          </div>
                          <div
                            data-select-all="true"
                            data-select-button="false"
                            data-unselect-all="true"
                            className="self-stretch min-w-80 p-4 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex flex-col justify-start items-start gap-3"
                          >
                            <div className="self-stretch inline-flex justify-between items-center">
                              <i
                                className="ri-arrow-left-s-line text-[24px] text-[#656565] cursor-pointer"
                                onClick={prevMonth}
                              ></i>
                              <div className="text-center justify-center text-Token-BG-Neutral-Dark-2 text-base font-medium font-['Inter'] leading-snug">
                                {monthName} {currentYear}
                              </div>
                              <i
                                className="ri-arrow-right-s-line text-[24px] text-[#292929] cursor-pointer"
                                onClick={nextMonth}
                              ></i>
                            </div>
                            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ececec]"></div>
                            <div className="self-stretch inline-flex justify-between items-center">
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  SUN
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  MON
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  TUE
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  WED
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  THU
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  FRI
                                </div>
                              </div>
                              <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                                  SAT
                                </div>
                              </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                              {Array.from(
                                { length: Math.ceil(calendarDays.length / 7) },
                                (_, week) => (
                                  <div
                                    key={week}
                                    className="self-stretch inline-flex justify-between items-center"
                                  >
                                    {calendarDays
                                      .slice(week * 7, (week + 1) * 7)
                                      .map((d, j) => {
                                        let prop = d.type;
                                        const isToday =
                                          d.date.toDateString() ===
                                          new Date().toDateString();
                                        const isAvailable =
                                          user.availableDates.some(
                                            (ad) =>
                                              new Date(ad).toDateString() ===
                                              d.date.toDateString()
                                          );
                                        const isSelected =
                                          selectedDate &&
                                          selectedDate.toDateString() ===
                                          d.date.toDateString();
                                        if (isSelected) prop = "Selected";
                                        else if (isAvailable)
                                          prop = "available";
                                        else if (isToday) prop = "Today";

                                        let textColor = "";
                                        if (
                                          prop === "Previous" ||
                                          prop === "Next"
                                        )
                                          textColor = "text-zinc-500";
                                        else if (prop === "Selected")
                                          textColor = "text-[#fff]";
                                        else if (prop === "available")
                                          textColor = "text-[#656565]";
                                        else if (prop === "Today")
                                          textColor = "text-[#E61E4D]";
                                        else
                                          textColor = "text-Token-Text-Primary";

                                        let bg = "";
                                        if (prop === "Selected")
                                          bg =
                                            "bg-[#E61E4D] outline outline-1 outline-offset-[-1px] outline-[#E61E4D]";
                                        else if (prop === "available")
                                          bg = "bg-[#FFF1F2]";
                                        else if (prop === "Today") bg = "";

                                        return (
                                          <div
                                            key={j}
                                            data-property-1={prop}
                                            className={`flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5 ${bg} ${d.type === "Default"
                                              ? "cursor-pointer"
                                              : ""
                                              }`}
                                            onClick={() => {
                                              if (d.type === "Default")
                                                setSelectedDate(d.date);
                                            }}
                                          >
                                            <div
                                              className={`self-stretch text-center justify-center ${textColor} text-sm font-normal font-['Inter'] leading-tight`}
                                            >
                                              {d.day}
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                          {/* <div className="w-[530px] p-3 bg-[#FFF1F2] rounded-lg inline-flex justify-start items-start gap-1">
                            <img
                              src="/images/info.png"
                              alt="info"
                              className="w-4 h-4 relative"
                            />
                            <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              {user.firstName} currently has 3 pending event
                              invitations on this date, instant book now to
                              secure your booking
                            </div>
                          </div> */}
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-3">
                          <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">
                            Start Time
                          </div>
                          <div className="self-stretch inline-flex justify-start items-start gap-2 flex-wrap content-start">
                            {times.map((t, i) => (
                              <div
                                key={i}
                                data-property-1={
                                  selectedStartTime === t ? "active" : "Default"
                                }
                                className={`px-3 py-2 rounded-lg flex justify-center items-center gap-2.5 cursor-pointer ${selectedStartTime === t
                                  ? "bg-[#FFF1F2] outline outline-1 outline-offset-[-1px] outline-[#E61E4D]"
                                  : "bg-Token-BG-Neutral-Light-1 outline outline-1 outline-offset-[-1px] outline-[#ececec]"
                                  }`}
                                onClick={() => setSelectedStartTime(t)}
                              >
                                <div
                                  className={`justify-start text-sm font-normal font-['Inter'] leading-tight ${selectedStartTime === t
                                    ? "text-[#E61E4D]"
                                    : "text-[#3D3D3D]"
                                    }`}
                                >
                                  {t}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-3">
                          <div className="self-stretch justify-start">
                            <span className="text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">
                              Number of Hours
                            </span>
                            <span className="text-black text-base font-semibold font-['Inter']">
                              {" "}
                            </span>
                            <span className="text-neutral-400 text-sm font-normal font-['Inter'] leading-tight">
                              (Minimum 3 hours)
                            </span>
                          </div>
                          <div className="self-stretch inline-flex justify-start items-start gap-2 flex-wrap content-start">
                            {hoursOptions.map((h, i) => (
                              <div
                                key={i}
                                data-property-1={
                                  selectedHours === h ? "active" : "Default"
                                }
                                className={`px-3 py-2 rounded-lg flex justify-center items-center gap-2.5 cursor-pointer ${selectedHours === h
                                  ? "bg-[#FFF1F2] outline outline-1 outline-offset-[-1px] outline-[#E61E4D]"
                                  : "bg-Token-BG-Neutral-Light-1 outline outline-1 outline-offset-[-1px] outline-[#ececec]"
                                  }`}
                                onClick={() => setSelectedHours(h)}
                              >
                                <div
                                  className={`justify-start text-sm font-normal font-['Inter'] leading-tight ${selectedHours === h
                                    ? "text-[#E61E4D]"
                                    : "text-[#3D3D3D]"
                                    }`}
                                >
                                  {h}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-3">
                          <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">
                            End Time
                          </div>
                          <div className="self-stretch inline-flex justify-start items-center gap-3">
                            <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                              {getEndTime()}
                            </div>
                            <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                              ({selectedHours} hours)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              {isActive ? "Days" : "Hours"}
                            </div>
                            <div className="text-right justify-start text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">
                              {quantity}
                            </div>
                          </div>
                          <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              {isActive ? "Daily Rate" : "Rate/H"}
                            </div>
                            <div className="text-right justify-start text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">
                              ${rate}
                            </div>
                          </div>
                        </div>
                        <div className="self-stretch h-0 bg-Token-BG-Neutral-Light-2 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
                        <div className="self-stretch inline-flex justify-between items-center">
                          <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">
                            Total Cost
                          </div>
                          <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">
                            ${total}
                          </div>
                        </div>
                      </div>
                    </div>
                    {stateUser && (
                      <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">
                          Select Event
                        </div>
                        <select
                          className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] bg-white"
                          value={selectedEvent ? selectedEvent._id : ""}
                          onChange={(e) => {
                            const event = events.find(
                              (ev) => ev._id === e.target.value
                            );
                            setSelectedEvent(event);
                          }}
                        >
                          <option value="">Select an event</option>
                          {events.map((event) => (
                            <option key={event._id} value={event._id}>
                              {event.eventName || "Untitled Event"} -{" "}
                              {new Date(event.jobDate).toDateString()}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-2 h-5 left-[565px] top-[483px] absolute bg-zinc-300 rounded-lg" />
              </div>
              <div className="w-[578px] p-4 bg-Token-BG-Neutral-Light-1 shadow-[8px_13px_10.5px_15px_rgba(195,192,192,0.25)] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div
                    className="self-stretch px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
                    onClick={handleConfirmInvite}
                  >
                    <div className="justify-start text-[#fff] text-base font-medium font-['Inter'] leading-snug">
                      {stateUser ? `Confirm Booking $${total}` : "Login to send invite"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="flex-1 h-0 bg-Token-BG-Neutral-Light-2 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
                    <div className="justify-start text-neutral-500 text-xs font-normal font-['Inter'] leading-none">
                      or
                    </div>
                    <div className="flex-1 h-0 bg-Token-BG-Neutral-Light-2 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
                  </div>
                  <div className="self-stretch px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden">
                    <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                      Invite to Existing Event
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffPublicProfile;