import React, { useState } from "react";

function BoostSidebar({onClose}) {
  const [selectedOption, setSelectedOption] = useState("mostLoved");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div className="w-[600px] h-[1024px]  right-0 top-0 fixed bg-[#FFFFFF] shadow-[-7px_2px_250px_32px_rgba(0,0,0,0.15)] border-l border-[#ECECEC] inline-flex flex-col justify-start items-start">
      <div className="self-stretch px-4 py-6 bg-[#FFFFFF] border-b border-[#ECECEC] overflow-y-auto flex justify-start items-center gap-6">
      <i onClick={onClose} className="ri-arrow-left-line text-2xl"></i>
        <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
          Boost Control Panel
        </div>
      </div>
      <div className="self-stretch h-[944px] relative overflow-auto">
        <div className="w-[600px] px-4 pt-4 pb-6 left-0 top-0 absolute flex flex-col justify-start items-start gap-4">
          <div className="self-stretch p-4 w-full bg-[#F9F9F9] rounded-2xl flex flex-col justify-start items-start gap-3">
            <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              User Details
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch w-full flex justify-start items-center gap-6">
                <img
                  className="w-20 h-20 rounded-full"
                  src="https://placehold.co/80x80"
                />
                <div className=" w-full flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Full Name:
                    </div>
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      Samantha Lee
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      User Type:
                    </div>
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      Hostess
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Location:
                    </div>
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      Sydney, NSW
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Profile Boosting:
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                      Off
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px]"></div> */}
            </div>
          </div>
          <div className="self-stretch p-4 relative bg-[#F9F9F9] rounded-2xl flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              Manage Boost
            </div>

            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="inline-flex justify-start items-center gap-2">
                <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                  City:
                </div>
                <div
                  data-property-1="default"
                  className="px-3 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-start items-center gap-2"
                >
                  <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                    Melbourne
                  </div>
                </div>
                <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                  <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                    Add City
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch justify-start text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                  Duration
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-2 flex-wrap content-start">
                  <div
                    data-property-1="Default"
                    className="px-3 py-2 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-center items-center gap-2.5"
                  >
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      3 Days
                    </div>
                  </div>
                  <div
                    data-property-1="active"
                    className="px-3 py-2 bg-[#FFF1F2] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2.5"
                  >
                    <div className="justify-start text-Token-Text-button text-sm font-normal font-['Inter'] leading-tight">
                      7 Days
                    </div>
                  </div>
                  <div
                    data-property-1="Default"
                    className="px-3 py-2 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-center items-center gap-2.5"
                  >
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      10 Days
                    </div>
                  </div>
                  <div
                    data-property-1="Default"
                    className="px-3 py-2 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-center items-center gap-2.5"
                  >
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      15 Days
                    </div>
                  </div>
                  <div
                    data-property-1="Default"
                    className="px-3 py-2 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-center items-center gap-2.5"
                  >
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      21 Days
                    </div>
                  </div>
                  <div
                    data-property-1="Default"
                    className="px-3 py-2 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-center items-center gap-2.5"
                  >
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      30 Days
                    </div>
                  </div>
                </div>
                <div className="rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] flex flex-col justify-start items-start gap-3">
                  <div className="px-4 py-2 inline-flex justify-start items-center gap-3">
                    <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Custom
                    </div>
                    <div
                      data-format="Stroke"
                      data-weight="Regular"
                      className="w-6 h-6 relative"
                    >
                      <div className="w-6 h-6 left-0 top-0 absolute" />
                      <div className="w-4 h-4 left-[3.75px] top-[3.75px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                      <div className="w-0 h-[3px] left-[16.50px] top-[2.25px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                      <div className="w-0 h-[3px] left-[7.50px] top-[2.25px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                      <div className="w-4 h-0 left-[3.75px] top-[8.25px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                      <div className="w-0.5 h-0.5 left-[10.88px] top-[11.25px] absolute bg-[#E61E4D]" />
                      <div className="w-0.5 h-0.5 left-[15px] top-[11.25px] absolute bg-[#E61E4D]" />
                      <div className="w-0.5 h-0.5 left-[6.75px] top-[15px] absolute bg-[#E61E4D]" />
                      <div className="w-0.5 h-0.5 left-[10.88px] top-[15px] absolute bg-[#E61E4D]" />
                      <div className="w-0.5 h-0.5 left-[15px] top-[15px] absolute bg-[#E61E4D]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch justify-start text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                  Boost Type
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="flex flex-col gap-2">
                    {/* Radio Button 1 */}
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="boostOption"
                        value="mostLoved"
                        checked={selectedOption === "mostLoved"}
                        onChange={handleChange}
                        className="accent-[#E61E4D] w-4"
                      />

                      <span className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Boost to Most Loved Section
                      </span>
                      <div className="tooltip-wrapper">
                        <i class="ri-information-line"></i>
                        <span className="tooltip-text ">
                          Boost your profile to the top of search results for 7
                          days
                        </span>
                      </div>
                    </label>

                    {/* Radio Button 2 */}
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="boostOption"
                        value="topSearch"
                        checked={selectedOption === "topSearch"}
                        onChange={handleChange}
                        className="accent-[#E61E4D] w-4"
                      />

                      <span className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Boost to Top of Search
                      </span>
                      <div className="tooltip-wrapper">
                        <i class="ri-information-line"></i>
                        <span className="tooltip-text ">
                          Boost your profile to the top of search results for 7
                          days
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch justify-start text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                  Cost
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                      Boosting Charge
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      $30/day
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                      Estimated Cost
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      $210.00
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch inline-flex justify-end items-center gap-4">
              <div className="flex justify-start items-center gap-4">
                <div className="justify-start text-black text-base font-medium font-['Inter'] leading-snug">
                  Boost Profile:
                </div>
                <div className="flex justify-start items-center gap-1">
                  <div
                    data-property-1="ToggleRight"
                    className="w-12 h-12 relative"
                  >
                    <div
                      data-format="Stroke"
                      data-weight="Regular"
                      className="w-12 h-12 left-0 top-0 absolute"
                    >
                      <div className="w-12 h-12 left-0 top-0 absolute" />
                      <div className="w-10 h-6 left-[3px] top-[12px] absolute bg-[#E61E4D] outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                      <div className="w-3 h-3 left-[27px] top-[18px] absolute bg-[#F9F9F9] outline outline-2 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Light-1" />
                    </div>
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                    on
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch p-4 bg-[#F9F9F9] rounded-2xl flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              Refund Boost
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-start text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                Cost
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                    Estimated Cost
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    $210.00
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                    Spent{" "}
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    $147
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="flex-1 justify-start text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">
                    Refundable $63{" "}
                  </div>
                  <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                    <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                      Refund
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2 h-8 left-[588px] top-[601px] absolute bg-[#656565] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default BoostSidebar;
