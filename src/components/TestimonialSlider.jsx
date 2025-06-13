import React from "react";
import Slider from "react-slick";
import "../asset/css/TestimonialSlider.css";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    title: "GAME CHANGER!",
    text: `Purchased for my son to add another level to his fight game and recover. Top rate service from sales to install with very quick install date from purchase, with easy hands on training from the team. Solid quality chamber which is now a part of our daily routine for my son. Highly recommend.`,
    rating: 5,
    author: "Dan",
    subtitle: "Home Install",
  },
  {
    title: "GAME CHANGER!",
    text: `Purchased for my son to add another level to his fight game and recover. Top rate service from sales to install with very quick install date from purchase, with easy hands on training from the team. Solid quality chamber which is now a part of our daily routine for my son. Highly recommend.`,
    rating: 5,
    author: "Dan",
    subtitle: "Home Install",
  },
  {
    title: "GAME CHANGER!",
    text: `Purchased for my son to add another level to his fight game and recover. Top rate service from sales to install with very quick install date from purchase, with easy hands on training from the team. Solid quality chamber which is now a part of our daily routine for my son. Highly recommend.`,
    rating: 5,
    author: "Dan",
    subtitle: "Home Install",
  },
  {
    title: "GAME CHANGER!",
    text: `Purchased for my son to add another level to his fight game and recover. Top rate service from sales to install with very quick install date from purchase, with easy hands on training from the team. Solid quality chamber which is now a part of our daily routine for my son. Highly recommend.`,
    rating: 5,
    author: "Dan",
    subtitle: "Home Install",
  },
];

const TestimonialSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="boost-staff-inner d-flex">
      <div className="left-boost">
        <h1 className="all-heads">
          Everybody is Talking <span>About My Event!</span>
        </h1>
        <div className="stars">
          <FaStar color="red" />
          <FaStar color="red" />
          <FaStar color="red" />
          <FaStar color="red" />
          <FaStar color="red" />
        </div>
      </div>
      <div className="right-boost">
        <div className="slider-container">
          <Slider {...settings}>
            {testimonials.map((item, index) => (
              <div key={index} className="testimonial-card">
                <div className="card">
                  <h3>{item.title}</h3>
                  <p>"{item.text}"</p>
                  <div>
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                  </div>
                  <p>
                    <strong>{item.author}</strong> - {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
