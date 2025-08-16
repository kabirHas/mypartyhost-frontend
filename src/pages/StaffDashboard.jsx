import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../asset/css/OrganizerDashboard.css";
import Calendar from "../components/Calendar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChatState } from "../Context/ChatProvider";

const events = [
  {
    date: new Date(2024, 0, 1),
    title: "New Year Celebration Party",
    type: "confirmed",
  },
  { date: new Date(2024, 0, 2), title: "Pool Party", type: "confirmed" },
  { date: new Date(2024, 0, 2), title: "Indoor Event", type: "invitation" },
  { date: new Date(2024, 0, 2), title: "Beach party", type: "cancelled" },
  { date: new Date(2024, 0, 15), title: "Bachelor Party", type: "confirmed" },
  { date: new Date(2024, 0, 20), title: "Mom's Birthday", type: "note" },
];

const StaffDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRates, setNewRates] = useState([]);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("invitesReceived");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userDataError, setUserDataError] = useState("");
  const [profileViewsError, setProfileViewsError] = useState("");
  const [profileViews, setProfileViews] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [isPublic, setIsPublic] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.isPublic !== undefined ? userInfo.isPublic : true;
  });
  const [instantBook, setInstantBook] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.instantBook !== undefined ? userInfo.instantBook : false;
  });

  const [userId, setUserId] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    console.log("User ID from localStorage:", userInfo._id); // Log the userId
    return userInfo._id || "";
  });

  const [additionalRates, setAdditionalRates] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.additionalRates || [];
  });

  // const [additionalRates, setAdditionalRates] = useState([]);
  const [newService, setNewService] = useState("");
  const [newRate, setNewRate] = useState("");
  const serviceOptions = [
    "Beach Party",
    "Bikini Waitress",
    "Poker Dealer",
    "Party Hostess",
    "Topless Waitress",
    "Brand Promotion",
  ];

  const [baseRate, setBaseRate] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.baseRate;
  });

  const [initialBaseRate, setInitialBaseRate] = useState(baseRate);
  const [isBaseRateModified, setIsBaseRateModified] = useState(false);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (!userId) {
  //       setUserDataError("Invalid user ID. Please log in again.");
  //       return;
  //     }
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get(`https://mypartyhost.onrender.com/api/staff/${userId}`, {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       });
  //       setBaseRate(response.data.baseRate);
  //       setInitialBaseRate(response.data.baseRate);
  //       setIsBaseRateModified(false);
  //       setAdditionalRates(response.data.additionalRates || []);

  //       setSelectedDates((response.data.availableDates || []).map(date => new Date(date).toISOString().split("T")[0]));

  //       console.log("API availableDates:", response.data.availableDates);

  //       setUserDataError("");
  //     } catch (error) {
  //       setUserDataError("Failed to fetch user data. Please try again.");
  //       console.error("Error fetching user data:", error.response?.data || error.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchUserData();
  // }, [userId]);
  const [boostProfile, setBoostProfile] = useState(false);
  const [boostPlans, setBoostPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const {user, setUser} = ChatState()
console.log("User from ChatState:", user);

  const handleProceedToPayment = async () => {
    if (!selectedPlan || !user  || !currency) return;
  
    try {
      // Fetch exchange rate again
      const rateRes = await axios.get("https://v6.exchangerate-api.com/v6/9f6020acea6f209461dca627/latest/USD");
      const rate = rateRes.data.conversion_rates[currency] || 1;
      const convertedAmount = selectedPlan.price * rate;
  
      // Call backend to create Stripe session
      const res = await axios.post("http://localhost:4000/api/boost/payment/create-session", {
        planId: selectedPlan._id,
        userId: user.user,
        amountUSD : selectedPlan.price, // Assuming this is the amount in USD
        currency,
        actualCurrency: "USD", // Assuming backend expects USD as the base currency
        amount: convertedAmount.toFixed(2),
        actualAmount: selectedPlan.price.toFixed(2), // Store original amount for reference

      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      window.location.href = res.data.url; // Redirect to Stripe Checkout
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to create payment session.");
    }
  };
  


  useEffect(() => {
    // Step 1: Get user's currency
    axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        const userCurrency = res.data.currency;
        setCurrency(userCurrency);

        // Step 2: Now fetch exchange rate AFTER currency is known
        // return axios.get(
        //   "https://v6.exchangerate-api.com/v6/9f6020acea6f209461dca627/latest/USD"
        // );
      })
      // .then((res) => {
      //   // Step 3: Access the conversion rate using updated currency
      //   const rate = res.data.conversion_rates[currency];
      //   if (rate) {
      //     setAmount(amount * rate);
      //     console.log("Converted Amount:", amount * rate, "Rate:", rate);
      //   } else {
      //     console.error("Currency not found in rates:", currency);
      //   }
      // })
      .catch((err) => console.error(err));
  }, [currency]);

  useEffect(() => {
    if (boostProfile) {
      axios
        .get("http://localhost:4000/api/boost") // your API endpoint
        .then((res) => setBoostPlans(res.data))
        .catch((err) => console.error("Failed to fetch plans", err));
    }
  }, [boostProfile]);

  useEffect(() => {
    const fetchProfileViews = async () => {
      if (!userId) {
        setProfileViewsError("Invalid user ID. Please log in again.");
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://mypartyhost.onrender.com/api/staff`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("API Response:", response.data);
        const user = response.data.data.find((u) => u._id === userId);
        if (!user) throw new Error("User not found in staff list");
        console.log("Profile User Data:", user);

        // Step 1: Sahi field se views data lo
        const views = user.user.views || [];

        // Step 2: Days of week ke liye array banao aur counts initialize karo
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const viewCounts = daysOfWeek.map(() => 0);

        // Step 3: Har view ka day of week nikalo aur count increment karo
        views.forEach((view) => {
          const date = new Date(view.viewedAt);
          const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
          viewCounts[dayIndex]++;
        });

        // Step 4: Chart ke liye data format karo
        const profileViewsData = daysOfWeek.map((day, index) => ({
          day,
          views: viewCounts[index],
        }));

        console.log("Processed Profile Views Data:", profileViewsData);
        setProfileViews(profileViewsData);
        setProfileViewsError("");
      } catch (error) {
        setProfileViewsError(
          "Failed to fetch profile views. Please try again."
        );
        console.error("Error fetching profile views:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileViews();
  }, [userId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "https://mypartyhost.onrender.com/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        const jobInvites = data.filter((notif) => notif.type === "job_invite");
        setNotifications(jobInvites);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  const handleToggle = async (field) => {
    if (!userId) {
      setProfileViewsError("Failed to fetch profile views. Please try again.");
      return;
    }
    setIsLoading(true);
    setProfileViewsError("Failed to fetch profile views. Please try again.");
    const updatedValue = field === "isPublic" ? !isPublic : !instantBook;
    try {
      const response = await axios.patch(
        `https://mypartyhost.onrender.com/api/staff/`,
        { [field]: updatedValue },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (field === "isPublic") setIsPublic(updatedValue);
      else setInstantBook(updatedValue);
      const updatedUserInfo = {
        ...JSON.parse(localStorage.getItem("userInfo") || "{}"),
        [field]: updatedValue,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Updated token:", response.data.token);
      }
    } catch (error) {
      setUserDataError("Invalid user ID. Please log in again.");
      console.error(
        `Error updating ${field}:`,
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
    setIsAddingNew(false);
    setNewService("");
    setNewRate("");
  };

  const handleAddNewToggle = () => {
    setIsAddingNew(true);
  };

  const handleSaveRate = async () => {
    const currentRates = additionalRates || []; // fallback
    if (isNaN(baseRate) || baseRate <= 0) {
      setUserDataError("Please enter a valid base rate.");
      return;
    }
    if (
      isAddingNew &&
      (!newService || !newRate || isNaN(newRate) || newRate <= 0)
    ) {
      setUserDataError("Please select a service and enter a valid rate.");
      return;
    }
    setIsLoading(true);
    setUserDataError("");
    try {
      const updatedData = {
        baseRate: parseFloat(baseRate),
        additionalRates: isAddingNew
          ? [
              ...currentRates,
              { label: newService, amount: parseFloat(newRate) },
            ]
          : currentRates,
      };
      const response = await axios.patch(
        `https://mypartyhost.onrender.com/api/staff/`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      setAdditionalRates(updatedData.additionalRates);
      const updatedUserInfo = {
        ...JSON.parse(localStorage.getItem("userInfo") || "{}"),
        baseRate: updatedData.baseRate,
        additionalRates: updatedData.additionalRates,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      setNewService("");
      setNewRate("");
      setIsAddingNew(false);
      setInitialBaseRate(updatedData.baseRate);
      setIsBaseRateModified(false);
    } catch (error) {
      setUserDataError("Failed to save rates. Please try again.");
      console.error("Error saving rates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRate = async (index) => {
    const updatedRates = additionalRates.filter((_, i) => i !== index);
    setIsLoading(true);
    setUserDataError("");
    try {
      await axios.patch(
        `https://mypartyhost.onrender.com/api/staff/`,
        { additionalRates: updatedRates },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAdditionalRates(updatedRates);
      const updatedUserInfo = {
        ...JSON.parse(localStorage.getItem("userInfo") || "{}"),
        additionalRates: updatedRates,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    } catch (error) {
      setUserDataError("Failed to delete rate. Please try again.");
      console.error(
        "Error deleting rate:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedDates, setSelectedDates] = useState([]);
  const [eventDate, setEventDate] = useState(new Date(2024, 0, 1));

  const handleAvailabilityModalToggle = () => {
    setIsAvailabilityModalOpen((prev) => !prev);
  };

  const getEventsForDate = (date) => {
    return events.filter(
      (event) =>
        event.date.getFullYear() === date.getFullYear() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getDate() === date.getDate()
    );
  };

  const handleDateSelect = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setSelectedDates((prev) => {
      const updatedDates = prev.includes(dateString)
        ? prev.filter((d) => d !== dateString)
        : [...prev, dateString];
      console.log("Updated selectedDates:", updatedDates);
      return updatedDates;
    });
  };

  // const handleSaveAvailability = () => {
  //   console.log("Selected Dates:", selectedDates);
  //   setIsAvailabilityModalOpen(false);
  // };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setUserDataError("Invalid user ID. Please log in again.");
        console.error(
          "No userId found in localStorage:",
          localStorage.getItem("userInfo")
        );
        return;
      }
      setIsLoading(true);
      try {
        console.log("Fetching user data for userId:", userId);
        const response = await axios.get(
          `https://mypartyhost.onrender.com/api/staff`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Full API response:", response.data);
        const user = response.data.data.find((u) => u._id === userId);
        if (!user) throw new Error("User not found in staff list");
        console.log("User data:", user);
        console.log("API availableDates:", user.availableDates);
        setBaseRate(user.baseRate || 150);
        setInitialBaseRate(user.baseRate || 150);
        setIsBaseRateModified(false);
        setAdditionalRates(user.additionalRates || []);
        setSelectedDates(
          Array.isArray(user.availableDates)
            ? user.availableDates.map(
                (date) => new Date(date).toISOString().split("T")[0]
              )
            : []
        );
        setUserDataError("");
      } catch (error) {
        setUserDataError("Failed to fetch user data. Please try again.");
        console.error("Error fetching user data:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          userId,
          token: localStorage.getItem("token"),
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleSaveAvailability = async () => {
    try {
      setIsLoading(true);
      const formattedDates = selectedDates.map((date) =>
        new Date(date).toISOString()
      );

      const response = await axios.patch(
        `https://mypartyhost.onrender.com/api/staff/`,
        { availableDates: formattedDates },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Availability updated:", response.data);
      // Optionally update localStorage if needed
      const updatedUserInfo = {
        ...JSON.parse(localStorage.getItem("userInfo") || "{}"),
        availableDates: formattedDates,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    } catch (error) {
      console.error(
        "Error updating availability:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
      setIsAvailabilityModalOpen(false);
    }
  };

  const handleBaseRateChange = (e) => {
    setBaseRate(e.target.value);
    setIsBaseRateModified(e.target.value !== String(initialBaseRate));
  };

  const handleEventDateChange = (newDate) => {
    setEventDate(newDate);
  };

  return (
    <div className="dashboard">
      <div className="self-stretch inline-flex justify-start items-center gap-4">
        <div className="flex-1 self-stretch p-6 bg-white rounded-2xl inline-flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="justify-start text-black text-xl font-bold font-['Inter'] leading-normal">
                  VIP Gala Night
                </div>
                <div
                  data-property-1="Confirmed"
                  className="w-20 px-4 py-2 bg-lime-100 rounded-full flex justify-center items-center gap-2.5"
                >
                  <div className="justify-start text-[#292929] text-xs font-normal font-['Inter'] leading-none">
                    Confirmed
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Role: Hostess
                </div>
                <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Rate: $100/hr
                </div>
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-3 flex-wrap content-center">
              <div className="flex justify-start items-center gap-2">
                <i className="ri-map-pin-2-fill"></i>
                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                  123 Harbour Street, Sydney, NSW
                </div>
              </div>
              <div className="flex justify-start items-center gap-2">
                <i className="ri-calendar-check-line"></i>
                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                  15th March 2025
                </div>
              </div>
              <div className="flex justify-start items-center gap-2">
                <i className="ri-time-fill"></i>
                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                  6:00 PM – 11:00 PM
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
            <div className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight text-white">
              View Details
            </div>
          </div>
        </div>
        <div className="flex-1 self-stretch p-6 bg-white rounded-3xl inline-flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex-1 flex flex-col justify-start items-center gap-4">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="justify-start text-black text-sm font-bold font-['Inter'] leading-tight">
                Booking Request
              </div>
              <div className="justify-start text-black text-4xl font-bold font-['Inter'] leading-10">
                {notifications.length}
              </div>
            </div>
            {notifications.map((notif, idx) => (
              <div
                key={idx}
                className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
              >
                {notif.sender.name} wants to book you for{" "}
                {notif.metadata.jobTitle}
              </div>
            ))}
          </div>
          <div className="w-72 h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
            <div className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
              <div
                onClick={() => {
                  setActiveTab("invitesReceived");
                  navigate("/dashboard/manage-bookings", {
                    state: { activeTab: "Invites Received" },
                  });
                }}
                className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight text-white"
              >
                View Booking Request
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 self-stretch p-6 bg-gradient-to-b from-[#fff] to-[#fff1f2] rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#656565] inline-flex flex-col justify-start items-start gap-2">
          <div className="self-stretch inline-flex justify-start items-center gap-2">
            <div className="flex-1 flex justify-start items-center gap-2">
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="inline-flex justify-start items-center gap-1">
                      <div className="justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                        Hide Profile from Directory
                      </div>
                      <div className="relative group">
                        <img
                          src="/images/Info.png"
                          alt="tooltip"
                          className="w-[16px]"
                        />
                        <div className="absolute -bottom-[150px] left-1/3 transform -translate-x-1/2 mb-2 hidden group-hover:block w-80 p-3 bg-[#FFF1F2] z-24 rounded-2xl shadow-[0px_9px_13.699999809265137px_-4px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-[#656565] inline-flex justify-center items-center gap-2.5 overflow-hidden">
                          <div className="flex-1 justify-start">
                            <span className="text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                              If you hide your profile, you are not visible to
                              event organisers. You will only be visible to them
                              when you apply for their events.
                            </span>
                            <span className="text-[#E61E4D] text-sm font-normal font-['Inter'] underline leading-tight">
                              Learn More
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                      Hiding will limit your visibility to organizers
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-12 flex justify-start items-center gap-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={!isPublic}
                  onChange={() => handleToggle("isPublic")}
                />
                <div
                  className={`w-11 h-6 rounded-full 
                    ${!isPublic ? "bg-[#E61E4D]" : "bg-gray-400"}
                    flex items-center px-1 transition-colors`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform 
                      ${!isPublic ? "translate-x-5" : ""}`}
                  ></div>
                </div>
              </label>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="self-stretch inline-flex justify-start items-center gap-2">
            <div className="flex-1 flex justify-start items-center gap-2">
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                    Instant Book
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center gap-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={instantBook}
                  onChange={() => handleToggle("instantBook")}
                />
                <div
                  className={`w-11 h-6 rounded-full 
                    ${instantBook ? "bg-[#E61E4D]" : "bg-gray-400"}
                    flex items-center px-1 transition-colors`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      instantBook ? "translate-x-5" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
              Minimum Instant Booking Rate
            </div>
            <div className="w-full inline-flex justify-start items-center gap-1">
              <div className="flex-1 flex justify-start items-center gap-2">
                <div className="flex-1 justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                  Base Hourly Rate
                </div>
                <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5">
                  <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                    {baseRate}
                  </div>
                </div>
              </div>
              <i
                id="addtionalRateOptions"
                className="fa-solid fa-pen-to-square cursor-pointer"
                onClick={handleModalToggle}
              ></i>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
          <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
              <div className="self-stretch justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                Additional Rate Options
              </div>
              <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                If you work different rates for different job types, add each.
              </div>
            </div>
            <i
              id="addtionalRateOptions"
              className="fa-solid fa-pen-to-square cursor-pointer"
              onClick={handleModalToggle}
            ></i>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="p-6 bg-white rounded-2xl shadow-[0px_0px_231.1999969482422px_9px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-[#656565] inline-flex flex-col justify-center items-start gap-4 overflow-hidden">
            <div className="self-stretch inline-flex justify-end items-center gap-2.5">
              <div className="flex-1 justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Manage Instant Booking
              </div>
              <div
                className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5 cursor-pointer"
                onClick={handleModalToggle}
              >
                <i className="ri-close-line text-lg"></i>
              </div>
            </div>
            <div className="w-[517px] flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-[#656565] text-base font-bold font-['Inter'] leading-snug">
                  Instant Booking Rate
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                      Base Hourly Rate
                    </div>
                    <input
                      type="number"
                      value={baseRate}
                      onChange={handleBaseRateChange}
                      className="w-1/5 px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5"
                    />
                    {/* <input
                          type="number"
                          value={baseRate}
                          onChange={handleBaseRateChange} className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug"/>
                         </div> */}
                  </div>
                </div>
              </div>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-[#656565] text-base font-bold font-['Inter'] leading-snug">
                    Rate By Services
                  </div>
                  {/* <div className="self-stretch inline-flex justify-start items-center gap-4">
                    <div className="flex-1 justify-start text-black text-sm font-bold font-['Inter'] leading-tight">
                      Bikini Waitress
                    </div>
                    <div className="flex justify-start items-center gap-2">
                      <div className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center">
                        <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          $200
                        </div>
                      </div>
                      <div className="py-0.2 px-1 bg-zinc-600 rounded-sm text-white flex justify-start items-center gap-2.5">
                        <i className="ri-subtract-line"></i>
                      </div>
                    </div>
                  </div> */}
                  {additionalRates.map((rate, index) => (
                    <div
                      key={rate._id || index}
                      className="self-stretch inline-flex justify-start items-center gap-4"
                    >
                      <div className="flex-1 justify-start text-black text-sm font-bold font-['Inter'] leading-tight">
                        {rate.label}
                        {/* <i className="ri-arrow-down-s-line"></i> */}
                      </div>
                      <div className="flex justify-start items-center gap-2">
                        <div className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center">
                          <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                            ${rate.amount}
                          </div>
                        </div>
                        <div
                          className="py-0.2 px-1 bg-zinc-600 rounded-sm text-white flex justify-start items-center gap-2.5 cursor-pointer"
                          onClick={() => handleDeleteRate(index)}
                        >
                          <i className="ri-subtract-line"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {isAddingNew && (
                  <div className="self-stretch inline-flex justify-start items-center gap-4">
                    <select
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug"
                    >
                      <option value="">Select Service</option>
                      {serviceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      placeholder="Enter Rate"
                      className="flex-1 px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug"
                    />
                  </div>
                )}
                <div
                  className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
                  // onChange={isAddingNew ? handleSaveRate : handleAddNewToggle}
                  onClick={
                    isBaseRateModified || isAddingNew
                      ? handleSaveRate
                      : handleAddNewToggle
                  }
                >
                  <div className="justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                    {/* {isAddingNew ? "Save" : "Add New"} */}
                    {isAddingNew || isBaseRateModified ? "Save" : "Add New"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAvailabilityModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-[479px] p-6 bg-white rounded-2xl shadow-[0px_0px_231.1999969482422px_9px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch inline-flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                    Select Available Dates
                  </div>
                  <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    {selectedDates.length} Date
                    {selectedDates.length !== 1 ? "s" : ""} Selected
                  </div>
                </div>
                <div
                  className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5 cursor-pointer"
                  onClick={handleAvailabilityModalToggle}
                >
                  <i className="ri-close-line text-lg"></i>
                </div>
              </div>
              <div className="w-full p-4 bg-white rounded-lg border border-[#ECECEC] flex flex-col gap-3">
                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() =>
                      setDate(
                        new Date(date.getFullYear(), date.getMonth() - 1, 1)
                      )
                    }
                    className="text-lg"
                  >
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                  <span className="text-[#292929] text-base font-medium font-['Inter']">
                    {date.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() =>
                      setDate(
                        new Date(date.getFullYear(), date.getMonth() + 1, 1)
                      )
                    }
                    className="text-lg"
                  >
                    <i className="ri-arrow-right-s-line"></i>
                  </button>
                </div>

                {/* Days of the Week */}
                <div className="grid grid-cols-7 gap-1 text-center text-[#656565] text-sm font-medium font-['Inter']">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                    (day) => (
                      <div key={day} className="py-1">
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const firstDay = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      1
                    ).getDay();
                    const daysInMonth = new Date(
                      date.getFullYear(),
                      date.getMonth() + 1,
                      0
                    ).getDate();
                    const prevMonthDays = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      0
                    ).getDate();
                    const totalCells = 42; // 6 rows * 7 columns
                    const cells = [];

                    // Previous month days
                    for (let i = firstDay - 1; i >= 0; i--) {
                      const prevDate = new Date(
                        date.getFullYear(),
                        date.getMonth() - 1,
                        prevMonthDays - i
                      );
                      cells.push(
                        <div
                          key={`prev-${i}`}
                          className="h-8 flex items-center justify-center text-zinc-500"
                        >
                          {prevMonthDays - i}
                        </div>
                      );
                    }

                    // Current month days
                    for (let day = 1; day <= daysInMonth; day++) {
                      const currentDate = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        day
                      );
                      const dateString = currentDate
                        .toISOString()
                        .split("T")[0];
                      const isSelected = selectedDates.includes(dateString);
                      cells.push(
                        <div
                          key={day}
                          className={`h-8 flex items-center justify-center cursor-pointer rounded ${
                            isSelected
                              ? "bg-[#E61E4D] text-white"
                              : "text-[#292929] hover:bg-gray-100"
                          }`} // Change-1: Added hover:bg-gray-100 for non-selected dates, Change-2: Simplified highlighting logic for selected dates
                          onClick={() => handleDateSelect(currentDate)}
                        >
                          {day}
                        </div>
                        // <div
                        //   key={day}
                        //   className={`h-8 flex items-center justify-center cursor-pointer rounded ${
                        //     isSelected ? "bg-[#E61E4D] text-white" : "text-[#292929] hover:bg-gray-100"
                        //   }`}
                        //   onClick={() => handleDateSelect(currentDate)}
                        // >
                        //   {day}
                        // </div>
                      );
                    }

                    // Next month days
                    const remainingCells = totalCells - cells.length;
                    for (let i = 1; i <= remainingCells; i++) {
                      cells.push(
                        <div
                          key={`next-${i}`}
                          className="h-8 flex items-center justify-center text-zinc-500"
                        >
                          {i}
                        </div>
                      );
                    }
                    return cells;
                  })()}
                </div>

                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch inline-flex justify-end items-center gap-3">
                  <div
                    className="px-2 py-1 bg-[#FFF1F2] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-start items-center gap-2 cursor-pointer"
                    onClick={() => setSelectedDates([])}
                  >
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Clear All
                    </div>
                    <i className="ri-close-line"></i>
                  </div>
                  <div
                    className="px-2 py-1 bg-[#FFF1F2] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-start items-center gap-2 cursor-pointer"
                    onClick={() => {
                      const startDate = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        1
                      );
                      const endDate = new Date(
                        date.getFullYear(),
                        date.getMonth() + 1,
                        0
                      );
                      const allDates = [];
                      for (
                        let d = new Date(startDate);
                        d <= endDate;
                        d.setDate(d.getDate() + 1)
                      ) {
                        allDates.push(new Date(d).toISOString().split("T")[0]);
                      }
                      setSelectedDates(allDates);
                    }}
                  >
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Select All
                    </div>
                    <i className="ri-check-line"></i>
                  </div>
                </div>
              </div>

              <div
                onClick={handleSaveAvailability}
                className="px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden"
              >
                <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                  Update Availability
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="self-stretch inline-flex justify-start items-end gap-4 mt-4">
        <div className="flex-1 self-stretch min-w-80 min-h-48 p-6 bg-[#fff] rounded-2xl inline-flex flex-col justify-start items-start gap-2 overflow-hidden">
          <div style={{ width: "100%", height: 250 }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
              Profile Views
            </h3>

            {isLoading ? (
              <div className="justify-center text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                Loading profile views...
              </div>
            ) : profileViewsError ? (
              <div className="justify-center text-[#E61E4D] text-base font-normal font-['Inter'] leading-snug">
                {profileViewsError}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profileViews}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="#999"
                    padding={{ left: 0, right: 20 }}
                  />
                  <YAxis stroke="#999" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#colorViews)"
                    strokeDasharray="4 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="flex-1 p-6 bg-gradient-to-b from-[#fff] to-[#FFE4E6] rounded-3xl inline-flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="w-96 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Boost Your Profile & Get Noticed!
              </div>
              <div className="self-stretch justify-start">
                <span className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  For only{" "}
                </span>
                <span className="text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                  $15
                </span>
                <span className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  {" "}
                  per week, let your brilliance shine:
                </span>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                Enhanced Exposure: Get featured on our homepage and appear at
                the top of search results.
              </div>
              <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                Priority Invitations: Be the first choice for high-profile
                events and exclusive gigs.
              </div>
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#656565]"></div>
          <div className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
            <button 
              onClick={() => setBoostProfile(true)}
              disabled={user?.boostStatus === 'pending' || user?.boostStatus === 'approved'}
              className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight text-white"
            >
              {user?.boostStatus === 'pending' ? 'Waiting for Approval' : user?.boostStatus === 'approved' ? 'Boost Active' : 'Boost My Profile Now'}
            </button>
          </div>
        </div>
      </div>

      <div className="self-stretch inline-flex justify-start items-start gap-4 mt-8">
        <Calendar setIsAvailabilityModalOpen={setIsAvailabilityModalOpen} />
        <div className="inline-flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex-1 p-4 bg-gradient-to-b from-rose-50 to-[#FFFFFF] rounded-2xl shadow-[0px_3px_17.5px_-1px_rgba(125,125,125,0.10)] outline outline-1 outline-offset-[-1px] outline-[#F9F9F9] flex flex-col justify-start items-start gap-4 overflow-hidden">
            <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              Upcoming Events
            </div>
            <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-2">
              <div
                data-property-1="Default"
                className="self-stretch p-3 bg-[#fff] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#F9F9F9]"
              >
                <div className="inline-flex justify-start items-start gap-4">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Events Name
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    0:09 PM - 0:03 AM
                  </div>
                </div>
              </div>
              <div
                data-property-1="Default"
                className="self-stretch p-3 bg-[#fff] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#F9F9F9]"
              >
                <div className="inline-flex justify-start items-start gap-4">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Conference
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    0:09 PM - 0:03 AM
                  </div>
                </div>
              </div>
              <div
                data-property-1="Default"
                className="self-stretch p-3 bg-[#fff] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#F9F9F9]"
              >
                <div className="inline-flex justify-start items-start gap-4">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Networking Dinner
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    0:09 PM - 0:03 AM
                  </div>
                </div>
              </div>
              <div
                data-property-1="Default"
                className="self-stretch p-3 bg-[#fff] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#F9F9F9]"
              >
                <div className="inline-flex justify-start items-start gap-4">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Networking Dinner
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                      Role: Hostess
                    </div>
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                    6 hours @150/h
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1 mt-2">
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    21 February
                  </div>
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    0:09 PM - 0:03 AM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="notifications mt-8">
        <h3>Latest Updates and Notifications</h3>
        {/* {notifications &&
          notifications.map((item, idx) => (
            <div className="notification" key={idx}>
              <img src="/images/Update Avatar.png" className="flame-icon" />
              <div>
                <strong>{item.name}</strong>{" "}
                {item.type === "job_invite"
                  ? "invited you to"
                  : "wants to join"}{" "}
                <b>{item.job}</b> - {item.ending}{" "}
                <span className="link">{item.link}</span>
              </div>
            </div>
          ))} */}

        {notifications &&
          notifications.map((item, idx) => (
            <div className="notification" key={idx}>
              <img src="/images/Update Avatar.png" className="flame-icon" />
              <div>
                <strong>{item.sender.name}</strong>{" "}
                {item.type === "job_invite"
                  ? `invited you to `
                  : "wants to join"}{" "}
                {item.type === "job_invite" ? (
                  <span style={{ fontWeight: "bold" }}>
                    {item.metadata.jobTitle}
                  </span>
                ) : (
                  <b>{item.job}</b>
                )}{" "}
                -{" "}
                <span
                  onClick={() => {
                    setActiveTab("invitesReceived");
                    navigate("/dashboard/manage-bookings", {
                      state: { activeTab: "Invites Received" },
                    });
                  }}
                  className="link"
                >
                  {item.type === "job_invite" ? "View Event" : item.link}
                </span>
              </div>
            </div>
          ))}
      </div>
      {boostProfile && (
        <div className="bg-white border border-[#ECECEC] shadow-lg rounded-xl absolute top-1/3 p-4 w-1/2 h-1/2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Boost your profile</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setBoostProfile(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="mt-3">
            Boost your profile to attract more clients and increase your chances
            of landing a gig.
          </p>
          <h3 className="font-semibold text-lg">Select a Boost Plan</h3>
          <ul>
            {boostPlans.map((plan) => (
              <li key={plan._id}>
                <input
                  type="radio"
                  name="boostPlan"
                  value={plan._id}
                  onChange={() => setSelectedPlan(plan)}
                  className="mr-2 cursor-pointer text-[#E61E4D] focus:ring-[#E61E4D] focus:ring-2 focus:ring-opacity-50 focus:outline-none" 
                />
                <label>
                  {plan.name} - {plan.durationInDays} days - ${plan.price}
                </label>
              </li>
            ))}
          </ul>
          <button className="bg-[#E61E4D] text-white px-4 py-2 rounded mt-4" onClick={handleProceedToPayment} disabled={!selectedPlan} >
            Pay {selectedPlan && `$${selectedPlan.price}`}
          </button>
          <button className="bg-white text-[#E61E4D] px-4 py-2 rounded mt-4" onClick={() => setBoostProfile(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
