import React from "react";
import "../asset/css/ReviewSection.css";

const reviews = [
  {
    name: "Emily Carter",
    avatar:
      "https://res.cloudinary.com/dympqasl5/image/upload/v1749816990/mypartyhost/ca53nxqu12jbwzl4lka2.png",
    rating: 5,
    text: "Sarah was fantastic to work with! She was incredibly organized, and the entire event ran smoothly. She made sure I had everything I needed and was always available for any questions. One of the best event organizers I’ve worked with!",
  },
  {
    name: "Sophie Adams",
    avatar:
      "https://res.cloudinary.com/dympqasl5/image/upload/v1749816990/mypartyhost/ca53nxqu12jbwzl4lka2.png",
    rating: 5,
    text: "Great experience overall! Sarah communicated all details clearly and made sure everything was well-prepared. The event was a success, and I’d definitely work with her again!",
  },
  {
    name: "Emily Carter",
    avatar:
      "https://res.cloudinary.com/dympqasl5/image/upload/v1749816990/mypartyhost/ca53nxqu12jbwzl4lka2.png",
    rating: 5,
    text: "Sarah was fantastic to work with! She was incredibly organized, and the entire event ran smoothly. She made sure I had everything I needed and was always available for any questions. One of the best event organizers I’ve worked with!",
  },
];

const ReviewSection = () => {
  return (
    <div className="review-container">
      <div className="review-header">
        <strong>Reviews</strong>
        <span className="rating">
          <i className="ri-star-fill"></i> 4.9/5
        </span>
        <a href="#!" className="review-count">
          (120 Reviews)
        </a>
      </div>

      <div className="review-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-profile">
              <img src={review.avatar} alt={review.name} />
              <div>
                <strong>{review.name}</strong>
                <div className="stars">
                  {Array(review.rating)
                    .fill()
                    .map((_, i) => (
                      <i className="ri-star-fill" key={i}></i>
                    ))}
                </div>
              </div>
            </div>
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>

      <div className="view-more">
        <a href="#!" className="view-more-link">
          View More
        </a>
      </div>
    </div>
  );
};

export default ReviewSection;
