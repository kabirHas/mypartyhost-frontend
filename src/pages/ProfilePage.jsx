import React, { useEffect, useState } from "react";
import axios from "axios";
import "../asset/css/ProfilePage.css";
import BASE_URLS from "../config";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URLS.API}/auth/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => console.error("Error fetching staff data:", err));
  }, []);

  if (!profile) return <div className="kaab-pro">Loading profile...</div>;


  return (
    <div className="kaab-pro profile-container">
      <button className="kaab-pro back-btn">← Back</button>
      <div className="kaab-pro profile-main">
        {/* Left */}
        <div className="kaab-pro left-section">
          <img
            src={profile.profileImage}
            alt={profile.name}
            className="kaab-pro main-image"
          />

          {profile.photos.length > 1 && (
            <div className="kaab-pro thumbnail-row">
              {profile.photos.map((img, idx) => (
                <img key={idx} src={img} alt="" className="kaab-pro" />
              ))}
            </div>
          )}

          <button className="kaab-pro add-photo">Add Photo</button>
          <button className="kaab-pro add-voice-note">Add Voice Note</button>

          {profile.reviews && profile.reviews.length > 0 && (
            <div className="kaab-pro reviews">
              <h3 className="kaab-pro">
                Reviews ⭐ {profile.rating || "5.0"} ({profile.reviews.length} Reviews)
              </h3>
              {profile.reviews.slice(0, 3).map((review, i) => (
                <div key={i} className="kaab-pro review-card">
                  <strong className="kaab-pro">{review.name}</strong>
                  <p className="kaab-pro">{review.comment}</p>
                </div>
              ))}
              <button className="kaab-pro view-more">View More</button>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="kaab-pro right-section">
          <h1 className="kaab-pro">{profile.name}</h1>
          <p className="kaab-pro location">📍 {profile.location}</p>
          <p className="kaab-pro about-me">{profile.about}</p>

          {/* <div className="kaab-pro skills">
            {profile.skills?.map((skill, i) => (
              <span key={i} className="kaab-pro">
                {skill}
              </span>
            ))}
          </div> */}

          <div className="kaab-pro rates">
            <h4 className="kaab-pro">💲 Rates</h4>
            <p className="kaab-pro">Base Hourly Rate: ${profile.hourlyRate}</p>
            <p className="kaab-pro">Daily Rate: ${profile.dailyRate}</p>
          </div>

          <div className="kaab-pro availability">
            <h4 className="kaab-pro">📅 Available Dates</h4>
            <p className="kaab-pro">{profile.availability}</p>
            <a href="#" className="kaab-pro">
              15 open dates
            </a>
          </div>

          <div className="kaab-pro available-for">
            <h4 className="kaab-pro">✅ Available for</h4>
            {profile.availableFor?.map((item, i) => (
              <span key={i} className="kaab-pro">
                {item}
              </span>
            ))}
          </div>

          <div className="kaab-pro instant-book">
            <h4 className="kaab-pro">⚙️ Settings</h4>
            <p className="kaab-pro">
              Instant Book: {profile.instantBook ? "ON" : "OFF"}
            </p>
            <p className="kaab-pro">Base Hourly Rate: ${profile.hourlyRate}</p>
          </div>

          <div className="kaab-pro job-history">
            <h4 className="kaab-pro">📊 Job History</h4>
            <p className="kaab-pro">Events Completed: {profile.completed}</p>
            <p className="kaab-pro">Cancels: {profile.cancels}</p>
            <p className="kaab-pro">No Shows: {profile.noShows}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
