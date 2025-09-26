import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BASE_URLS from '../config';
const stripePromise = loadStripe('pk_test_51Nu8PEAnJrnEEoOOb6LEggK6o8vitWWhQ7IbZu5boQxovKxsHjfB5U7SaoVCPOf9c1gQj8FZXVsuaPXTznGjF3IV00CSDD14EY');

function AcceptBookingReq() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [application, setApplication] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardholderName, setCardholderName] = useState('');
  const [convertedTotal, setConvertedTotal] = useState(0);
  const [convertedDownPayment, setConvertedDownPayment] = useState(0);
  const [convertedBookingFee, setConvertedBookingFee] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);
  const [cardNumberValid, setCardNumberValid] = useState(false);
  const [cardExpiryValid, setCardExpiryValid] = useState(false);
  const [cardCvcValid, setCardCvcValid] = useState(false);

  

  const getData = async () => {
    try {
      console.log('Fetching application data for ID:', id);
      let { data } = await axios.get(`${BASE_URLS.BACKEND_BASEURL}jobs/application/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log('Application data received:', data.application);
      setApplication(data.application);
    } catch (error) {
      console.error('Error fetching application data:', error.response?.data || error.message);
      setError("Failed to load application data.");
    }
  };

  useEffect(() => {
    console.log('Component mounted, fetching data and currency');
    getData();
    axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        const userCurrency = res.data.currency;
        console.log("User's currency fetched:", userCurrency);
        setCurrency(userCurrency);
      })
      .catch((err) => console.error('Error fetching currency:', err.message));
  }, []);

  useEffect(() => {
    if (application && currency) {
      console.log('Calculating converted values for currency:', currency);
      const calculateConvertedValues = async () => {
        try {
          const baseAmount = calculateTotalCost();
          console.log('Base amount calculated:', baseAmount, application.job.currency);
          const rateRes = await axios.get(
            `https://v6.exchangerate-api.com/v6/9f6020acea6f209461dca627/latest/${application.job.currency}`
          );
          const platformFeeRate = await axios.get(
            `https://v6.exchangerate-api.com/v6/9f6020acea6f209461dca627/latest/USD`
          );

          const rate = rateRes.data.conversion_rates[currency] || 1;
          const platformFee = 25; // Fixed in USD
          const convertedPlatformFee = platformFee * (platformFeeRate.data.conversion_rates[currency] || 1);
          const convertedAmount = baseAmount * rate;
          const serviceFeeUser = convertedAmount * 0.1;
          const payable = serviceFeeUser + convertedPlatformFee;

          console.log('Conversion rates:', { jobCurrencyToUser: rate, usdToUser: platformFeeRate.data.conversion_rates[currency] });
          console.log('Converted values:', {
            total: convertedAmount.toFixed(2),
            downPayment: serviceFeeUser.toFixed(2),
            bookingFee: convertedPlatformFee.toFixed(2),
            payable: payable.toFixed(2),
          });

          setConvertedTotal(convertedAmount.toFixed(2));
          setConvertedDownPayment(serviceFeeUser.toFixed(2));
          setConvertedBookingFee(convertedPlatformFee.toFixed(2));
          setPayableAmount(payable.toFixed(2));
        } catch (err) {
          console.error('Conversion error:', err.message);
          setError("Failed to calculate converted amounts.");
        }
      };
      calculateConvertedValues();
    }
  }, [application, currency]);

  const calculateTotalCost = () => {
    if (!application) return 0;
    const { paymentType, rateOffered, duration } = application.job;
    const total = paymentType === "hourly" ? rateOffered * duration : rateOffered;
    console.log('Total cost calculated:', total, { paymentType, rateOffered, duration });
    return total;
  };

  const calculateRating = () => {
    const reviews = application?.staff?.reviews || [];
    if (reviews.length === 0) return { average: 0, count: 0 };
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const average = (total / reviews.length).toFixed(1);
    console.log('Rating calculated:', { average, count: reviews.length });
    return { average, count: reviews.length };
  };

  const formatDate = (dateString) => {
    const formatted = new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    console.log('Formatted date:', dateString, '->', formatted);
    return formatted;
  };

  const handleProceedToPayment = async () => {
    if (!currency || !application) {
      console.error('Cannot proceed to payment: missing currency or application');
      return;
    }
    setLoading(true);
    setError(null);
    console.log('Initiating payment for job:', application.job._id, 'application:', application._id);

    try {
      const baseAmount = calculateTotalCost();
      const rateRes = await axios.get(
        `https://v6.exchangerate-api.com/v6/9f6020acea6f209461dca627/latest/${application.job.currency}`
      );
      const platformFeeRate = await axios.get(
        `https://v6.exchangerate-api.com/v6/9f6020acea6f209461dca627/latest/USD`
      );

      const rate = rateRes.data.conversion_rates[currency] || 1;
      const platformFee = 25;
      const convertedPlatformFee = platformFee * (platformFeeRate.data.conversion_rates[currency] || 1);
      const convertedAmount = baseAmount * rate;
      const actualAmountInUSD = baseAmount * (rateRes.data.conversion_rates["USD"] || 1);
      const serviceFeeUser = convertedAmount * 0.1;
      const payableAmount = serviceFeeUser + convertedPlatformFee;
      const amountUSDAfterPlatform = actualAmountInUSD * 0.1 + platformFee;

      console.log('Payment initiation payload:', {
        currency,
        amount: payableAmount.toFixed(2),
        convertedAmount: convertedAmount.toFixed(2),
        actualAmount: baseAmount,
        actualCurrency: application.job.currency,
        amountUSD: amountUSDAfterPlatform.toFixed(2),
        platformFee,
        convertedPlatformFee: convertedPlatformFee.toFixed(2),
      });

      const res = await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}jobs/${application.job._id}/hire/${application._id}/initiate/new-method`,
        {
          currency,
          amount: payableAmount.toFixed(2),
          convertedAmount: convertedAmount.toFixed(2),
          actualAmount: baseAmount,
          actualCurrency: application.job.currency,
          amountUSD: amountUSDAfterPlatform.toFixed(2),
          platformFee,
          convertedPlatformFee: convertedPlatformFee.toFixed(2),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log('Payment initiation response:', res.data);

      if (!res.data.stripeRequired) {
        console.log('Wallet payment successful, navigating to /confirm-hire-new');
        navigate('/confirm-hire-new');
        return;
      }

      console.log('Stripe payment required, clientSecret received:', res.data.clientSecret);
      setClientSecret(res.data.clientSecret);
    } catch (error) {
      console.error('Payment initiation error:', error.response?.data || error.message);
      setError("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  const { average: rating, count: reviewCount } = application ? calculateRating() : { average: 0, count: 0 };

  return application && currency && (
    <Elements stripe={stripePromise}>
      <div className="self-stretch w-full bg-[#F9F9F9] self-stretch p-12 inline-flex flex-col justify-start items-center gap-2.5">
        <div className="w-full max-w-[1024px] mx-auto flex flex-col justify-start items-start gap-8">
          <div
            onClick={() => navigate(-1)}
            className="px-3 py-2 cursor-pointer rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2"
          >
            <i className="ri-arrow-left-line"></i>
            <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
              Back
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-8">
            <div className="self-stretch justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
              Accept Booking Request
            </div>
            <div className="self-stretch inline-flex justify-center items-start gap-8">
              <div className="flex-1 p-6 bg-[#FFFFFF] rounded-lg inline-flex flex-col justify-start items-start gap-12">
                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                  <div className="inline-flex justify-start items-start gap-2">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={application.staff.profileImage}
                      alt={application.staff.name}
                    />
                    <div className="w-56 inline-flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                        {application.staff.name}
                      </div>
                      <div className="self-stretch inline-flex justify-start items-center gap-2">
                        <i className="ri-map-pin-line text-[#656565]"></i>
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          {application.job.location}
                        </div>
                      </div>
                      <div className="inline-flex justify-start items-center gap-2">
                        <div className="flex justify-start items-center gap-1">
                          <i className="ri-star-fill text-orange-500"></i>
                          <div className="justify-start text-orange-500 text-sm font-medium font-['Inter'] leading-tight">
                            {rating}/5
                          </div>
                        </div>
                        <div className="justify-start text-[#656565] text-sm font-medium font-['Inter'] underline leading-tight">
                          ({reviewCount} {reviewCount === 1 ? "Review" : "Reviews"})
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      {application.message}
                    </div>
                    <div className="inline-flex justify-start items-center gap-2">
                      <i className="ri-calendar-check-line text-[#656565]"></i>
                      <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        Event Date: {formatDate(application.job.jobDate)}
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
                        {application.job.paymentType === "hourly" && (
                          <>
                            <div className="self-stretch inline-flex justify-between items-center">
                              <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                                Hours
                              </div>
                              <div className="text-right justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                                {application.job.duration}
                              </div>
                            </div>
                            <div className="self-stretch inline-flex justify-between items-center">
                              <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                                Rate/H
                              </div>
                              <div className="text-right justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                                {application.job.currency} {application.job.rateOffered}
                              </div>
                            </div>
                          </>
                        )}
                        {application.job.paymentType === "fixed" && (
                          <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                              Fixed Rate
                            </div>
                            <div className="text-right justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                              {application.job.currency} {application.job.rateOffered}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                          Total Cost
                        </div>
                        <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                          {currency} {convertedTotal}
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
                            {currency} {convertedDownPayment}
                          </div>
                        </div>
                        <div className="self-stretch inline-flex justify-between items-center">
                          <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Booking fee
                          </div>
                          <div className="justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            {currency} {convertedBookingFee}
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                          Confirm Booking
                        </div>
                        <div className="justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                          {currency} {payableAmount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-6">
                <PaymentForm
                  clientSecret={clientSecret}
                  cardholderName={cardholderName}
                  setCardholderName={setCardholderName}
                  onSuccess={() => navigate('/confirm-hire-new')}
                  onError={(msg) => setError(msg)}
                  setCardNumberValid={setCardNumberValid}
                  setCardExpiryValid={setCardExpiryValid}
                  setCardCvcValid={setCardCvcValid}
                  handleProceedToPayment={handleProceedToPayment}
                  loading={loading}
                  currency={currency}
                  cardNumberValid={cardNumberValid}
                  cardExpiryValid={cardExpiryValid}
                  cardCvcValid={cardCvcValid}
                  payableAmount={payableAmount}
                />
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
}

function PaymentForm({ 
  clientSecret, 
  cardholderName, 
  setCardholderName, 
  onSuccess, 
  onError, 
  setCardNumberValid, 
  setCardExpiryValid, 
  setCardCvcValid, 
  handleProceedToPayment, 
  loading, 
  currency, 
  cardNumberValid, 
  cardExpiryValid, 
  cardCvcValid, 
  payableAmount 
}) {
  const stripe = useStripe();
  const elements = useElements();

  // const BASE_URLS = {
  //   BACKEND_BASEURL: 'http://localhost:4000/api/',
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting payment with clientSecret:', clientSecret);
    if (!stripe || !elements || !cardholderName) {
      console.error('Payment submission failed: missing stripe, elements, or cardholderName');
      onError("Please enter cardholder name and card details.");
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    console.log('Card details:', { cardholderName, cardElement });

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: cardholderName,
        },
      },
    });

    if (error) {
      console.error('Stripe payment error:', error.message);
      onError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded, paymentIntent:', paymentIntent);
      try {
        console.log('Confirming payment with backend, paymentIntentId:', paymentIntent.id);
        const response = await axios.post(
          `${BASE_URLS.BACKEND_BASEURL}jobs/confirm-payment`,
          { paymentIntentId: paymentIntent.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log('Backend confirmation response:', response.data);
        onSuccess();
      } catch (err) {
        console.error('Backend confirmation error:', err.response?.data || err.message);
        onError("Failed to confirm payment.");
      }
    }
  };

  const handleButtonClick = (e) => {
    console.log('Button clicked, clientSecret:', clientSecret, 'Form valid:', {
      cardholderName,
      cardNumberValid,
      cardExpiryValid,
      cardCvcValid,
    });
    if (!clientSecret) {
      handleProceedToPayment();
    } else {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="self-stretch p-4 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-start items-start gap-3">
      <div className="self-stretch inline-flex justify-start items-start gap-3">
        <div className="flex-1 justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
          Payment Card Details
        </div>
        <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
          Enter New Card
        </div>
      </div>
      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
            Cardholder's Name
          </div>
          <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2.5 overflow-hidden">
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => {
                setCardholderName(e.target.value);
                console.log('Cardholder name updated:', e.target.value);
              }}
              placeholder="Enter the name as it appears on your card"
              className="w-full text-[#656565] text-sm font-normal font-['Inter'] leading-tight outline-none"
            />
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
            Card Number
          </div>
          <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2.5 overflow-hidden">
            <CardNumberElement
              className="w-full text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
              options={{
                style: {
                  base: {
                    fontSize: '14px',
                    color: '#656565',
                    '::placeholder': { color: '#656565' },
                  },
                },
              }}
              onChange={(event) => {
                setCardNumberValid(event.complete);
                console.log('Card number validity:', event.complete, 'Error:', event.error?.message);
              }}
            />
          </div>
        </div>
        <div className="self-stretch inline-flex justify-start items-start gap-4">
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
              Expiry Date
            </div>
            <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2.5 overflow-hidden">
              <CardExpiryElement
                className="w-full text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                options={{
                  style: {
                    base: {
                      fontSize: '14px',
                      color: '#656565',
                      '::placeholder': { color: '#656565' },
                    },
                  },
                }}
                onChange={(event) => {
                  setCardExpiryValid(event.complete);
                  console.log('Card expiry validity:', event.complete, 'Error:', event.error?.message);
                }}
              />
            </div>
          </div>
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
              CVV
            </div>
            <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2.5 overflow-hidden">
              <CardCvcElement
                className="w-full text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                options={{
                  style: {
                    base: {
                      fontSize: '14px',
                      color: '#656565',
                      '::placeholder': { color: '#656565' },
                    },
                  },
                }}
                onChange={(event) => {
                  setCardCvcValid(event.complete);
                  console.log('Card CVV validity:', event.complete, 'Error:', event.error?.message);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        type={clientSecret ? "submit" : "button"}
        onClick={handleButtonClick}
        disabled={loading || !currency || !cardholderName || !cardNumberValid || !cardExpiryValid || !cardCvcValid}
        className="self-stretch px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden disabled:opacity-50"
      >
        <div className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
          {clientSecret ? 'Submit Payment' : `Confirm Booking ${currency} ${payableAmount}`}
        </div>
      </button>
    </form>
  );
}

export default AcceptBookingReq;