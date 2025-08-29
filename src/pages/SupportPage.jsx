import React, { useEffect, useState } from "react";
import "../asset/css/SupportPage.css";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import BASE_URLS from "../config";

const faqData = [
  {
    question: "How do I enable Instant Book?",
    answer:
      "Go to My Profile → Instant Book Rates, toggle on, set your rate, and click Save.",
    linkText: "Instant Book",
    tags: ["Booking", "Profile"],
    category: "Booking",
  },
  {
    question: "Can I hide my profile from the directory?",
    answer: "Yes, go to your settings and toggle visibility.",
    category: "Profile",
  },
  {
    question: "When do I get paid?",
    answer: "Payouts are processed every Friday.",
    category: "Payments",
  },
  {
    question: "How do I reset my password?",
    answer: "Use the 'Forgot Password' link on the login page.",
    category: "Privacy",
  },
  {
    question: "What’s the cancellation policy?",
    answer: "You can cancel up to 24 hours in advance.",
    category: "Policies",
  },
  {
    question: "How do I enable Instant Book?",
    answer: "Navigate to Settings > Booking > Instant Book.",
    category: "Booking",
  },
  {
    question: "Can I change my email?",
    answer: "Yes, from Profile > Email Settings.",
    category: "Profile",
  },
];

const tabs = [
  "All",
  "Booking",
  "Profile",
  "Privacy",
  "Payments",
  "Technical",
  "Policies",
];

export default function SupportPage() {
  const { user } = ChatState();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [openIndex1, setOpenIndex1] = useState(null);
  const [openIndex2, setOpenIndex2] = useState(null);
  const [tickets, setTickets] = useState(null);

  const fetchTickets = async ()=>{
    if(user.role === "superadmin"){
      const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}admin/help-and-support`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const formattedTickets = response.data.helpAndSupport.filter(ticket => ticket.status === "in-progress").map((ticket) => {
        const date = ticket.createdAt ? (new Date(ticket.createdAt), "MMM dd, yyyy") : "NA";
        return {
          id: ticket._id,
          subject: ticket.subject,
          date,
          status: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1),
        };
      });
      console.log(formattedTickets)
      setTickets(formattedTickets);
    }else{
      const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}contact/user`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const formattedTickets = response.data.filter(ticket => ticket.status === "in-progress").map((ticket) => {
        const date = ticket.createdAt ? (new Date(ticket.createdAt), "MMM dd, yyyy") : "NA";
        return {
          id: ticket._id,
          subject: ticket.subject,
          date,
          status: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1),
        };
      });
      console.log(formattedTickets)
      setTickets(formattedTickets);
    }
  }

  useEffect(()=>{
    fetchTickets()
  },[])

  const filteredFaqs =
    activeTab === "All"
      ? faqData
      : faqData.filter((item) => item.category === activeTab);

  const midpoint = Math.ceil(filteredFaqs.length / 2);
  const filteredFaqs1 = filteredFaqs.slice(0, midpoint);
  const filteredFaqs2 = filteredFaqs.slice(midpoint);

  const toggleAccordion1 = (index) => {
    setOpenIndex1(openIndex1 === index ? null : index);
  };

  const toggleAccordion2 = (index) => {
    setOpenIndex2(openIndex2 === index ? null : index);
  };

  return (
    <div className="kaab-support-container">
      <div className="kaab-support-header">
        <div>
          <h1 className="kaab-payment-heading">Help & Support</h1>
          <p className="kaab-payment-subtext">
            View the status of any tickets you’ve submitted
          </p>
        </div>
        <button
          className="kaab-view-tickets-btn"
          onClick={() => navigate("/dashboard/support/ticket")}
        >
          {user.role === "superadmin" ? "View All Tickets" : "View Your Tickets"}
        </button>
      </div>

      <div className="search-box-c d-flex">
        <img src="/images/search-icon.png" alt="icon" />
        <input
          type="text"
          className="kaab-search-input"
          placeholder="Search by name, email, or user ID..."
        />
      </div>

      <div className="kaab-support-tags">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`kaab-tag-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              setOpenIndex1(null);
              setOpenIndex2(null);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <h3 className="kaab-common-title">Common Questions</h3>

      <div className="kaab-accordion-sections">
        {/* Accordion Section 1 */}
        <div className="kaab-accordion-wrapper">
          {filteredFaqs1.map((item, index) => (
            <div
              key={index}
              className={`kaab-accordion-item ${
                openIndex1 === index ? "open" : ""
              }`}
              onClick={() => toggleAccordion1(index)}
            >
              <div className="kaab-accordion-question">{item.question}</div>
              {openIndex1 === index && (
                <div className="kaab-accordion-answer">
                  <p>
                    {item.answer}{" "}
                    {item.linkText && (
                      <span className="kaab-instant-link">{item.linkText}</span>
                    )}
                  </p>
                  {item.tags && (
                    <div className="kaab-tags">
                      {item.tags.map((tag, i) => (
                        <span key={i}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Accordion Section 2 */}
        <div className="kaab-accordion-wrapper">
          {filteredFaqs2.map((item, index) => (
            <div
              key={index}
              className={`kaab-accordion-item ${
                openIndex2 === index ? "open" : ""
              }`}
              onClick={() => toggleAccordion2(index)}
            >
              <div className="kaab-accordion-question">{item.question}</div>
              {openIndex2 === index && (
                <div className="kaab-accordion-answer">
                  <p>
                    {item.answer}{" "}
                    {item.linkText && (
                      <span className="kaab-instant-link">{item.linkText}</span>
                    )}
                  </p>
                  {item.tags && (
                    <div className="kaab-tags">
                      {item.tags.map((tag, i) => (
                        <span key={i}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button className="kaab-view-tickets-btn et">Learn More</button>

      <div className="kaab-support-bottom">
        <div className="kaab-submit-ticket">
          <h4>Still Need Help? Submit a Ticket</h4>
          <p>
            Our support team is here for you—reach out anytime for personalized
            assistance.
          </p>
          <button className="kaab-contact-btn">Contact Support</button>
        </div>

        <div className="kaab-quick-updates">
          <h5>Quick Updates</h5>
          <p>You have {tickets &&tickets.length} active tickets with new updates.</p>
          <button
            onClick={() => navigate("/dashboard/support/ticket")}
            className="kaab-view-tickets-btn"
          >
            {user.role === "superadmin" ? 'View All Tickets' : 'View Your Tickets'}
          </button>
        </div>
      </div>
    </div>
  );
}
