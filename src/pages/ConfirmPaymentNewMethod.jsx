import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URLS from "../config";

function ConfirmPaymentNewMethod() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const BASE_URLS = {
  //   BACKEND_BASEURL: 'http://localhost:4000/api/', // Adjust as needed
  // };

  // Extract paymentIntentId from query params (if redirected)
  const query = new URLSearchParams(location.search);
  const paymentIntentId = query.get('session_id') || null;

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!paymentIntentId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch payment confirmation details
        const response = await axios.post(
          `${BASE_URLS.BACKEND_BASEURL}jobs/confirm-payment`,
          { paymentIntentId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Payment confirmation response:", response.data);
        setPaymentDetails(response.data);
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError("Failed to load payment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentIntentId]);

  return (
    <div className="self-stretch w-full bg-[#F9F9F9] self-stretch p-12 inline-flex flex-col justify-start items-center gap-2.5">
      <div className="w-full max-w-[1024px] mx-auto flex flex-col justify-start items-start gap-8">
        <div className="self-stretch justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
          Payment Successful
        </div>
        <div className="self-stretch p-6 bg-[#FFFFFF] rounded-lg inline-flex flex-col justify-start items-start gap-6">
          {loading ? (
            <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
              Loading payment details...
            </div>
          ) : error ? (
            <div className="justify-start text-red-500 text-base font-normal font-['Inter'] leading-snug">
              {error}
            </div>
          ) : (
            <>
              <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                Your payment has been successfully processed. The staff has been hired for the job!
              </div>
              {paymentDetails && (
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                      Job Title
                    </div>
                    <div className="text-right justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                      {/* Adjust based on your Payment model response */}
                      {paymentDetails.jobTitle || "N/A"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                      Amount Paid
                    </div>
                    <div className="text-right justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                      {paymentDetails.currency} {paymentDetails.amount}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <button
              onClick={() => navigate('/dashboard')} // Adjust to your dashboard route
              className="self-stretch px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden"
            >
              <div className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
                Back to Dashboard
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPaymentNewMethod;