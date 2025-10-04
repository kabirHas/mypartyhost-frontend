import React from "react";
import "../asset/css/EventOptions.css";
import { useNavigate } from "react-router-dom";

const EventOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="event-options">
      <div className="event-column left">
        <div className="event-text">
          <h2>
            <strong>
              CREATE
              <br />
              EVENT{" "}
            </strong>
          </h2>
          <p>List your event details</p>
          <hr></hr>
          <p>Hostesses apply – browse and compare</p>
          <hr></hr>
          <p>Pick your perfect match & confirm!</p>
          <button
            className="btns pink"
            onClick={() => {
              navigate("/multi-step");
              window.scrollTo(0, 0);
            }}
          >
            Create an Event
          </button>
        </div>
        <div className="event-image">
          <img src="/images/Frame 2087325911 (1).png" alt="Center" />
        </div>
      </div>

      <div className="event-column right">
        <div className="event-image">
          <img src="/images/Frame 2087325911.png" alt="Center" />
        </div>
        <div className="event-text">
          <h2>
            <strong>
              INSTANT
              <br />
              BOOK
            </strong>
          </h2>
          <p>Browse available hostesses</p>
          <hr />
          <p>Click, confirm, and you’re set!</p>
          <hr />
          <p>No waiting, just instant fun</p>
          <button
            className="btns pink"
            onClick={() => {
              const section = document.getElementById("Find-Hostess");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Instant Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventOptions;
