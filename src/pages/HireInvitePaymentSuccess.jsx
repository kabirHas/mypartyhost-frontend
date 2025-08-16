import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom';

function HireInvitePaymentSuccess() {
    const [searchParams] =  useSearchParams();
    const [status, setStatus] = useState("Verifying payment...");

    useEffect(() => {
        const sessionId = searchParams.get("session_id");
    
        if (sessionId) {
          axios
            .get(`http://localhost:4000/api/jobs/invite-payment/confirm`, {
              params: {
                session_id: sessionId
              }, 
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
              setStatus("Payment successful! Staff Hired Successfully.");
            })
            .catch((err) => {
              console.error(err);
              setStatus("Payment failed or not verified.");
            });
        } else {
          setStatus("No session ID found.");
        }
      }, []); 
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <svg className="w-24 h-24 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-3xl font-bold mb-4">{status}</h2>
      <Link to="/dashboard" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700">
        Go to Dashboard
      </Link>
    </div>
  )
}

export default HireInvitePaymentSuccess