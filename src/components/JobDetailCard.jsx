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
    <div className="bg-white mt-4 p-4 rounded-xl  space-y-4 text-sm">
      <div>
        <h3 className="font-bold text-lg text-zinc-800 tracking-tight">
          Job Details
        </h3>
        <p className="text-zinc-700 mt-2">{jobDescription}</p>
      </div>

      <hr className="border-zinc-500" />

      <div className="text-zinc-700 my-3">
        <p className="mb-2">
          <strong>Positions Available:</strong> {numberOfPositions}
        </p>
        <div className="flex flex-wrap gap-4 text-zinc-600 items-center">
          <span className="flex items-center gap-1">
            <i className="ri-map-pin-line text-lg" />
            {`${suburb}, ${city}`}
          </span>
          <span className="flex items-center gap-1">
            <i className="ri-calendar-line text-lg" />
            {new Date(jobDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <i className="ri-time-line text-lg" />
            {`${startTime} – ${endTime}`}
          </span>
        </div>
      </div>
      <hr className="border-zinc-500" />
      <div className="text-zinc-700 space-y-1">
        <p>
          <strong>Gender:</strong> {lookingFor || "Any"}
        </p>
        {travelAllowance &&
          (travelAllowance === "none" ? (
            <p className="flex items-center gap-2">
              No Travel Compensation
              <i className="ri-close-circle-fill text-pink-600 text-base" />
            </p>
          ) : (
            <p className="flex items-center gap-2">
              Travel Compensation: {travelAllowance.toUpperCase()}
              <i className="ri-checkbox-circle-fill text-pink-600 text-base" />
            </p>
          ))}
      </div>
      <button
        className="my-16  px-3 py-2 border-2 border-pink-600 rounded-md flex place-content-center gap-2 no-underline font-semibold hover:bg-pink-600 hover:text-white transition-colors text-pink-600"
        to={"/"}
      >
        Edit Post <i class="ri-pencil-line"></i>
      </button>
    </div>
  );
}

export default JobDetailCard;
