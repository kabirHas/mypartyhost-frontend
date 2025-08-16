// StripeWrapper.jsx
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import HireCheckoutForm from "./HireCheckoutForm";
import BASE_URLS from "../config";

const stripePromise = loadStripe("pk_test_51Nu8PEAnJrnEEoOOb6LEggK6o8vitWWhQ7IbZu5boQxovKxsHjfB5U7SaoVCPOf9c1gQj8FZXVsuaPXTznGjF3IV00CSDD14EY"); // Replace with your PK

const StripeWrapper = ({ jobId, applicationId, inviteId,onClose }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const getClientSecret = async () => {
      let url = "";
  
      if (inviteId) {
        // Invite-based payment
        url = `http://localhost:4000/api/jobs/pay-for-invite/${inviteId}`;
      } else if (jobId && applicationId) {
        // Application-based payment
        url = `http://localhost:4000/api/jobs/${jobId}/hire/${applicationId}/initiate`;
      } else {
        console.error("No valid identifiers passed to StripeWrapper");
        return;
      }
  
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        const data = await res.json();
        if (res.ok) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("Stripe Error:", data.message);
        }
      } catch (err) {
        console.error("Error initiating Stripe payment:", err);
      }
    };
  
    getClientSecret();
  }, [jobId, applicationId, inviteId]);
  

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <HireCheckoutForm inviteId={inviteId} jobId={jobId} applicationId={applicationId} onClose={onClose} />
    </Elements>
  ) : (
    <p>Preparing payment...</p>
  );
};

export default StripeWrapper;
