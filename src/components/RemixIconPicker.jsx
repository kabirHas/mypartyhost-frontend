// src/components/RemixIconPicker.jsx
import React, { useState, useEffect } from "react";

function RemixIconPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const [icons, setIcons] = useState([]); // Store fetched icons
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  // Fetch Remix Icons from CDN when component mounts
  useEffect(() => {
    const fetchIcons = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Remix Icons");
        }
        const data = await response.json();
        // Map icon names to class names (e.g., "billiards" -> "ri-billiards-line")
        const iconList = data.icons.map((icon) => `ri-${icon.name}-line`);
        setIcons(iconList);
      } catch (err) {
        console.error("Error fetching icons:", err);
        setError("Failed to load icons. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  // Filter icons based on search input
  const filteredIcons = icons.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-[517px] p-6 bg-white rounded-2xl shadow-[0px_0px_231px_9px_rgba(0,0,0,0.2)] outline outline-1 outline-[#ECECEC] flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              Select Remix Icon
            </div>
            <div className="text-[#656565] text-base font-medium font-['Inter'] leading-snug">
              Choose an icon for the skill
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg outline outline-1 outline-[#ECECEC] flex items-center gap-2.5"
          >
            <i className="ri-close-line text-xl text-[#656565]"></i>
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search icons..."
          className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']"
          disabled={loading}
        />
        <div className="grid grid-cols-5 gap-4 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="text-[#656565] text-base font-normal font-['Inter']">
              Loading icons...
            </div>
          ) : error ? (
            <div className="text-[#E61E4D] text-base font-normal font-['Inter']">
              {error}
            </div>
          ) : filteredIcons.length > 0 ? (
            filteredIcons.map((icon) => (
              <button
                key={icon}
                onClick={() => onSelect(icon)}
                className="p-2 rounded-lg outline outline-1 outline-[#ECECEC] hover:bg-[#FFF1F2] flex justify-center items-center"
                title={icon}
              >
                <i className={`${icon} text-2xl text-[#3D3D3D]`}></i>
              </button>
            ))
          ) : (
            <div className="text-[#656565] text-base font-normal font-['Inter']">
              No icons found
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg outline outline-1 outline-[#ECECEC] text-[#656565] text-sm font-medium font-['Inter'] leading-tight"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemixIconPicker;