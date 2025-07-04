import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const [availableDates, setAvailableDates] = useState([]);

  const events = [
    { date: "2024-01-01", label: "New Year Celebration Party", type: "confirmed" },
    { date: "2024-01-02", label: "Pool Pary", type: "confirmed" },
    { date: "2024-01-02", label: "Indoor Event", type: "invitation" },
    { date: "2024-01-02", label: "Beach party", type: "cancelled" },
    { date: "2024-01-15", label: "Bachelor Party", type: "confirmed" },
    { date: "2024-01-20", label: "Mom's Birthday", type: "birthday" },
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const formatDate = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const isAvailable = (day) => availableDates.includes(formatDate(day));

  const toggleAvailability = (day) => {
    const dateStr = formatDate(day);
    setAvailableDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  };

  const cells = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - startDay + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return { empty: true };
    const iso = formatDate(dayNum);
    const dayEvents = events.filter((e) => e.date === iso);
    return { day: dayNum, events: dayEvents };
  });

  const eventClass = (type) => {
    switch (type) {
      case "confirmed":
        return "bg-pink-600 text-white";
      case "invitation":
        return "bg-pink-200 text-black";
      case "cancelled":
        return "bg-gray-700 text-white";
      case "birthday":
        return "bg-gray-100 text-[10px] flex items-center gap-1 px-1 py-px font-medium";
      default:
        return "";
    }
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date) =>
    date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="p-4 bg-white rounded-3xl outline outline-1 outline-gray-200 flex flex-col gap-4 text-[10px] font-['Inter']">
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 bg-gray-100 rounded-lg outline outline-1 outline-gray-200"
          >
            <FaChevronLeft size={18} />
          </button>
          <div className="text-xl font-bold text-gray-900">{formatMonthYear(currentDate)}</div>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 rotate-180 bg-gray-100 rounded-lg outline outline-1 outline-gray-200"
          >
            <FaChevronLeft size={18} />
          </button>
        </div>
        <button className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 text-white text-sm rounded-lg font-medium">
          Set Availability
        </button>
      </div>

      {/* Legends */}
      <div className="flex gap-3 text-xs text-gray-600 items-center">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-pink-600 rounded-full" />
          Confirmed booking
        </div>
        <div className="h-3 w-px bg-gray-300" />
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-pink-200 rounded-full" />
          Booking Invitation
        </div>
        <div className="h-3 w-px bg-gray-300" />
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-gray-700 rounded-full" />
          Cancelled Booking
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 w-full flex flex-col gap-px bg-gray-200 rounded-lg overflow-hidden outline outline-1 outline-offset-[-1px] outline-[#ECECEC]">
        {/* Weekdays */}
        <div className="grid grid-cols-7 bg-gray-800 text-white text-xs font-medium text-center">
          {daysOfWeek.map((day, i) => (
            <div key={i} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {cells.map((cell, i) => (
            <div
              key={i}
              onClick={() => !cell.empty && toggleAvailability(cell.day)}
              className={`min-h-[70px] p-1.5 cursor-pointer bg-white flex flex-col items-start gap-1 transition-all border-2 ${
                !cell.empty && isAvailable(cell.day) ? "border-green-500 bg-green-50" : "border-transparent"
              }`}
            >
              {!cell.empty && (
                <>
                  <div className="text-gray-800 font-bold">{cell.day}</div>
                  {cell.events.map((event, idx) => (
                    <div
                      key={idx}
                      className={`rounded-sm px-1 py-[2px] w-full text-[10px] leading-none truncate ${eventClass(
                        event.type
                      )}`}
                    >
                      {event.type === "birthday" ? (
                        <span>🎂 {event.label}</span>
                      ) : (
                        event.label
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
