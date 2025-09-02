import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow, set } from "date-fns";
import BASE_URLS from "../config";
import { ChatState } from "../Context/ChatProvider";
import StripeWrapper from "../components/StripeWrapper";
import { Link, useNavigate } from "react-router-dom";

function Alerts() {
  const [activeTab, setActiveTab] = useState("job_applied");
  const [notifications, setNotifications] = useState([]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { user } = ChatState();
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const navigate = useNavigate();
  const [savedProfiles, setSavedProfiles] = useState([]);
  // console.log("User from context:", user);

  // Fetch saved profiles
  useEffect(() => {
    const source = axios.CancelToken.source();
    // Fetch saved profiles
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}save-profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        cancelToken: source.token,
      })
      .then((res) => {
        console.log("Saved Profiles Response:", res.data);
        // Extract _id from full user objects
        const profileIds = (res.data || []).map((profile) => profile._id);
        setSavedProfiles(profileIds);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error("Error fetching saved profiles:", err.message);
        }
      });

    return () => source.cancel("Request canceled");
  }, []);

  // Handle like/unlike profile
  const handleLike = (staffId) => {
    const isSaved = savedProfiles.includes(staffId);
    const url = `${BASE_URLS.BACKEND_BASEURL}save-profile/${staffId}`;
    const method = isSaved ? "put" : "post";

    axios({
      method,
      url,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        console.log(
          `${isSaved ? "Unsaved" : "Saved"} Profile Response:`,
          res.data
        );
        // Update savedProfiles state
        setSavedProfiles((prev) =>
          isSaved ? prev.filter((id) => id !== staffId) : [...prev, staffId]
        );
      })
      .catch((err) => {
        console.error(
          `Error ${isSaved ? "unsaving" : "saving"} profile:`,
          err.response?.data || err.message
        );
      });
  };

  // helpers
  const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

  const makeConverter = (ratesUSD) => {
    // ratesUSD: { USD->INR, USD->EUR, ... }
    return (amount, from, to) => {
      if (from === to) return amount;
      const rUSD_to_to = ratesUSD[to];
      const rUSD_to_from = ratesUSD[from];
      if (!rUSD_to_to || !rUSD_to_from) throw new Error("Missing FX rate");
      return amount * (rUSD_to_to / rUSD_to_from);
    };
  };

  // ---- component ----

  const PLATFORM_FEE_USD = 20;
  const SERVICE_FEE_RATE = 0.1; // 10%

  useEffect(() => {
    // Step 1: Get user's currency once on mount
    const controller = new AbortController();
    axios
      .get("https://ipapi.co/json/", { signal: controller.signal })
      .then((res) => {
        const userCurrency = res?.data?.currency || "USD";
        setCurrency(userCurrency);
        console.log("User's currency:", userCurrency);
      })
      .catch((err) => {
        console.error(err);
        setCurrency("USD");
      });
    return () => controller.abort();
  }, []); // <-- run once

  // Optional: cache USD-based FX table once
  const [usdRates, setUsdRates] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(
        "https://v6.exchangerate-api.com/v6/9f6020acea6f209461dca627/latest/USD",
        { signal: controller.signal }
      )
      .then((res) => setUsdRates(res?.data?.conversion_rates || null))
      .catch((e) => console.error("FX fetch failed", e));
    return () => controller.abort();
  }, []);

  const handleProceedToPayment = async (
    invite,
    jobId,
    inviteId,
    rateOffered, // number, in actualCurrency
    actualCurrency, // e.g., 'EUR'
    duration, // number (hours) if hourly
    paymentType // 'hourly' | 'fixed'
  ) => {
    try {
      if (!currency || !usdRates) {
        console.warn("Missing currency or FX rates");
        return;
      }

      const convert = makeConverter(usdRates);

      // 1) Base amount in actualCurrency
      const baseAmount = Number(
        paymentType === "hourly" ? rateOffered * duration : rateOffered
      );

      // 2) Convert base to user's currency
      const convertedAmount = convert(baseAmount, actualCurrency, currency); // user currency

      // 3) Fees in user's currency
      const serviceFeeUser = convertedAmount * SERVICE_FEE_RATE; // 10%
      const platformFeeUser = convert(PLATFORM_FEE_USD, "USD", currency);

      const payableAmount = round2(serviceFeeUser + platformFeeUser); // final charge in user's currency

      // 4) USD-side numbers (for records/settlement)
      const baseUSD = convert(baseAmount, actualCurrency, "USD");
      const amountUSDAfterPlatform = round2(
        baseUSD * SERVICE_FEE_RATE + PLATFORM_FEE_USD
      );

      // 5) Round display fields (not before)
      const payload = {
        amount: payableAmount, // charge in user's currency
        currency: currency, // user's currency
        convertedAmount: round2(convertedAmount), // base (no fees) in user currency
        convertedPlatformFee: round2(platformFeeUser), // platform fee in user currency
        actualAmount: round2(baseAmount), // base in actualCurrency
        actualCurrency,
        amountUSD: amountUSDAfterPlatform, // total fees in USD (10% + $20)
        platformFee: PLATFORM_FEE_USD, // in USD
      };

      console.log("Payment payload", payload);

      const res = await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}jobs/pay-for-invite/${inviteId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.stripeRequired) {
        window.location.href = res.data.url;
      } else {
        alert("Payment successful");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      // alert("Payment failed. Please try again later.");
    }
  };

  // useEffect(() => {
  //   // Step 1: Get user's currency
  //   axios
  //     .get("https://ipapi.co/json/")
  //     .then((res) => {
  //       const userCurrency = res.data.currency;
  //       setCurrency(userCurrency);
  //       console.log("User's currency:", userCurrency);
  //     })
  //     .catch((err) => console.error(err));
  // }, [currency]);

  // const handleProceedToPayment = async (
  //   invite,
  //   jobId,
  //   inviteId,
  //   rateOffered,
  //   actualCurrency,
  //   duration,
  //   paymentType
  // ) => {
  //   console.log("fjapsf", {
  //     invite,
  //     jobId,
  //     inviteId,
  //     rateOffered,
  //     actualCurrency,
  //     duration,
  //     paymentType,
  //   });

  //   if (!currency) return;

  //   const rateRes = await axios.get(
  //     `https://v6.exchangerate-api.com/v6/9f6020acea6f209461dca627/latest/${actualCurrency}`
  //   );
  //   const platformFeeRate = await axios.get(
  //     `https://v6.exchangerate-api.com/v6/9f6020acea6f209461dca627/latest/${currency}`
  //   );

  //   const rate = rateRes.data.conversion_rates[currency] || 1;
  //   let convertedAmount = (rateOffered * rate).toFixed(2);
  //   console.log("Converted Amount", convertedAmount);
  //   let platformFee = 20;
  //   let convertedPlatformFee =
  //     platformFee * platformFeeRate.data.conversion_rates[currency] || 1;
  //   let actualAmountInUSD =
  //     rateOffered * platformFeeRate.data.conversion_rates[currency] || 1;
  //   console.log({ convertedAmount, convertedPlatformFee });
  //   let realAmtAfterPlatform = (rateOffered * 10) / 100 + platformFee;
  //   let amountUSDAfterPlatform = actualAmountInUSD * 0.1 + convertedPlatformFee;
  //   console.log("Amount after platform fee in USD", amountUSDAfterPlatform);

  //   if (paymentType === "hourly") {
  //     realAmtAfterPlatform = (rateOffered * duration * 10) / 100 + platformFee;
  //     amountUSDAfterPlatform =
  //       (actualAmountInUSD * duration * 10) / 100 + convertedPlatformFee;
  //     convertedAmount = rateOffered * duration * rate;
  //     console.log("Converted Amt after platform", convertedAmount);

  //     let payableAmount = convertedAmount * 0.1 + convertedPlatformFee;
  //     console.log("Payable Amount", payableAmount);

  //     // try {
  //     //   const res = await axios.post(
  //     //     `${BASE_URLS.BACKEND_BASEURL}jobs/pay-for-invite/${inviteId}`,
  //     //     {
  //     //       amount: payableAmount,
  //     //       currency: currency,
  //     //       convertedAmount,
  //     //       convertedPlatformFee,
  //     //       actualAmount: rateOffered * duration,
  //     //       actualCurrency,
  //     //       amountUSD: amountUSDAfterPlatform.toFixed(2),
  //     //       platformFee,
  //     //       convertedPlatformFee,
  //     //     },
  //     //     {
  //     //       headers: {
  //     //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     //       },
  //     //     }
  //     //   );
  //     //   if (res.data.stripeRequired) {
  //     //     window.location.href = res.data.url;
  //     //   } else {
  //     //     alert("Payment successful");
  //     //   }
  //     // } catch (error) {
  //     //   console.error("Error processing payment:", error);
  //     //   alert("Payment failed. Please try again later.");
  //     // }
  //   }

  //   let payableAmount = convertedAmount * 0.1 + convertedPlatformFee;
  //   console.log("Payable Amount", payableAmount);
  //   // try {
  //   //   const res = await axios.post(
  //   //     `${BASE_URLS.BACKEND_BASEURL}jobs/pay-for-invite/${inviteId}`,
  //   //     {
  //   //       amount: payableAmount,
  //   //       currency: currency,
  //   //       convertedAmount,
  //   //       convertedPlatformFee,
  //   //       actualAmount: rateOffered,
  //   //       actualCurrency,
  //   //       amountUSD: amountUSDAfterPlatform.toFixed(2),
  //   //       platformFee,
  //   //       convertedPlatformFee,
  //   //     },
  //   //     {
  //   //       headers: {
  //   //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   //       },
  //   //     }
  //   //   );
  //   //   if (res.data.stripeRequired) {
  //   //     window.location.href = res.data.url;
  //   //   } else {
  //   //     alert("Payment successful");
  //   //   }
  //   // } catch (error) {
  //   //   console.error("Error processing payment:", error);
  //   //   alert("Payment failed. Please try again later.");
  //   // }
  // };
  function acceptInvite(inviteId) {
    axios
      .patch(
        `${BASE_URLS.BACKEND_BASEURL}jobs/invitation/${inviteId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setNotifications((prev) =>
          prev.map((n) => {
            const currentInviteId = n?.metadata?.inviteId?._id;
            if (currentInviteId === inviteId) {
              return {
                ...n,
                metadata: {
                  ...n.metadata,
                  inviteId: {
                    ...n.metadata.inviteId,
                    status: "accepted",
                  },
                },
              };
            }
            return n;
          })
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

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

        setNotifications(apiNotifications);
        console.log("Notifications fetched successfully:", apiNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const filtered = notifications.filter((n) => n.type === activeTab);

  const handleCancelBooking = (bookingId, userId) => {
    setSelectedBookingId(bookingId);
    setSelectedUserId(userId);
    console.log("Selected Booking ID:", bookingId, userId);
    setShowCancelPopup(true);
  };

  const confirmCancelBooking = () => {
    // Simulate cancelling by removing the booking from the list
    axios
      .post(
        `http://localhost:4000/api/jobs/${selectedBookingId}/cancel-booking/${selectedUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log("Booking cancelled successfully:", response.data);
        setShowCancelPopup(false);
        // navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking. Please try again later.");
      });
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
              <p className="mt-1 self-stretch h-14 justify-start text-[#3D3D3D] text-sm font-normal  text-sm">
                {notif?.metadata?.applicationMessage || "No message provided."}
              </p>
              <div className="mt-3 md:mt-0">
                <Link
                  to={`/dashboard/manage-jobs/${notif?.metadata?.jobId?._id}/view`}
                  className="text-[#E61E4D] font-medium no-underline hover:underline"
                >
                  View Application
                </Link>
              </div>
            </div>
            {notif?.createdAt && (
              <p className="text-xs w-full md:w-fit text-gray-500 mt-2">
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
              {(() => {
                const actor =
                  notif?.sender?._id === user?._id
                    ? notif?.user
                    : notif?.sender;
                return (
                  <div className="flex gap-2">
                    <img
                      src={actor?.profileImage}
                      alt={actor?.name || "User Profile"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="font-semibold text-base">{actor?.name}</h2>
                      <div className="flex  items-center text-[#3D3D3D] text-sm -mt-2 ">
                        <i className="ri-map-pin-line mr-1 text-lg" />
                        {actor?.city},
                        {actor?.country || "Location not specified"}
                      </div>
                    </div>
                  </div>
                );
              })()}
              <div className="text-right font-semibold">
                {notif?.metadata?.jobId?.currency} -{" "}
                {notif?.metadata?.jobId?.rateOffered || 12}/hr
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
                  {notif?.user?._id === user?.user ? (
                    <>
                      <button
                        onClick={() =>
                          handleCancelBooking(notif.metadata?.jobId?._id)
                        }
                        className="text-sm text-gray-500 hover:text-black"
                      >
                        Reject Invite
                      </button>
                      <button
                        onClick={() =>
                          acceptInvite(notif?.metadata?.inviteId._id)
                        }
                        className="text-sm text-[#E61E4D] font-semibold border-2 border-[#E61E4D] px-4 py-2  rounded-md hover:bg-[#E61E4D] hover:text-white ease-in duration-100 flex items-center gap-1"
                      >
                        Accept Invite
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="text-sm text-gray-500 hover:text-black">
                        Withdraw Invite
                      </button>
                      <button className="text-sm text-[#E61E4D] font-semibold border-2 border-[#E61E4D] px-4 py-2  rounded-md hover:bg-[#E61E4D] hover:text-white ease-in duration-100 flex items-center gap-1">
                        Send Reminder
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {notif?.user?._id === user?.user ? (
                    notif?.metadata?.inviteId?.isPaid ? (
                      <button className="text-sm text-green-600 hover:text-black">
                        Booking Confirmed
                      </button>
                    ) : (
                      <button className="text-sm text-gray-600 hover:text-black">
                        Waiting for Payment
                      </button>
                    )
                  ) : notif?.metadata?.inviteId?.isPaid ? (
                    <button className="text-sm text-green-600 hover:text-black">
                      Booking Completed
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleCancelBooking(notif.metadata?.jobId._id)
                        }
                        className="text-sm text-gray-600 hover:text-black"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          handleProceedToPayment(
                            notif,
                            notif?.metadata?.jobId._id,
                            notif?.metadata?.inviteId._id,
                            notif?.metadata?.jobId?.rateOffered,
                            notif?.metadata?.jobId?.currency,
                            notif?.metadata?.jobId?.duration,

                            notif?.metadata?.jobId?.paymentType
                          );
                          // setSelectedApplication({
                          //   inviteId: notif?.metadata?.inviteId._id,
                          //   jobId: notif?.metadata?.jobId._id,
                          // });
                          // setShowPaymentModal(true);
                        }}
                        className="text-sm text-[#E61E4D] border border-2 border-pink-500 px-4 py-1.5 rounded-md hover:bg-pink-50"
                      >
                        Complete Booking
                      </button>
                    </>
                  )}
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
                  src={
                    notif?.user?.profileImage ||
                    "https://via.placeholder.com/48"
                  }
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
              <span className={`text-xs font-normal font-['Inter'] leading-none ${notif.metadata?.jobId?.hiredStaff.includes(notif?.user?._id) ? 'bg-[#D8F1BF]' : 'bg-[#F2F2F2]'} bg-[#D8F1BF] capitalize text-[#3D3D3D] px-4 py-2 rounded-full inline-block`}>
                {notif.metadata?.jobId?.hiredStaff.includes(notif?.user?._id) && notif?.metadata?.inviteId?.status || "Booking Cancelled"}
              </span>
            </div>

            <hr className="border-1 border-zinc-200" />

            {/* Buttons */}
            <div className="mt-2 flex justify-end gap-4 items-center">
              <div className="flex place-items-center gap-3">
                <button
                  onClick={() => handleLike(notif?.user?._id)}
                  className="border py-1 px-2 rounded-full border-zinc-400"
                  title={
                    savedProfiles.includes(notif?.user?._id)
                      ? "Unsave Profile"
                      : "Save Profile"
                  }
                >
                  <i
                    className={`text-2xl ${
                      savedProfiles.includes(notif?.user?._id)
                        ? "ri-heart-fill text-red-500"
                        : "ri-heart-line text-[#E61E4D]"
                    }`}
                  ></i>
                </button>
              </div>
              {user.role !== "staff" ? (
                notif?.metadata?.jobId?.hiredStaff.includes(
                  notif?.user?._id
                ) ? (
                  <button
                    onClick={() =>
                      handleCancelBooking(
                        notif.metadata?.jobId._id,
                        notif?.user?._id
                      )
                    }
                    className="text-sm text-[#E61E4D] font-semibold border-1 border-[#E61E4D] px-4 py-2 rounded-lg  hover:text-white hover:bg-[#E61E4D] ease-in duration-100  flex items-center gap-1"
                  >
                    {/* <i className="ri-close-line text-lg" /> */}
                    Cancel Booking
                  </button>
                ) : (
                  <div className="text-sm text-[#E61E4D]  font-semibold  px-4 py-2 rounded-lg">
                    Booking cancelled
                  </div>
                )
              ) : notif?.metadata?.jobId?.hiredStaff.includes(user?.user) ? (
                <button
                  onClick={() =>
                    handleCancelBooking(
                      notif.metadata?.jobId._id,
                      notif?.user?._id
                    )
                  }
                  className="text-sm text-[#E61E4D] font-semibold border-1 border-[#E61E4D] px-4 py-2 rounded-lg  hover:text-white hover:bg-[#E61E4D] ease-in duration-100  flex items-center gap-1"
                >
                  {/* <i className="ri-close-line text-lg" /> */}
                  Cancel Booking
                </button>
              ) : (
                <div className="text-sm text-[#E61E4D] font-semibold  px-4 py-2 rounded-lg">
                  Booking cancelled
                </div>
              )}
              {/* <button
                onClick={() =>
                  handleCancelBooking(
                    notif.metadata?.jobId._id,
                    notif?.user?._id
                  )
                }
                className="text-sm text-[#E61E4D] font-semibold border-1 border-[#E61E4D] px-4 py-2 rounded-lg  hover:text-white hover:bg-[#E61E4D] ease-in duration-100  flex items-center gap-1"
              >
              
                Cancel Booking
              </button> */}

              {notif?.user?._id !== user?.user ? (
                <button onClick={()=>{
                  navigate(`/dashboard/messages`, {
                    state: { userId: notif?.user?._id },
                  })
                }} className="text-sm text-white bg-gradient-to-l from-pink-600 to-rose-600 border-1 border-pink-500 px-4 py-2 rounded-md hover:bg-pink-50">
                  Message Hostess
                </button>
              ) : null}
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
            <i
              onClick={() => setShowCancelPopup(false)}
              className="ri-close-line text-2xl  float-right"
            ></i>

            <p className=" text-gray-600">
              {user?.role === "staff"
                ? "Canceling this booking might result in violation of the terms and conditions."
                : " Booking fees and deposits are non refundable."}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {user?.role === "staff"
                ? "Are you sure you want to cancel this booking?"
                : "Please contact site admin to move this booking to another hostess."}
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

      {showPaymentModal && selectedApplication && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-2 right-2 text-gray-600 text-lg"
            >
              ✕
            </button>
            <StripeWrapper
              jobId={selectedApplication.jobId}
              inviteId={selectedApplication.invideId}
              onClose={() => setShowPaymentModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;
