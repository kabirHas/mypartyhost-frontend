import React from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import BASE_URLS from "../config";

const HireCheckoutForm = ({ onClose, jobId, applicationId, inviteId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      console.error("Payment error:", error.message);
      alert("Payment failed. Please try again.");
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      // ✅ Decide endpoint and body based on invite/application
      let endpoint = "";
      let payload = {
        paymentIntentId: paymentIntent.id,
      };

      if (inviteId) {
        endpoint = `http://localhost:4000/api/jobs/invite-payment/confirm`;
        payload.inviteId = inviteId;
      } else {
        endpoint = `http://localhost:4000/api/jobs/confirm-hire`;
        payload.jobId = jobId;
        payload.applicationId = applicationId;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Hiring response:", data);

      if (res.ok) {
        alert("🎉 Hire successful!");
        onClose();
        // window.location.reload();
      } else {
        console.error("Hiring error:", data.message);
        alert("Payment done but hiring failed. Contact support.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe}
        className="mt-4 bg-pink-600 text-white px-4 py-2 rounded"
      >
        Pay & Hire
      </button>
    </form>
  );
};


export default HireCheckoutForm;
