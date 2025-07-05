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

  // Previous month's days
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

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
      isCurrentMonth: true,
    });
  }

  // Next month's days
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
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="#656565"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="min-w-80 p-4 bg-[#F9F9F9] rounded-lg outline outline-1 outline-[#ECECEC] flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <button onClick={handlePrevMonth} className=" relative ">
              <i class="ri-arrow-left-s-line text-xl"></i>
            </button>
            <div className="text-center text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <button onClick={handleNextMonth} className=" relative">
              <i class="ri-arrow-right-s-line text-xl"></i>
            </button>
          </div>
          <div className="h-0 outline outline-1 outline-[#ECECEC]"></div>
          <div className="flex justify-between items-center">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div
                key={day}
                className=" shaved flex-1 px-2 py-1 flex justify-center items-center"
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
              <i class="ri-check-line"></i>
            </button>
          </div>
        </div>
        <button className="px-6 py-3 w-fit rounded-lg outline outline-1 outline-[#E61E4D] flex justify-center items-center gap-2">
          <div className="text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
            Update Availability
          </div>
        </button>
      </div>
    </div>
  );
};
