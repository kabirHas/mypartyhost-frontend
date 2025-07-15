import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddReviewSidebar from "../components/AddReviewSidebar";

const sampleReviews = new Array(4).fill({
  reviewer: "Sarah Jones",
  reviewerRole: "Organizer",
  event: "Corporate Launch Party",
  reviewTo: "Samantha Lee",
  rating: 5,
  feedback:
    "Samantha was exceptional—she truly elevated our event with her energy and professionalism. Highly recommended!",
  submitted: "April 15, 2025, 10:15 AM",
  status: "Published",
  img: "/images/emilli.png",
});

const ReviewsManagement = () => {
  const [reviews] = useState(sampleReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  const filteredReviews = reviews.filter((review) => {
    const term = searchTerm.toLowerCase();
    return (
      review.reviewer.toLowerCase().includes(term) ||
      review.event.toLowerCase().includes(term) ||
      review.reviewTo.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="kaab-support-header">
        <div>
          <h1 className="kaab-payment-heading">Reviews Management</h1>
          <p className="kaab-payment-subtext">
            Manage published reviews, take action when necessary
          </p>
        </div>
        <button
        onClick={() => setShowSidebar(true)}
          className="px-6 py-3 rounded-lg inline-flex justify-center items-center gap-2 text-white text-base font-medium font-['Inter'] leading-snug overflow-hidden"
          style={{
            background:
              "linear-gradient(272deg, #E31F87 1.58%, #E61E4D 98.73%)",
          }}
        >
          Create New Review
        </button>
      </div>

      {/* Search & Filters */}
      <div className="kaab-search-filter-bar">
        <div className="search-box-c d-flex">
          <img src="/images/search-icon.png" alt="icon" />
          <input
            type="text"
            className="kaab-search-input"
            placeholder="Search events by name, organizer, or event ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>


        <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="relative inline-flex items-center">
              <select
                className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
              >
                <option value="organiser">Organiser</option>
                <option value="staff">Staff</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <div className="absolute right-2 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i class="ri-arrow-down-s-line"></i>
                </div>
              </div>
            </div>
            <div className="relative inline-flex items-center">
              <select
                className="pl-3 pr-[25px] py-2  bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
              >
                <option value="">5 stars</option>
                <option value="1 hr">1 Hour</option>
                <option value="24 hrs">24 Hours</option>
              </select>
              <div className="absolute right-1 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i className="ri-arrow-down-s-line text-Token-Text-Secondary text-lg" />
                </div>
              </div>
            </div>
            <div className="relative inline-flex items-center">
              <select
                className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
              >
                <option value="">Published</option>
                <option value="Active">Active</option>
                <option value="Inactive">In Active</option>
              </select>
              <div className="absolute right-2 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i className="ri-arrow-down-s-line text-Token-Text-Secondary text-lg" />
                </div>
              </div>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredReviews.map((review, idx) => (
          <div
            className="w-[100%] max-w-[100%] min-w-80 p-4 bg-Token-BG-Neutral-Light-1 rounded-2xl inline-flex flex-col justify-start items-end gap-4"
            style={{ background: "white" }}
          >
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="w-64 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <img className="w-6 h-6 rounded-full" src={review.img} />
                  <div className="justify-start text-Token-Text-Primary text-base font-bold font-['Inter'] leading-snug">
                    {review.reviewer}
                  </div>
                  <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                    ({review.reviewerRole})
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="justify-start text-Token-Text-Secondary text-sm font-normal font-['Inter'] leading-tight">
                    Event:
                  </div>
                  <div className="w-52 justify-start text-Token-Text-button text-sm font-normal font-['Inter'] leading-tight text-[#E61E4D]">
                    {review.event}
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="justify-start text-Token-Text-Secondary text-sm font-normal font-['Inter'] leading-tight">
                    Review To:
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <img className="w-5 h-5 rounded-full" src={review.img} />
                    <div className="justify-start text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight">
                      {review.reviewTo}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="self-stretch h-0 outline outline-1"
                style={{ outlineColor: "#ECECEC", outlineOffset: "-0.5px" }}
              ></div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="justify-start text-Token-Text-Primary text-sm font-bold font-['Inter'] leading-tight">
                    Rating
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div
                      className="text-base font-bold font-['Inter'] leading-snug"
                      style={{ color: "#E61E4D" }}
                    >
                      {review.rating}/5
                    </div>
                    <div className="flex justify-start items-center text-[#E61E4D]">
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                      <i className="ri-star-fill"></i>
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="justify-start text-Token-Text-Primary text-sm font-bold font-['Inter'] leading-tight">
                    Feedback
                  </div>
                  <div className="self-stretch justify-start text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
                    {review.feedback}
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="justify-start text-Token-Text-Tertiary text-xs font-normal font-['Inter'] leading-none">
                    Submitted:
                  </div>
                  <div className="w-52 justify-start text-Token-Text-Tertiary text-xs font-normal font-['Inter'] leading-none">
                    {review.submitted}
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="justify-start text-Token-Text-Tertiary text-xs font-normal font-['Inter'] leading-none">
                    Status:
                  </div>
                  <div className="w-52 justify-start text-green-600 text-xs font-normal font-['Inter'] leading-none">
                    {review.status}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="self-stretch h-0 outline outline-1"
              style={{ outlineColor: "#ECECEC", outlineOffset: "-0.5px" }}
            ></div>

            <div className="inline-flex justify-start items-center gap-4">
              <Link
                to="#"
                className="rounded-lg flex justify-center items-center text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug overflow-hidden no-underline"
              >
                Edit Review
              </Link>

              <button
                className="px-4 py-2 rounded-lg outline outline-1 flex justify-center items-center gap-2 text-sm font-medium font-['Inter'] leading-tight overflow-hidden"
                style={{
                  outlineColor: "#E61E4D",
                  outlineOffset: "-1px",
                  color: "#E61E4D",
                }}
              >
                Delete Review
              </button>

              <button className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 text-white text-sm font-medium font-['Inter'] leading-tight overflow-hidden">
                Unpublish Review
              </button>
            </div>
          </div>
        ))}
      </div>
      {showSidebar && (
          <AddReviewSidebar onClose={() => setShowSidebar(false)} />
      )}
    </div>
  );
};

export default ReviewsManagement;
