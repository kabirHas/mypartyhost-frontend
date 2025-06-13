import React, { useEffect, useState } from "react";
import API from "../api";
import "../asset/css/Faqs.css"; // custom style for accordion

const Faqs = ({ selectedPage }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (!selectedPage) return;

    setLoading(true);
    API.get(`/faq/${selectedPage}`)
      .then((res) => {
        setFaqs(res.data.faqs || []);
      })
      .catch((err) => {
        console.error("Failed to load FAQs:", err);
        setFaqs([]);
      })
      .finally(() => setLoading(false));
  }, [selectedPage]);

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  if (!selectedPage) return <p>Please select a page.</p>;
  if (loading) return <p>Loading FAQs...</p>;

  return (
    <div className="faq-container">
      <div className="faq-content d-flex">
        <div className="accordion">
          <h2 className="all-heads">
            <span>FREQUENTLY </span> ASKED QUESTIONS
          </h2>
          {faqs.map((faq, index) => (
            <div className="accordion-item" key={faq._id}>
              <button
                className={`accordion-header ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={() => toggleAccordion(index)}
              >
                {faq.question}
                <span className="arrow">
                  {activeIndex === index ? <i class="ri-arrow-right-up-line"></i> : <i class="ri-arrow-right-down-line"></i>}
                </span>
              </button>
              {activeIndex === index && (
                <div className="accordion-body">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}

          <button className="btns pink">Get In Touch</button>
        </div>
        <div className="faq-banner">
          <img src="/images/Rectangle 637.png" alt="Center" />
        </div>
      </div>
    </div>
  );
};

export default Faqs;
