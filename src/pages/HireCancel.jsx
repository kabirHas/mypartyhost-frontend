import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import BASE_URLS from "../config";

function HireCancel() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Processing cancellation...");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      axios
        .post(
          `${BASE_URLS.BACKEND_BASEURL}jobs/invite-payment-cancel`,
          { session_id: sessionId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setStatus("Payment cancelled ❌. No money was deducted.");
        })
        .catch((err) => {
          console.error(err);
          setStatus("Error while cancelling payment.");
        });
    } else {
      setStatus("No session ID found.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <svg
        className="w-24 h-24 text-red-500"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
      <h2 className="text-3xl font-bold mb-4">{status}</h2>
      <Link
        to="/jobs"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
      >
        Back to Jobs
      </Link>
    </div>
  );
}

export default HireCancel;
