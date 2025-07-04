import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StaffSinglePage() {
  const navigate = useNavigate();
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const [isDailyBooking, setIsDailyBooking] = useState(true);
  const [isInstantBook, setIsInstantBook] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAddRateOpen, setIsAddRateOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([
    "2025-03-04",
    "2025-03-05",
    "2025-03-07",
    "2025-03-08",
    "2025-03-10",
    "2025-03-13",
    "2025-03-15",
    "2025-03-17",
    "2025-03-19",
    "2025-03-20",
    "2025-03-21",
    "2025-03-22",
    "2025-03-24",
    "2025-03-25",
    "2025-03-27",
  ]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2, 1));
  const [showInstantPopup, setShowInstantPopup] = useState(false);
  const [additionalRates, setAdditionalRates] = useState([
    { service: "Beach Party", rate: 200 },
    { service: "Bikini Waitress", rate: 250 },
  ]);
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

  const handleBack = () => {
    navigate(-1)
  };

  const handleAddPhoto = () => {
    alert("Add Photo clicked");
  };

  const handleAddVoiceNote = () => {
    alert("Add Voice Note clicked");
  };

  const handleViewMore = () => {
    alert("View More reviews clicked");
  };

  const handleEdit = () => {
    setShowInstantPopup(!showInstantPopup);
  };

  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  const toggleDailyBooking = () => {
    setIsDailyBooking(!isDailyBooking);
  };

  const toggleInstantBook = () => {
    setIsInstantBook(!isInstantBook);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const toggleAddRate = () => {
    setShowInstantPopup(!showInstantPopup);
    setIsAddRateOpen(!isAddRateOpen);
    setNewService("");
    setNewRate("");
  };

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setSelectedDates((prev) =>
      prev.includes(dateString)
        ? prev.filter((d) => d !== dateString)
        : [...prev, dateString]
    );
  };

  const handleSelectAll = () => {
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    const allDates = [];
    for (
      let d = new Date(startOfMonth);
      d <= endOfMonth;
      d.setDate(d.getDate() + 1)
    ) {
      allDates.push(new Date(d).toISOString().split("T")[0]);
    }
    setSelectedDates(allDates);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleSaveRate = () => {
    if (newService && newRate && !isNaN(newRate) && newRate > 0) {
      setAdditionalRates([
        ...additionalRates,
        { service: newService, rate: parseFloat(newRate) },
      ]);
      toggleAddRate();
    } else {
      alert("Please select a service and enter a valid rate.");
    }
  };

  const renderCalendar = () => {
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    const days = [];

    const prevMonthDays = startDay === 0 ? 6 : startDay;
    const prevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      0
    );
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push({
        date: new Date(
          prevMonth.getFullYear(),
          prevMonth.getMonth(),
          prevMonth.getDate() - i
        ),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    const totalDays = days.length;
    const nextMonthDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          i
        ),
        isCurrentMonth: false,
      });
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="w-[479px] p-6 bg-white rounded-2xl shadow-[0px_0px_231px_9px_rgba(0,0,0,0.2)] outline outline-1 outline-[#ECECEC] flex flex-col gap-2.5">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                Select Available Dates
              </div>
              <div className="text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                {selectedDates.length} Date Selected
              </div>
            </div>
            <button
              onClick={toggleCalendar}
              className="p-2 rounded-lg outline outline-1 outline-[#ECECEC] flex items-center gap-2.5"
            >
              <i className="ri-close-line text-xl text-[#656565]"></i>
            </button>
          </div>
          <div className="min-w-80 p-4 bg-[#F9F9F9] rounded-lg outline outline-1 outline-[#ECECEC] flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <button onClick={handlePrevMonth} className="relative">
                <i className="ri-arrow-left-s-line text-xl text-[#3D3D3D]"></i>
              </button>
              <div className="text-center text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                {currentMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button onClick={handleNextMonth} className="relative">
                <i className="ri-arrow-right-s-line text-xl text-[#3D3D3D]"></i>
              </button>
            </div>
            <div className="h-0 outline outline-1 outline-[#ECECEC]"></div>
            <div className="flex justify-between items-center">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div
                  key={day}
                  className="flex-1 px-2 py-1 flex justify-center items-center"
                >
                  <div className="text-center text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                    {day}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              {weeks.map((week, index) => (
                <div key={index} className="flex justify-between items-center">
                  {week.map((day) => {
                    const dateString = day.date.toISOString().split("T")[0];
                    const isSelected = selectedDates.includes(dateString);
                    const isToday =
                      day.date.toDateString() === new Date().toDateString();
                    return (
                      <button
                        key={dateString}
                        onClick={() =>
                          day.isCurrentMonth && handleDateClick(day.date)
                        }
                        className={`flex-1 h-8 p-3 rounded ${
                          day.isCurrentMonth
                            ? isSelected
                              ? "bg-[#E61E4D] text-white outline outline-1 outline-[#B11235]"
                              : isToday
                              ? "text-[#E61E4D]"
                              : "text-[#292929]"
                            : "text-zinc-500"
                        } flex justify-center items-center`}
                        disabled={!day.isCurrentMonth}
                      >
                        <div className="text-center text-sm font-normal font-['Inter'] leading-tight">
                          {day.date.getDate()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="h-0 outline outline-1 outline-[#ECECEC]"></div>
            <div className="flex justify-end items-center gap-3">
              <button
                onClick={handleSelectAll}
                className="px-2 py-1 bg-[#FFF1F2] rounded-lg outline outline-1 outline-[#3D3D3D] flex items-center gap-2"
              >
                <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                  Select All
                </div>
                <i className="ri-check-line text-[#3D3D3D]"></i>
              </button>
            </div>
          </div>
          <button className="px-6 py-3 w-fit rounded-lg outline outline-1 outline-[#E61E4D] flex justify-center items-center gap-2">
            <div className="text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
              Update Availability
            </div>
            <i className="ri-calendar-check-line text-[#E61E4D]"></i>
          </button>
        </div>
      </div>
    );
  };

  const renderAddRateModal = () => {
    return (
      <div className="w-[517px] p-6 bg-white rounded-2xl shadow-[0px_0px_231px_9px_rgba(0,0,0,0.2)] outline outline-1 outline-[#ECECEC] flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              Add New Rate
            </div>
            <div className="text-[#656565] text-base font-medium font-['Inter'] leading-snug">
              Select a service and set its rate
            </div>
          </div>
          <button
            onClick={toggleAddRate}
            className="p-2 rounded-lg outline outline-1 outline-[#ECECEC] flex items-center gap-2.5"
          >
            <i className="ri-close-line text-xl text-[#656565]"></i>
          </button>
        </div>
        <div className="self-stretch flex flex-col gap-4">
          <div className="self-stretch flex flex-col gap-2">
            <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">
              Service
            </div>
            <select
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']"
            >
              <option value="" disabled>
                Select a service
              </option>
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          <div className="self-stretch flex flex-col gap-2">
            <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">
              Rate ($/hour)
            </div>
            <input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="Enter rate"
              className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={toggleAddRate}
              className="px-4 py-2 rounded-lg outline outline-1 outline-[#ECECEC] text-[#656565] text-sm font-medium font-['Inter'] leading-tight"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRate}
              className="px-4 py-2 rounded-lg outline outline-1 outline-[#E61E4D] text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="self-stretch bg-[#fafafa] w-full px-12 pt-20 pb-40 flex flex-col justify-center items-center gap-2.5">
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {renderCalendar()}
        </div>
      )}
      {isAddRateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {renderAddRateModal()}
        </div>
      )}
      <div className="w-full max-w-[1200px] flex flex-col justify-start gap-6">
        <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
          <button
            onClick={handleBack}
            className="px-3 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2"
          >
            <i className="ri-arrow-left-s-line text-xl text-[#656565]"></i>
            <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
              Back
            </div>
          </button>
        </div>
        <div className="w-full max-w-[1200px] flex justify-start items-start gap-12">
          <div className="flex gap-6">
            <div className="self-stretch flex w-1/2 flex-col gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                <div className="self-stretch h-[630px] relative rounded-lg overflow-hidden bg-gray-200">
                  <img
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1536924430914-91f9e2041b83?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZWxzfGVufDB8fDB8fHww"
                    alt=""
                  />
                  <button className="p-2 left-[530px] top-[27px] absolute bg-white rounded-lg inline-flex justify-start items-center gap-2.5">
                    <i className="ri-search-line text-xl text-[#3f3f3f]"></i>
                  </button>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1.5">
                  <div className="flex-1 h-28 flex justify-start items-start gap-2">
                    <img
                      className="flex-1 w-16 h-full object-cover object-top rounded-lg"
                      src="https://images.unsplash.com/photo-1611601322175-ef8ec8c85f01?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Thumbnail 1"
                    />
                    <img
                      className="flex-1 w-16 h-full object-cover object-top rounded-lg"
                      src="https://images.unsplash.com/photo-1613991917221-4723976fa917?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D"
                      alt="Thumbnail 2"
                    />
                  </div>
                  <div className="flex-1 h-28 flex justify-start items-start gap-2">
                    <img
                      className="flex-1 w-16 h-full object-cover object-top rounded-lg"
                      src="https://images.unsplash.com/photo-1613991917225-836ecf204c77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D"
                      alt="Thumbnail 3"
                    />
                    <img
                      className="flex-1 w-16 h-full object-cover object-top rounded-lg"
                      src="https://plus.unsplash.com/premium_photo-1664474898608-7537d5780e17?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1pbi1zYW1lLXNlcmllc3wyfHx8ZW58MHx8fHx8"
                      alt="Thumbnail 4"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddPhoto}
                  className="px-3 py-1 bg-[#FFF1F2] rounded-2xl inline-flex justify-start items-center gap-2"
                >
                  <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
                    Add Photo
                  </div>
                  <i className="ri-add-line text-xl text-[#656565]"></i>
                </button>
                <button
                  onClick={handleAddVoiceNote}
                  className="px-3 py-1 bg-[#FFF1F2] rounded-2xl inline-flex justify-start items-center gap-2"
                >
                  <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
                    Add Voice Note
                  </div>
                </button>
              </div>
              <div className="self-stretch h-[596px] p-4 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#F9F9F9] flex flex-col justify-start items-start gap-6">
                <div className="inline-flex justify-start items-center gap-2">
                  <div className="flex justify-start items-center gap-2">
                    <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                      Reviews
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <i className="ri-star-s-fill text-orange-500"></i>
                      <div className="justify-start text-orange-500 text-sm font-medium font-['Inter'] leading-tight">
                        4.9/5
                      </div>
                    </div>
                    <button
                      onClick={handleViewMore}
                      className="justify-start text-[#656565] text-sm font-medium font-['Inter'] underline leading-tight"
                    >
                      (120 Reviews)
                    </button>
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch pb-4 border-b border-[#ECECEC] flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch inline-flex justify-start items-start gap-3">
                      <img
                        className="w-12 h-12 rounded-full"
                        src="https://images.unsplash.com/photo-1613991917225-836ecf204c77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D"
                        alt="Reviewer"
                      />
                      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                        <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                          Nicole M.
                        </div>
                        <div className="inline-flex justify-start items-start gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className="ri-star-s-fill text-orange-500"
                            ></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Samantha is an absolute delight! Her presence elevates
                      every event and she makes everything run smoothly.
                    </div>
                  </div>
                  <div className="self-stretch pb-4 border-b border-[#ECECEC] flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch inline-flex justify-start items-start gap-3">
                      <img
                        className="w-12 h-12 rounded-full"
                        src="https://images.unsplash.com/photo-1613991917225-836ecf204c77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D"
                        alt="Reviewer"
                      />
                      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                        <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                          Amelia R.
                        </div>
                        <div className="inline-flex justify-start items-start gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className="ri-star-s-fill text-orange-500"
                            ></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Her energy and professionalism are unmatched. Samantha
                      really knows how to engage guests and create a welcoming
                      atmosphere.
                    </div>
                  </div>
                  <div className="self-stretch pb-4 border-b border-[#ECECEC] flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch inline-flex justify-start items-start gap-3">
                      <img
                        className="w-12 h-12 rounded-full"
                        src="https://images.unsplash.com/photo-1613991917225-836ecf204c77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D"
                        alt="Reviewer"
                      />
                      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                        <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                          Emily Carter
                        </div>
                        <div className="inline-flex justify-start items-start gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className="ri-star-s-fill text-orange-500"
                            ></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Sarah was fantastic to work with! She was incredibly
                      organized, and the entire event ran smoothly. She made
                      sure I had everything I needed and was always available
                      for any questions. One of the best event organizers I’ve
                      worked with!
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleViewMore}
                  className="justify-start my-4 text-[#E61E4D] text-base font-bold font-['Inter'] leading-snug"
                >
                  View More
                </button>
              </div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="flex justify-start items-center gap-4">
                    <div className="flex justify-start items-center gap-2">
                      <div className="flex justify-start items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className="ri-star-s-fill text-orange-500"
                          ></i>
                        ))}
                        <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                          5
                        </div>
                      </div>
                      <button
                        onClick={handleViewMore}
                        className="justify-start text-[#292929] text-base font-medium font-['Inter'] underline leading-snug"
                      >
                        (120 Reviews)
                      </button>
                    </div>
                    <div className="w-0 h-2 outline outline-1 outline-offset-[-0.50px] outline-[#656565]"></div>
                    <div className="flex justify-start items-center gap-2">
                      <i className="ri-flag-2-fill text-[#3D3D3D]"></i>
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Sydney, NSW
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch justify-start text-[#292929] text-6xl font-bold font-['Inter'] leading-[60.60px]">
                      Samantha Lee
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-[#292929] text-sm font-medium font-['Inter'] leading-tight">
                          About Me
                        </div>
                        <button onClick={handleEdit} className="w-4 h-4">
                          <i className="ri-edit-box-line text-[#656565]"></i>
                        </button>
                      </div>
                      <textarea
                        className="self-stretch h-40 p-3 outline outline-1 outline-offset-[-1px] outline-[#292929] resize-none"
                        value="I’m Samantha—a warm, professional, and versatile hostess with over 4 years of experience in VIP events, corporate functions, and brand promotions. I thrive on creating unforgettable experiences and ensuring every event sparkles with personality and style."
                        readOnly
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                      Top Skills
                    </div>
                    <button onClick={handleEdit} className="w-4 h-4">
                      <i className="ri-edit-box-line text-[#656565]"></i>
                    </button>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-end gap-3 flex-wrap">
                    {[
                      "Bikini/Lingerie",
                      "Poker Dealer",
                      "Party Hostess",
                      "Topless Waitress",
                      "Brand Promotion",
                    ].map((skill, i) => (
                      <div
                        key={i}
                        className="inline-flex flex-col justify-center items-center gap-2"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-2xl outline outline-dotted outline-1 outline-offset-[-1px] outline-[#656565]">
                          <i className="ri-vip-crown-line text-[#3D3D3D]"></i>
                        </div>
                        <div className="text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-tight">
                          {skill}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl inline-flex justify-start items-center gap-4">
                <div className="flex-1 flex justify-between items-center">
                  <div className="text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                    Profile Public Visibility
                  </div>
                  <button
                    onClick={toggleProfileVisibility}
                    className={`w-12 h-6 relative rounded-full ${
                      isProfileVisible ? "bg-[#E61E4D]" : "bg-[#656565]"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 absolute top-[6px] ${
                        isProfileVisible ? "left-[27px]" : "left-[9px]"
                      } bg-white rounded-full`}
                    />
                  </button>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
                <div className="inline-flex justify-start items-center gap-2">
                  <i className="ri-money-dollar-circle-line text-[#E61E4D] text-xl"></i>
                  <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                    Rates
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                      Base Hourly Rate
                    </div>
                    <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5">
                      <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        $150
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="flex-1 text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                      Are You Available for Daily Bookings
                    </div>
                    <button
                      onClick={toggleDailyBooking}
                      className={`w-12 h-6 relative rounded-full ${
                        isDailyBooking ? "bg-[#E61E4D]" : "bg-[#656565]"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 absolute top-[6px] ${
                          isDailyBooking ? "left-[27px]" : "left-[9px]"
                        } bg-white rounded-full`}
                      />
                    </button>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                        Daily Rate
                      </div>
                      <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5">
                        <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          $500
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
                <div className="inline-flex justify-start items-center gap-2">
                  <i className="ri-calendar-line text-[#E61E4D] text-xl"></i>
                  <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                    Available Dates
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    March 1, 2024 – March 31, 2024
                  </div>
                  <button
                    onClick={toggleCalendar}
                    className="text-[#E61E4D] text-sm font-normal font-['Inter'] underline"
                  >
                    {selectedDates.length} open dates
                  </button>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2">
                    <i className="ri-check-line text-[#E61E4D] text-lg"></i>
                    <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                      Available for
                    </div>
                  </div>
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-[#FFF1F2] rounded-2xl flex justify-start items-center gap-2"
                  >
                    <div className="text-black text-sm font-normal font-['Inter'] leading-tight">
                      Edit
                    </div>
                    <i className="ri-edit-box-line text-[#656565]"></i>
                  </button>
                </div>
                <div className="inline-flex justify-start items-center gap-2">
                  {["VIP Events", "Cocktail Parties", "Pool Parties"].map(
                    (event, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 bg-[#F9F9F9] rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5"
                      >
                        <div className="text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          {event}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="self-stretch p-6 bg-white rounded-3xl flex flex-col justify-start items-center gap-3">
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                      <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch flex flex-col justify-start items-start gap-1">
                          <div className="inline-flex justify-start items-center gap-1">
                            <div className="text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                              Hide Profile from Directory
                            </div>
                            <i className="ri-eye-off-line text-[#656565] text-lg"></i>
                          </div>
                          <div className="self-stretch text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Hiding will limit your visibility to organizers
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggleProfileVisibility}
                    className={`w-12 h-6 relative rounded-full ${
                      isProfileVisible ? "bg-[#E61E4D]" : "bg-[#656565]"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 absolute top-[6px] ${
                        isProfileVisible ? "left-[27px]" : "left-[9px]"
                      } bg-white rounded-full`}
                    />
                  </button>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                      <div className="self-stretch flex flex-col justify-start items-start">
                        <div className="self-stretch text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                          Turn Instant Book
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggleInstantBook}
                    className={`w-12 h-6 relative rounded-full ${
                      isInstantBook ? "bg-[#E61E4D]" : "bg-[#656565]"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 absolute top-[6px] ${
                        isInstantBook ? "left-[27px]" : "left-[9px]"
                      } bg-white rounded-full`}
                    />
                  </button>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                    Instant Booking Rate
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                        Base Hourly Rate
                      </div>
                      <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5">
                        <div className="text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                          $150
                        </div>
                      </div>
                    </div>
                    <button onClick={handleEdit} className="">
                      <i className="ri-edit-box-line text-[#656565] font-semibold ml-2"></i>
                    </button>
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch inline-flex justify-start items-start gap-2">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                      Additional Rate Options
                    </div>
                    <div className="self-stretch text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                      If you work different rates for different job types, add
                      each.
                    </div>
                  </div>
                  <button onClick={toggleAddRate} className="">
                    <i className="ri-edit-box-line text-[#656565] font-semibold ml-2"></i>
                  </button>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-2.5">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                    Job History
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    {[
                      { label: "Event Completed", value: "100" },
                      { label: "Cancels", value: "2" },
                      { label: "No Shows", value: "1" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="self-stretch inline-flex justify-start items-center gap-2"
                      >
                        <div className="p-2 bg-[#FFF1F2] rounded-lg flex justify-start items-center gap-2.5">
                          <i className="ri-goblet-fill text-[#E61E4D]"></i>
                        </div>
                        <div className="justify-start">
                          <span className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                            {item.label}:{" "}
                          </span>
                          <span className="text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showInstantPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="p-6 bg-white rounded-2xl shadow-[0px_0px_231.1999969482422px_9px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-center items-start gap-4 overflow-hidden">
            <div className="self-stretch inline-flex justify-end items-center gap-2.5">
              <div className="flex-1 justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Manage Instant Booking
              </div>
              <button
                onClick={handleEdit}
                className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5"
              >
                <i className="ri-close-line text-xl text-[#656565]"></i>
              </button>
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
                    <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5">
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        $150
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-[#656565] text-base font-bold font-['Inter'] leading-snug">
                    Rate By Services
                  </div>
                  {additionalRates.map((item, index) => (
                    <div
                      key={index}
                      className="self-stretch inline-flex justify-between items-center gap-4"
                    >
                      <div className="flex-1 justify-start text-black text-sm font-bold font-['Inter'] leading-tight">
                        {item.service}
                      </div>
                      <div className="flex justify-start items-center gap-2">
                        <div className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center">
                          <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                            ${item.rate}
                          </div>
                        </div>
                        <button>
                          <i className="ri-subtract-line bg-[#656565] text-sm px-1 py-1 rounded-sm text-white"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={toggleAddRate}
                  className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden"
                >
                  <div className="justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                    Add New
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffSinglePage;
