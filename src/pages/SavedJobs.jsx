import React from "react";
import { useState } from "react";

function SavedJobs() {
  const [activeTab, setActiveTab] = useState("saved");
  return (
    <>
      <div className="self-stretch  inline-flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <h2 className="self-stretch justify-start text-black text-4xl font-bold font-['Inter'] leading-10">
            {activeTab === "saved" ? "Saved Jobs" : "Applied Jobs"}
          </h2>
          <div className="self-stretch flex flex-col justify-start items-start gap-8">
            <div className="border-b border-[#656565] inline-flex justify-start items-center">
              <div
                onClick={() => setActiveTab("saved")}
                className={`px-4 py-2 border-b-2 flex justify-center items-center gap-2.5 ${
                  activeTab === "saved" ? "border-[#E61E4D]" : ""
                }`}
              >
                <div
                  className={`justify-start text-sm font-medium font-['Inter'] leading-tight ${
                    activeTab === "saved" ? "text-[#E61E4D]" : "text-[#656565]"
                  }`}
                >
                  Saved Jobs
                </div>
              </div>
              <div
                onClick={() => setActiveTab("applied")}
                className={`px-4 py-2 border-b-2 flex justify-center items-center gap-2.5 ${
                  activeTab === "applied" ? "border-[#E61E4D]" : ""
                }`}
              >
                <div
                  className={`justify-start text-sm font-medium font-['Inter'] leading-tight ${
                    activeTab === "applied"
                      ? "text-[#E61E4D]"
                      : "text-[#656565]"
                  }`}
                >
                  Applied
                </div>
              </div>
            </div>

            {activeTab === "saved" ? (
              <div className="self-stretch flex flex-col justify-end items-start gap-6">
                <div className="self-stretch inline-flex justify-start items-center gap-6">
                  <div
                    data-property-1="Favorite"
                    className="flex-1 p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-end gap-2"
                  >
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch inline-flex justify-center items-start gap-4">
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                            <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                              Exclusive Beach Party – Energetic Hostess Required
                            </h3>
                            <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                              Beach Party
                            </div>
                          </div>
                          <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                            $100/h
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div
                              data-format="Stroke"
                              data-weight="Light"
                              className="relative"
                            >
                              <i className="ri-map-pin-line text-[#656565] text-base"></i>
                            </div>
                            <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              Gold Coast, QLD
                            </div>
                          </div>
                          <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Date & Time: April 2, 2025 | 4:00 PM – 9:00 PM
                          </div>
                        </div>
                      </div>
                      <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Join an upscale beach party where your charisma and
                        energy will set the vibe! Mingle with guests, assist
                        with event flow, and enjoy an outdoor celebration with a
                        twist.
                      </p>
                    </div>
                    <div className="self-stretch  h-0 outline-1 outline-offset-[-0.50px] outline-[#F9F9F9]"></div>
                    <div className="inline-flex justify-start items-center gap-6">
                      <button className="px-6 py-2 rounded-lg outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden">
                        <span className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                          Remove From Shortlist
                        </span>
                        <div
                          data-format="Stroke"
                          data-weight="Fill"
                          className="relative"
                        >
                          <i className="ri-poker-hearts-fill text-[#E61E4D] text-xl"></i>
                        </div>
                      </button>
                      <button className="px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden text-white text-base font-medium leading-snug font-['Inter']">
                        Apply Now
                      </button>
                    </div>
                  </div>
                  <div
                    data-property-1="Favorite"
                    className="flex-1 p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-end gap-2"
                  >
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch inline-flex justify-center items-start gap-4">
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                            <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                              Exclusive Beach Party – Energetic Hostess Required
                            </h3>
                            <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                              Beach Party
                            </div>
                          </div>
                          <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                            $100/h
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div
                              data-format="Stroke"
                              data-weight="Light"
                              className="relative"
                            >
                              <i className="ri-map-pin-line text-[#656565] text-base"></i>
                            </div>
                            <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              Gold Coast, QLD
                            </div>
                          </div>
                          <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Date & Time: April 2, 2025 | 4:00 PM – 9:00 PM
                          </div>
                        </div>
                      </div>
                      <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Join an upscale beach party where your charisma and
                        energy will set the vibe! Mingle with guests, assist
                        with event flow, and enjoy an outdoor celebration with a
                        twist.
                      </p>
                    </div>
                    <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-[#F9F9F9]"></div>
                    <div className="inline-flex justify-start items-center gap-6">
                      <button className="px-6 py-2 rounded-lg outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden">
                        <span className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                          Remove From Shortlist
                        </span>
                        <div
                          data-format="Stroke"
                          data-weight="Fill"
                          className="relative"
                        >
                          <i className="ri-poker-hearts-fill text-[#E61E4D] text-xl"></i>
                        </div>
                      </button>
                      <button className="px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden text-white text-base font-medium leading-snug font-['Inter']">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-6">
                  <div
                    data-property-1="Favorite"
                    className="flex-1 p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-end gap-2"
                  >
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch inline-flex justify-center items-start gap-4">
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                            <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                              Exclusive Beach Party – Energetic Hostess Required
                            </h3>
                            <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                              Beach Party
                            </div>
                          </div>
                          <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                            $100/h
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div
                              data-format="Stroke"
                              data-weight="Light"
                              className="relative"
                            >
                              <i className="ri-map-pin-line text-[#656565] text-base"></i>
                            </div>
                            <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              Gold Coast, QLD
                            </div>
                          </div>
                          <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Date & Time: April 2, 2025 | 4:00 PM – 9:00 PM
                          </div>
                        </div>
                      </div>
                      <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Join an upscale beach party where your charisma and
                        energy will set the vibe! Mingle with guests, assist
                        with event flow, and enjoy an outdoor celebration with a
                        twist.
                      </p>
                    </div>
                    <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-[#F9F9F9]"></div>
                    <div className="inline-flex justify-start items-center gap-6">
                      <button className="px-6 py-2 rounded-lg outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden">
                        <span className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                          Remove From Shortlist
                        </span>
                        <div
                          data-format="Stroke"
                          data-weight="Fill"
                          className="relative"
                        >
                          <i className="ri-poker-hearts-fill text-[#E61E4D] text-xl"></i>
                        </div>
                      </button>
                      <button className="px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden text-white text-base font-medium leading-snug font-['Inter']">
                        Apply Now
                      </button>
                    </div>
                  </div>
                  <div
                    data-property-1="Favorite"
                    className="flex-1 p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-end gap-2"
                  >
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch inline-flex justify-center items-start gap-4">
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                            <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                              Exclusive Beach Party – Energetic Hostess Required
                            </h3>
                            <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                              Beach Party
                            </div>
                          </div>
                          <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                            $100/h
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div
                              data-format="Stroke"
                              data-weight="Light"
                              className="relative"
                            >
                              <i className="ri-map-pin-line text-[#656565] text-base"></i>
                            </div>
                            <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              Gold Coast, QLD
                            </div>
                          </div>
                          <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Date & Time: April 2, 2025 | 4:00 PM – 9:00 PM
                          </div>
                        </div>
                      </div>
                      <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Join an upscale beach party where your charisma and
                        energy will set the vibe! Mingle with guests, assist
                        with event flow, and enjoy an outdoor celebration with a
                        twist.
                      </p>
                    </div>
                    <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-[#F9F9F9]"></div>
                    <div className="inline-flex justify-start items-center gap-6">
                      <button className="px-6 py-2 rounded-lg outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden">
                        <span className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                          Remove From Shortlist
                        </span>
                        <div
                          data-format="Stroke"
                          data-weight="Fill"
                          className="relative"
                        >
                          <i className="ri-poker-hearts-fill text-[#E61E4D] text-xl"></i>
                        </div>
                      </button>
                      <button className="px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden text-white text-base font-medium leading-snug font-['Inter']">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="self-stretch flex flex-col justify-end items-start gap-6">
                <div className="self-stretch inline-flex justify-start items-center gap-6">
                  <div
                    data-property-1="applied"
                    className="flex-1 p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-end gap-2"
                  >
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch inline-flex justify-center items-start gap-4">
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                            <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                              Exclusive Beach Party – Energetic Hostess Required
                            </h3>
                            <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                              Beach Party
                            </div>
                          </div>
                          <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                            $100/h
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div
                              data-format="Stroke"
                              data-weight="Light"
                              className="relative"
                            >
                              <i className="ri-map-pin-line text-[#656565] text-base"></i>
                            </div>
                            <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              Gold Coast, QLD
                            </div>
                          </div>
                          <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Date & Time: April 2, 2025 | 4:00 PM – 9:00 PM
                          </div>
                        </div>
                      </div>
                      <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Join an upscale beach party where your charisma and
                        energy will set the vibe! Mingle with guests, assist
                        with event flow, and enjoy an outdoor celebration with a
                        twist.
                      </p>
                    </div>
                    <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-[#F9F9F9]"></div>
                    <div className="inline-flex justify-start items-center gap-4">
                      <div className="flex justify-start items-center gap-6">
                        <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                          <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                            You already applied for this job
                          </div>
                        </div>
                      </div>
                      <button className="px-6 py-3 rounded-lg outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden">
                        <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                          Withdraw Application
                        </div>
                      </button>
                    </div>
                  </div>
                  <div
                    data-property-1="applied"
                    className="flex-1 p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-end gap-2"
                  >
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch inline-flex justify-center items-start gap-4">
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                            <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                              Exclusive Beach Party – Energetic Hostess Required
                            </h3>
                            <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                              Beach Party
                            </div>
                          </div>
                          <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                            $100/h
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div
                              data-format="Stroke"
                              data-weight="Light"
                              className="relative"
                            >
                              <i className="ri-map-pin-line text-[#656565] text-base"></i>
                            </div>
                            <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              Gold Coast, QLD
                            </div>
                          </div>
                          <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Date & Time: April 2, 2025 | 4:00 PM – 9:00 PM
                          </div>
                        </div>
                      </div>
                      <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Join an upscale beach party where your charisma and
                        energy will set the vibe! Mingle with guests, assist
                        with event flow, and enjoy an outdoor celebration with a
                        twist.
                      </p>
                    </div>
                    <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-[#F9F9F9]"></div>
                    <div className="inline-flex justify-start items-center gap-4">
                      <div className="flex justify-start items-center gap-6">
                        <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                          <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                            You already applied for this job
                          </div>
                        </div>
                      </div>
                      <button className="px-6 py-3 rounded-lg outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden">
                        <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                          Withdraw Application
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-6">
                  <div
                    data-property-1="applied"
                    className="flex-1 p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-end gap-2"
                  >
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch inline-flex justify-center items-start gap-4">
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                            <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                              Exclusive Beach Party – Energetic Hostess Required
                            </h3>
                            <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                              Beach Party
                            </div>
                          </div>
                          <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                            $100/h
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div
                              data-format="Stroke"
                              data-weight="Light"
                              className="relative"
                            >
                              <i className="ri-map-pin-line text-[#656565] text-base"></i>
                            </div>
                            <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              Gold Coast, QLD
                            </div>
                          </div>
                          <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Date & Time: April 2, 2025 | 4:00 PM – 9:00 PM
                          </div>
                        </div>
                      </div>
                      <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Join an upscale beach party where your charisma and
                        energy will set the vibe! Mingle with guests, assist
                        with event flow, and enjoy an outdoor celebration with a
                        twist.
                      </p>
                    </div>
                    <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-[#F9F9F9]"></div>
                    <div className="inline-flex justify-start items-center gap-4">
                      <div className="flex justify-start items-center gap-6">
                        <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                          <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                            You already applied for this job
                          </div>
                        </div>
                      </div>
                      <button className="px-6 py-3 rounded-lg outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden">
                        <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                          Withdraw Application
                        </div>
                      </button>
                    </div>
                  </div>
                  <div
                    data-property-1="applied"
                    className="flex-1 p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-end gap-2"
                  >
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch inline-flex justify-center items-start gap-4">
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                            <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                              Exclusive Beach Party – Energetic Hostess Required
                            </h3>
                            <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                              Beach Party
                            </div>
                          </div>
                          <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                            $100/h
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div
                              data-format="Stroke"
                              data-weight="Light"
                              className="relative"
                            >
                              <i className="ri-map-pin-line text-[#656565] text-base"></i>
                            </div>
                            <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              Gold Coast, QLD
                            </div>
                          </div>
                          <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Date & Time: April 2, 2025 | 4:00 PM – 9:00 PM
                          </div>
                        </div>
                      </div>
                      <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Join an upscale beach party where your charisma and
                        energy will set the vibe! Mingle with guests, assist
                        with event flow, and enjoy an outdoor celebration with a
                        twist.
                      </p>
                    </div>
                    <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-[#F9F9F9]"></div>
                    <div className="inline-flex justify-start items-center gap-4">
                      <div className="flex justify-start items-center gap-6">
                        <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                          <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                            You already applied for this job
                          </div>
                        </div>
                      </div>
                      <button className="px-6 py-3 rounded-lg outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden">
                        <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                          Withdraw Application
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SavedJobs;
