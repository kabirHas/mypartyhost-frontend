import React from "react";
import "../asset/css/Genric.css";
import StaffCarousel from "../components/StaffCarousel";
import SearchStaff from "../components/SearchStaff";
import TestimonialSlider from "../components/TestimonialSlider";
import EventOptions from "../components/EventOptions";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Faqs from "../components/Faqs";

const Genric = ({ pages }) => {
  const page = pages;
  return (
    <div className="genric-page-container">
      <div className="header-wrap">
        <Header />
      </div>

      <div className="landing -page-banner">
        <img src={page.featuredImage} alt="featured" />
      </div>

      <div className="partners">
        <h3>{page.featuredHeading}</h3>
        <div className="partners-gallary">
          {page.gallery.map((img, idx) => (
            <img key={idx} src={img} alt="Partners" />
          ))}
        </div>
      </div>

      <div className="boost-staff">
        <StaffCarousel />
      </div>

      <div className="part-section-parent">
        <div className="part-section">
          <h2 className="all-heads">
            {page.partyHeading} <span>{page.subpartyHeading}</span>
          </h2>

          <div className="dyn-con">
            {page.party_data1.map((item) => (
              <div key={item._id} className="part-item">
                <div className="featuring-imgs">
                  <img src={item.image} alt={item.title} width={100} />
                </div>
                <h4>{item.title}</h4>
                <p className="all-para">{item.description}</p>
              </div>
            ))}
            {page.party_data2.map((item) => (
              <div key={item._id} className="part-item">
                <div className="featuring-imgs">
                  <img src={item.image} alt={item.title} width={100} />
                </div>
                <h4>{item.title}</h4>
                <p className="all-para">{item.description}</p>
              </div>
            ))}
            {page.party_data3.map((item) => (
              <div key={item._id} className="part-item">
                <div className="featuring-imgs">
                  <img src={item.image} alt={item.title} width={100} />
                </div>
                <h4>{item.title}</h4>
                <p className="all-para">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="search-staff" id="Find-Hostess">
        <SearchStaff />
      </div>
      <div className="EventOptions" id="How-It-Works">
        <EventOptions />
      </div>

      <div className="TestimonialSlider">
        <TestimonialSlider />
      </div>

      <div className="category-display">
        <div className="category-display-inner">
          <h2 className="filter-head">Categories</h2>
          <ul>
            {page.category.map((cat) => (
              <li key={cat._id}>
                <i className={cat.icon}></i>
                <h4>{cat.name}</h4> <p>{cat.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="faq-wrap" id="FAQs">
        <Faqs selectedPage={page._id} />
      </div>

      <div className="footer-wrap">
        <Footer />
      </div>
    </div>
  );
};

export default Genric;
