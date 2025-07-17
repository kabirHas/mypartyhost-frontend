import React from "react";

function AcceptBookingReq() {
  return (
    <div className="self-stretch w-full bg-[#F9F9F9] self-stretch p-12 inline-flex flex-col justify-start items-center gap-2.5">
      <div className="w-full max-w-[1024px] mx-auto flex flex-col justify-start items-start gap-8">
        <div className="px-3 py-2   rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2">
        <i class="ri-arrow-left-line"></i>
          <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
            Back
          </div>
        </div>
        <div className="self-stretch  flex flex-col justify-start items-start gap-8">
          <div className="self-stretch justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
            Accept Booking Request
          </div>
          <div className="self-stretch inline-flex justify-center items-start gap-8">
            <div className="flex-1 p-6 bg-[#FFFFFF] rounded-lg inline-flex flex-col justify-start items-start gap-12">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="inline-flex justify-start items-start gap-2">
                  <img
                    className="w-12 h-12 rounded-full"
                    src="https://placehold.co/48x48"
                  />
                  <div className="w-56 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                      Charlotte Miller
                    </div>
                    <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <i className="ri-map-pin-line text-[#656565]"></i>
                      <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        Sydney, Australia
                      </div>
                    </div>
                    <div className="inline-flex justify-start items-center gap-2">
                      <div className="flex justify-start items-center gap-1">
                      <i className="ri-star-fill text-orange-500"></i>
                        <div className="justify-start text-orange-500 text-sm font-medium font-['Inter'] leading-tight">
                          4.9/5
                        </div>
                      </div>
                      <div className="justify-start text-[#656565] text-sm font-medium font-['Inter'] underline leading-tight">
                        (120 Reviews)
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                    Invitation Sent for Luxury Boat Party
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                  <i className="ri-calendar-check-line text-[#656565]"></i>
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Event Date: Feb 18, 2025
                    </div>
                  </div>
                </div>
                <div className="justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] underline leading-tight">
                  See Full Details
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch justify-start text-black text-xl font-bold font-['Inter'] leading-normal">
                  Booking Summary
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                          Hours
                        </div>
                        <div className="text-right justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                          3
                        </div>
                      </div>
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                          Rate/H
                        </div>
                        <div className="text-right justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                          $100
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                        Total Cost
                      </div>
                      <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                        $300
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-center gap-2">
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                          10% down payment
                        </div>
                        <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                          $30
                        </div>
                      </div>
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                          Booking fee
                        </div>
                        <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                          $25
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                        Confirm Booking
                      </div>
                      <div className="justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                        $55
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-6">
              <div className="self-stretch p-4 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-start items-start gap-3">
                <div className="self-stretch inline-flex justify-start items-start gap-3">
                  <div className="flex-1 justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    Payment Card Details
                  </div>
                  <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                    Saved Method
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Cardholder's Name
                    </div>
                    <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                      <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                        Enter the name as it appears on your card
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Cardholder's Name
                    </div>
                    <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                      <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                        xxxx xxxx xxxx xxxx
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-start gap-4">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        Expiry Date
                      </div>
                      <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                        <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                          MM/YY
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        CVV
                      </div>
                      <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                        <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                          xxx
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
                  <div className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
                    Confirm Booking $55
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcceptBookingReq;
