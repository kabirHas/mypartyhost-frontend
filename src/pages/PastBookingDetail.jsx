import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BASE_URLS from "../config";

function PastBookingDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingFromState = location.state?.booking;

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [review, setReview] = useState(null);

  const getReview = async () => {
    try {
      const response = await axios.get(
        `h${BASE_URLS.BACKEND_BASEURL}review/my-reviews`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const currentReview = response.data.reviews.find(
        (r) =>
          r.eventId === booking.jobId && r.reviewer === booking.organizer._id
      );
      // console.log(currentReview);
      setReview(currentReview || null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  const booking = bookingFromState;
  // console.log(booking.organizer._id);

  if (!booking) {
    return (
      <div className="p-4 text-[#292929] text-xl font-bold font-['Inter']">
        Booking not found
      </div>
    );
  }

  const handleFeedbackSubmit = () => {
    const feedbackData = {
      event: booking.jobId,
      rating,
      comment: feedback || "No feedback provided",
    };
    console.log(booking.organizer._id)

    console.log("Feedback data:", feedbackData);

    axios
      .post(
        `${BASE_URLS.BACKEND_BASEURL}review/${booking.organizer._id}`,
        feedbackData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log("Feedback submitted successfully:", response.data);
        // Optionally, you can reset the form or show a success message
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        // Optionally, you can show an error message to the user
      });

    setRating(0);
    setFeedback("");
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="self-stretch bg-[#F9F9F9] w-full py-12 inline-flex flex-col justify-start items-center gap-8">
      <div className="flex flex-col justify-start items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2"
        >
          <i className="ri-arrow-left-line text-[#656565] w-6 h-6"></i>
          <span className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
            Back
          </span>
        </button>
        <div className="self-stretch inline-flex justify-center items-start gap-8">
          <div className="inline-flex flex-col justify-center items-start gap-6">
            <div className="w-[746px] p-6 bg-[#FFFFFF] rounded-3xl flex flex-col justify-start items-end gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                      {booking.title}
                    </div>
                    <div className="self-stretch justify-start text-[#656565] text-base font-normal font-['Inter'] leading-snug">
                      {booking.eventType || "Event"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                      Rate: {booking.rate}
                    </div>
                    <div className="px-4 py-2 bg-lime-100 rounded-full flex justify-center items-center gap-2.5">
                      <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                        Completed
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-bold font-['Inter'] leading-tight">
                    Event Overview
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Location: {booking.location}
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Date: {booking.date}
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Time: {booking.time} (
                      {booking.duration || "Duration not specified"})
                    </div>
                    <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Description:{" "}
                      {booking.description ||
                        "No additional description provided."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch p-6 bg-[#FFFFFF] rounded-2xl flex flex-col justify-start items-start gap-8">
              <div className="w-44 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  Payment Summary
                </div>
                <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                  {booking.paymentInfo?.totalHours} @ {booking.rate}
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Total Hours Booked
                    </div>
                    <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      {booking.paymentInfo?.totalHours || "N/A"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Total Fee
                    </div>
                    <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      {booking.paymentInfo?.eventFee || "N/A"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Deposit Paid
                    </div>
                    <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      {booking.paymentInfo?.bookingFee || "N/A"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      Paid to Hostess
                    </div>
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      {booking.paymentInfo?.paidToHostess || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch p-6 bg-[#FFFFFF] rounded-2xl flex flex-col justify-start items-start gap-6">
              <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Rating and Feedback
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch pb-4 flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-start gap-3">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                        Organizer's Feedback
                      </div>
                      <div className="inline-flex justify-start items-start gap-1.5">
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`ri-star-fill w-4 h-4 ${
                              review && index < review.rating
                                ? "text-orange-500"
                                : "text-gray-300"
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    {review?.comment || "No feedback provided."}
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                    Leave Your Feedback
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                        Rating
                      </div>
                      <div className="self-stretch inline-flex justify-start items-center gap-2">
                        {[...Array(5)].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleRatingChange(index + 1)}
                            className={`w-6 h-6 ${
                              rating > index
                                ? "text-orange-500"
                                : "text-[#ECECEC]"
                            }`}
                          >
                            <i className="ri-star-fill w-5 h-5"></i>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                          Your Feedback
                        </div>
                        <div className="justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                          Max 250 ch
                        </div>
                      </div>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        maxLength="250"
                        className="self-stretch h-28 rounded-lg border border-[#ECECEC] p-3 text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight outline-none resize-none"
                        placeholder="Write your feedback here..."
                      ></textarea>
                    </div>
                    <div className="self-stretch flex flex-col justify-center items-end gap-2.5">
                      <button
                        onClick={handleFeedbackSubmit}
                        className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden"
                      >
                        <span className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                          Submit Your Feedback
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-[400px] p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-start gap-3">
            <div className="self-stretch justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
              Event Organizer
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-2">
              <img
                className="w-12 h-12 rounded-full"
                src={booking.organizer?.image || "https://placehold.co/48x48"}
                alt="Organizer avatar"
              />
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    {booking.organizer?.name || "Unknown Organizer"}
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <i className="ri-map-pin-2-line text-[#656565] w-4 h-4"></i>
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      {booking.organizer?.location || "Location not specified"}
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <i className="ri-star-fill text-orange-500 w-4 h-4"></i>
                      <div className="justify-start text-orange-500 text-sm font-medium font-['Inter'] leading-tight">
                        {booking.organizer?.rating || "N/A"}
                      </div>
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                      {booking.organizer?.reviews
                        ? `(${booking.organizer.reviews} Reviews)`
                        : "(No Reviews)"}
                    </div>
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

export default PastBookingDetail;
