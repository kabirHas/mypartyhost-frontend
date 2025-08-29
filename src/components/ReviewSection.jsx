import React, { useEffect, useState } from "react";
import "../asset/css/ReviewSection.css";
 
const ReviewSection = ({reviews}) => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const average = total / reviews.length;
    setAverageRating(average.toFixed(1));
  }, [reviews]);
  return (
    <div className="review-container">
      <div className="review-header">
        <strong>Reviews</strong>
        <span className="rating">
          <i className="ri-star-fill"></i> {averageRating}/5
        </span>
        <a href="#!" className="review-count">
          {reviews.length} Reviews
        </a>
      </div>

      <div className="review-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-profile">
              <img src={review?.reviewer?.profileImage} alt={review?.reviewer?.profileImage} />
              <div>
                <strong className="capitalize">{review?.reviewer?.name}</strong>
                <div className="stars">
                  {Array(review.rating)
                    .fill()
                    .map((_, i) => (
                      <i className="ri-star-fill" key={i}></i>
                    ))}
                </div>
              </div>
            </div>
            <p className="review-text">{review.comment}</p>
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
