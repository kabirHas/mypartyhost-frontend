import React from "react";
import { Link } from "react-router-dom";

function JobDetailCard({
  jobDate,
  jobDescription,
  endTime,
  lookingFor,
  paymentType,
  rateOffered,
  travelAllowance,
  numberOfPositions,
  startTime,
  suburb,
  city,
}) {
  return (
    <div className="bg-white mt-4 p-6 rounded-xl  space-y-4 text-sm">
      <div>
        <h3 className="justify-start text-gray-700 text-base font-bold font-['Inter'] leading-snug">
          Job Details
        </h3>
        <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">{jobDescription}</p>
      </div>

      <hr className="border-[#ECECEC]" />

      <div className="text-zinc-700 my-3">
        <p className="self-stretch justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
          Positions Available: {numberOfPositions}
        </p>
        <div className="flex flex-wrap gap-6 text-[#3D3D3D] items-center">
          <span className="flex items-center gap-3">
            <i className="ri-map-pin-line text-lg" />
            <span className="justify-start text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
            {`${suburb}, ${city}`}
            </span>
          </span>
          <span className="flex items-center gap-3">
            <i className="ri-calendar-line text-lg" />
            {new Date(jobDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-3">
            <i className="ri-time-line text-lg" />
            {`${startTime} – ${endTime}`}
          </span>
        </div>
      </div>
      <hr className="border-zinc-500" />
      <div className="text-zinc-700 space-y-1">
        <p className="self-stretch justify-start text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
          Gender: {lookingFor || "Any"}
        </p>
        {travelAllowance &&
          (travelAllowance === "none" ? (
            <p className="flex items-center gap-2 self-stretch justify-start text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
              No Travel Compensation
              <i className="ri-close-circle-fill text-[#E61E4D] text-base" />
            </p>
          ) : (
            <p className="flex items-center gap-2">
              Travel Compensation: {travelAllowance.toUpperCase()}
              <i className="ri-checkbox-circle-fill text-[#E61E4D] text-base" />
            </p>
          ))}
      </div>
      <button
        className="px-4 py-2 text-[#E61E4D] font-medium  rounded-lg outline outline-2 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden"
        to={"/"}
      >
        Edit Post <i class="ri-pencil-line"></i>
      </button>
    </div>
  );
}

export default JobDetailCard;
