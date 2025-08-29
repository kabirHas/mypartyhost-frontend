import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URLS from "../config";

function BoostSidebar({ onClose, user }) {
  console.log("BoostSidebar user:", user);

  // Initialize state
  const [selectedOption, setSelectedOption] = useState(() => {
    if (user?.mostLovedSection) return "mostLoved";
    if (user?.topToSearch) return "topSearch";
    return "mostLoved"; // Fixed: Set default to "mostLoved"
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [boostData, setBoostData] = useState({
    mostLovedSection: user?.mostLovedSection || false,
    topToSearch: user?.topToSearch || false,
    status: user?.status || false,
    totalClicks: user?.totalClicks || 0,
  });
  const [selectedDuration, setSelectedDuration] = useState(null); // New state for duration

  // Calculate duration from expireDate
  const calculateDurationFromExpireDate = () => {
    if (user?.boostExpiresAt) {
      const today = new Date();
      const boostExpiresAt = new Date(user.boostExpiresAt);
      if (boostExpiresAt > today) {
        const timeDifference = boostExpiresAt.getTime() - today.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        return daysDifference;
      }
    }
    return null; // No valid boostExpiresAt, no highlight
  };

  // Sync boostData and duration with user prop changes
  useEffect(() => {
    if (user) {
      setBoostData({
        mostLovedSection: user.mostLovedSection || false,
        topToSearch: user.topToSearch || false,
        status: user.status || false,
        totalClicks: user.totalClicks || 0,
      });
      setSelectedOption(user.mostLovedSection ? "mostLoved" : user.topToSearch ? "topSearch" : "mostLoved");
      setSelectedDuration(calculateDurationFromExpireDate());
    }
  }, [user]);

  // Handle radio button change for boost type
  const handleChange = async (event) => {
    const newOption = event.target.value;
    console.log("Selected Boost Option:", newOption);
    setSelectedOption(newOption);

    const updateData = {
      mostLovedSection: newOption === "mostLoved" ? true : false,
      topToSearch: newOption === "topSearch" ? true : false,
    };

    console.log("Updating boost data:", updateData);

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}boost/manage/${user.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("API Response:", response.data); // Log full response for debugging

      if (response.data.success) {
        setBoostData((prev) => ({
          ...prev,
          mostLovedSection: updateData.mostLovedSection,
          topToSearch: updateData.topToSearch,
        }));
        console.log("Boost plan updated successfully:", response.data);
      } else {
        throw new Error(response.data.message || "API response indicated failure");
      }
    } catch (error) {
      console.error("Error updating boost plan:", error);
      setError(error.response?.data?.message || "Failed to update boost settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle boost plan duration change
  const handleBoostPlanChange = async (day) => {
    console.log(`Selected Boost Plan: ${day} days`);

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}boost/manage/${user.id}`,
        { days: day },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("API Response:", response.data); // Log full response for debugging

      if (response.data.success) {
        console.log("Boost plan updated successfully:", response.data);
        setSelectedDuration(day); // Update duration state
        // If API returns updated expireDate, calculate new duration
        if (response.data.data?.expireDate) {
          const expireDate = new Date(response.data.data.expireDate);
          const today = new Date();
          const daysDifference = Math.ceil((expireDate - today) / (1000 * 3600 * 24));
          setSelectedDuration(daysDifference);
        }
      } else {
        throw new Error(response.data.message || "API response indicated failure");
      }
    } catch (error) {
      console.error("Error updating boost plan:", error);
      setError(error.response?.data?.message || "Failed to update boost plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle custom date change
  const handleDateChange = async (event) => {
    const selectedDateValue = event.target.value;
    setSelectedDate(selectedDateValue);

    if (selectedDateValue) {
      const today = new Date();
      const selectedDateObj = new Date(selectedDateValue);
      const timeDifference = selectedDateObj.getTime() - today.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      console.log(`Days between today and ${selectedDateValue}: ${daysDifference} days`);

      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.patch(
          `${BASE_URLS.BACKEND_BASEURL}boost/manage/${user.id}`,
          { days: daysDifference },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("API Response:", response.data); // Log full response for debugging

        if (response.data.success) {
          console.log("Boost plan updated successfully:", response.data);
          setSelectedDuration(daysDifference); // Update duration state
          // If API returns updated expireDate, use it
          if (response.data.data?.expireDate) {
            const expireDate = new Date(response.data.data.expireDate);
            const days = Math.ceil((expireDate - today) / (1000 * 3600 * 24));
            setSelectedDuration(days);
          }
        } else {
          throw new Error(response.data.message || "API response indicated failure");
        }
      } catch (error) {
        console.error("Error updating boost plan:", error);
        setError(error.response?.data?.message || "Failed to update boost plan. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Predefined durations
  const durations = [3, 7, 10, 15, 21, 30];

  return (
    <div className="w-[600px] h-[1024px] right-0 top-0 fixed bg-[#FFFFFF] shadow-[-7px_2px_250px_32px_rgba(0,0,0,0.15)] border-l border-[#ECECEC] flex flex-col justify-start items-start">
      <div className="self-stretch px-4 py-6 bg-[#FFFFFF] border-b border-[#ECECEC] flex justify-start items-center gap-6">
        <i onClick={onClose} className="ri-arrow-left-line text-2xl cursor-pointer"></i>
        <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
          Boost Control Panel
        </div>
      </div>
      <div className="self-stretch h-[944px] overflow-auto">
        <div className="w-[600px] px-4 pt-4 pb-6 flex flex-col justify-start items-start gap-4">
          {/* User Details Section */}
          <div className="self-stretch p-4 bg-[#F9F9F9] rounded-2xl flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              User Details
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex justify-start items-center gap-6">
                <img
                  className="w-20 h-20 rounded-full"
                  src={user?.profileImage || "https://via.placeholder.com/150"}
                  alt="User Profile"
                />
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Full Name:
                    </div>
                    <div className="capitalize text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      {user?.username || "N/A"}
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      User Type:
                    </div>
                    <div className="text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      {user?.userRole === "staff" ? "Hostess" : "User"}
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Location:
                    </div>
                    <div className="text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      {user?.userCity || "N/A"}, {user?.userCountry || "N/A"}
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Profile Boosting:
                    </div>
                    <div
                      className="text-base font-medium font-['Inter'] leading-snug"
                      style={{ color: boostData.status ? "#128807" : "#B00020" }}
                    >
                      {boostData.status ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Total Clicks:
                    </div>
                    <div className="text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      {boostData.totalClicks}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Manage Boost Section */}
          <div className="self-stretch p-4 bg-[#F9F9F9] rounded-2xl flex flex-col justify-start items-start gap-4">
            <div className="self-stretch text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              Manage Boost
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              {/* Duration Section */}
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                  Duration 
                </div>
                <span className="text-sm font-normal mx-2">
                    Expires At :{" "}
                    {user.boostExpiresAt
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          
                        }).format(new Date(user.boostExpiresAt))
                      : "N/A"}
                  </span>
                <div className="self-stretch inline-flex justify-start items-start gap-2 flex-wrap">
                  {durations.map((day) => (
                    <div
                      key={day}
                      onClick={isLoading ? undefined : () => handleBoostPlanChange(day)}
                      className={`px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] cursor-pointer
                        ${
                          selectedDuration === day
                            ? "outline-[#E61E4D] bg-[#FFF1F2]"
                            : "outline-[#ECECEC] bg-[#FFFFFF]"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        {day} Days
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] flex flex-col justify-start items-start gap-3">
                  <div className="px-4 py-2 inline-flex justify-start items-center gap-3">
                    <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Custom
                    </div>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={user.boostExpiresAt ? new Date(user.boostExpiresAt).toISOString().split("T")[0] : ""}
                      onChange={handleDateChange}
                      className="rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] focus:outline-[#E61E4D]"
                      style={{ color: "#E61E4D" }}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Boost Type Section */}
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                  Boost Type
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      className={`inline-flex items-center gap-2 ${
                        isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="radio"
                        name="boostOption"
                        value="mostLoved"
                        checked={selectedOption === "mostLoved"}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="accent-[#E61E4D] w-4"
                      />
                      <span className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Boost to Most Loved Section
                        {boostData.mostLovedSection && (
                          <span className="text-[#128807] ml-2">(Active)</span>
                        )}
                      </span>
                      <div className="tooltip-wrapper">
                        <i className="ri-information-line"></i>
                        <span className="tooltip-text">
                          Boost your profile to the Most Loved section for increased visibility
                        </span>
                      </div>
                    </label>
                    <label
                      className={`inline-flex items-center gap-2 ${
                        isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="radio"
                        name="boostOption"
                        value="topSearch"
                        checked={selectedOption === "topSearch"}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="accent-[#E61E4D] w-4"
                      />
                      <span className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Boost to Top of Search
                        {boostData.topToSearch && (
                          <span className="text-[#128807] ml-2">(Active)</span>
                        )}
                      </span>
                      <div className="tooltip-wrapper">
                        <i className="ri-information-line"></i>
                        <span className="tooltip-text">
                          Boost your profile to the top of search results
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Cost Section */}
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                  Cost
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                      Boosting Charge
                    </div>
                    <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      $30/day
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                      Estimated Cost
                    </div>
                    <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      ${(selectedDuration || 0) * 30}.00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Boost Section */}
          <div className="self-stretch p-4 bg-[#F9F9F9] rounded-2xl flex flex-col justify-start items-start gap-4">
            <div className="self-stretch text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              Refund Boost
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                  Estimated Cost
                </div>
                <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  ${(selectedDuration || 0) * 30}.00
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                  Spent
                </div>
                <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  $147
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="flex-1 text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                  Refundable $63
                </div>
                <div className="py-1 rounded-lg flex justify-center items-center gap-2 cursor-pointer">
                  <div className="text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                    Refund
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="self-stretch text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
              {error}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-[#E61E4D] text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E61E4D]"></div>
              <span>Updating...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BoostSidebar;