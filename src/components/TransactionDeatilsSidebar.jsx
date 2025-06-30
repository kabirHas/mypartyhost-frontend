import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URLS from "../config";
import { Link } from "react-router-dom";

const TransactionDetailSidebar = ({ onClose }) => {
  const [reviewType, setReviewType] = useState("Event Organizer");
  const [reviewerName, setReviewerName] = useState("");
  const [eventName, setEventName] = useState(
    "Private yacht party – March 2025"
  );
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(4);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      reviewType,
      reviewerName,
      eventName,
      feedback,
      rating,
    };
    console.log("Submitted Review:", reviewData);
    // You can now POST to backend if needed
    onClose(); // Close after submit
  };

  return (
    <div className="fixed top-0 right-0 w-full sm:w-[600px] h-full bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto scrollbar-hide">
      <div className="self-stretch w-full px-4 py-6 bg-Token-BG-Neutral-Light-1 border-b border-Token-Border-&-Divider-Neutral-Light-2 inline-flex justify-start items-center gap-6 ">
        <button onClick={onClose} className="text-gray-800 text-xl">
          <i className="ri-arrow-left-line"></i>
        </button>
        <div className="text-Token-Text-Primary text-xl font-bold font-['Inter'] leading-normal">
          Transaction Details
        </div>
      </div>

      <div className="self-stretch h-[100%] relative overflow-hidden">
        <div className="self-stretch p-4 bg-Token-BG-Neutral-Light-2 rounded-2xl flex flex-col justify-start items-start gap-4 bg-[#F9F9F9] m-[10px]">
          

<div className="self-stretch bg-Token-BG-Neutral-Light-2 rounded-2xl inline-flex flex-col justify-start items-start gap-4">
    <div className="self-stretch justify-start text-Token-Text-Primary text-xl font-bold font-['Inter'] leading-normal">Transaction Summary</div>
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">Transaction ID:</div>
                    <div className="flex justify-start items-center gap-1">
                        <div className="justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">#TRX-001</div>
                        <div className="p-2 bg-Token-BG-Brand-Light-1 rounded-full outline outline-1 outline-offset-[-1px] outline-Token-Border-&-Divider-Neutral-Light-2 flex justify-start items-center gap-2.5 bg-[#FFF1F2]">
                            <i className="ri-file-copy-line w-5 h-5 flex justify-center items-center text-base"></i>
                        </div>
                    </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">User:</div>
                    <Link to="#" className="text-[#e61e4c] hover:underline font-medium">
                                 Emily Carter
                                </Link>
                  
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">Type:</div>
                    <div className="justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">Booking Payment</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">Amount:</div>
                    <div className="justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">$50</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">Date & Time:</div>
                    <div className="justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">12 Mar 2025, 3:15 PM</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">Payment Method:</div>
                    <div className="justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">Credit Card</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">Status:</div>
                    <div data-property-1="Confirmed" className="w-20 px-4 py-2 bg-lime-100 rounded-full flex justify-center items-center gap-2.5">
                        <div className="justify-start text-Token-Text-Primary text-xs font-normal font-['Inter'] leading-none">Successful</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-[520px] h-0 outline outline-1 outline-offset-[-0.50px] outline-Token-Border-&-Divider-Neutral-Light-2"></div>
        <div className="w-[536px] inline-flex justify-end items-center gap-4">
            <div className="flex justify-start items-center">
                <div className="justify-start text-Token-Text-Secondary text-xs font-normal font-['Inter'] leading-none">(If applicable)</div>
                <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                    
                    <Link to="#" className="text-[#e61e4c] no-underline font-medium">
                                 Cancel Payment
                                </Link>
                </div>
            </div>
            
            <button
                className="px-4 py-2 rounded-lg outline outline-1 flex justify-center items-center gap-2 text-sm font-medium font-['Inter'] leading-tight overflow-hidden"
                style={{
                  outlineColor: "#E61E4D",
                  outlineOffset: "-1px",
                  color: "#E61E4D",
                }}
              >
                Refund User
              </button>
        </div>
    </div>
</div>


        </div>
      </div>
    </div>
  );
};

export default TransactionDetailSidebar;
