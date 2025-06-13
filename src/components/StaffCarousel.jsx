import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import "../asset/css/Staff.css";
import BASE_URLS from "../config";

const StaffSlider = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URLS.API}/staff`)
      .then((res) => res.json())
      .then((data) => setStaff(data.data))
      .catch((err) => console.error(err));
  }, []);


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
          Most Loved<span>Event Staff</span>
        </h1>
        <p className="all-para">
          Check out some of the most popular hostesses in your area...
        </p>
      </div>
      <div className="right-boost">
        <div className="slider-container">
          {staff.length > 0 ? (
            <Slider {...settings}>
              {staff
                .filter((person) => person.user.isBoosted === true)
                .map((person) => (
                  <div className="staff-card" key={person._id}>
                    <div
                      className="staff-info"
                      style={{
                        backgroundImage: `url(${BASE_URLS.STATIC}${person.user.profileImage})`,
                      }}
                    >
                      <h3>{person.user.name.toUpperCase()}</h3>

                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} color="red" />
                        ))}
                      </div>
                      <div className="icons">
                        {person.skills.map((skill, index) => {
                          return (
                            <span key={index}>
                              <i className={skill.icon}></i>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
            </Slider>
          ) : (
            <p>Loading popular staff...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffSlider;
