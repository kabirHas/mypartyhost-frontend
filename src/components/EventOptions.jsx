import React from 'react';
import "../asset/css/EventOptions.css";


const EventOptions = () => {
  return (
    <div className="event-options">
      <div className="event-column left">
        <h2><strong>CREATE<br />EVENT </strong></h2>
        <p>List your event details</p>
        <hr></hr>
        <p>Hostesses apply – browse and compare</p>
        <hr></hr>
        <p>Pick your perfect match & confirm!</p>
        <button className="btns pink">Create an Event</button>
      </div>

      <div className="event-image">
        <img src="/images/Screenshot 2025-06-02 173328.jpg" alt="Center" />
      </div>

      <div className="event-column right">
        <h2><strong>INSTANT<br />BOOK</strong></h2>
        <p>Browse available hostesses</p>
        <hr />
        <p>Click, confirm, and you’re set!</p>
       <hr />
        <p>No waiting, just instant fun</p>
        <button className="btns pink">Instant Book</button>
      </div>
    </div>
  );
};

export default EventOptions;
