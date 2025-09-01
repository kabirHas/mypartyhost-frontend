import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddReviewSidebar from "../components/AddReviewSidebar";
import BASE_URLS from "../config";
import axios from "axios";
import Notify from "../utils/notify";

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URLS.BACK}/api/review`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched reviews:", data.reviews);
      setReviews(data.reviews);
    } catch (err) {
      Notify.error("Error fetching reviews:", err);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const filteredReviews = (reviews || []).filter((review) => {
    const term = searchTerm.toLowerCase();

    const reviewer = review.reviewer?.name?.toLowerCase() || "";
    const event = review.event?.jobTitle?.toLowerCase() || "";
    const reviewTo = review.reviewee?.name?.toLowerCase() || "";

    return (
      reviewer.includes(term) || event.includes(term) || reviewTo.includes(term)
    );
  });

  const handleDelete = async (reviewerId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URLS.API}/review/${reviewerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPages();
      Notify.success("Review deleted successfully!");
    } catch (error) {
      Notify.error("Failed to delete review. Please try again.");
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review); // store review to edit
    setShowSidebar(true);
  };

  const handlePublish = async (review) => {
    const reviewData = {
      isPublished: review.isPublished ? "false" : "true",
    };
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${BASE_URLS.API}/review/${review._id}`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      fetchPages();
      Notify.success("Review updated successfully!");
    } catch (error) {
      Notify.error("Failed to submit review");
    }
  };

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
            <select className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none">
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
            <select className="pl-3 pr-[25px] py-2  bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none">
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
            <select className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none">
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
                  <img
                    className="w-6 h-6 rounded-full"
                    src={
                      review.reviewer?.profileImage ||
                      "/images/464760996_1254146839119862_3605321457742435801_n.jpg"
                    }
                  />
                  <div className="justify-start text-Token-Text-Primary text-base font-bold font-['Inter'] leading-snug">
                    {review.reviewer?.name || ""}
                  </div>
                  <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">
                    ({review.reviewer?.role || ""})
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="justify-start text-Token-Text-Secondary text-sm font-normal font-['Inter'] leading-tight">
                    Event:
                  </div>
                  <div className="w-52 justify-start text-Token-Text-button text-sm font-normal font-['Inter'] leading-tight text-[#E61E4D]">
                    {review.event?.jobTitle || ""}
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="justify-start text-Token-Text-Secondary text-sm font-normal font-['Inter'] leading-tight">
                    Review To:
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <img
                      className="w-5 h-5 rounded-full"
                      src={
                        review.reviewee?.profileImage ||
                        "/images/464760996_1254146839119862_3605321457742435801_n.jpg"
                      }
                    />
                    <div className="justify-start text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight">
                      {review.reviewee?.name || ""}
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
                      {[...Array(review.rating)].map((_, i) => (
                        <i key={i} className="ri-star-fill" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="justify-start text-Token-Text-Primary text-sm font-bold font-['Inter'] leading-tight">
                    Feedback
                  </div>
                  <div className="self-stretch justify-start text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">
                    {review.comment}
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="justify-start text-Token-Text-Tertiary text-xs font-normal font-['Inter'] leading-none">
                    Submitted:
                  </div>
                  <div className="w-52 justify-start text-Token-Text-Tertiary text-xs font-normal font-['Inter'] leading-none">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="justify-start text-Token-Text-Tertiary text-xs font-normal font-['Inter'] leading-none">
                    Status:
                  </div>
                  <div className="w-52 justify-start text-green-600 text-xs font-normal font-['Inter'] leading-none">
                    {review.isPublished ? "Published" : "Unpublished"}
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
                onClick={() => handleEdit(review)}
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
                onClick={() => handleDelete(review._id)}
              >
                Delete Review
              </button>

              <button
                className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 text-white text-sm font-medium font-['Inter'] leading-tight overflow-hidden"
                onClick={() => handlePublish(review)}
              >
                {review.isPublished ? "Unpublish Review" : "Publish Review"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {showSidebar && (
        <AddReviewSidebar
          onClose={() => {
            setShowSidebar(false);
            fetchPages();
            setSelectedReview(null);
          }}
          reviewDatas={selectedReview}
        />
      )}
    </div>
  );
};

export default ReviewsManagement;






