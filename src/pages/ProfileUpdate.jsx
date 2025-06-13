import React, { useEffect, useState } from "react";
import axios from "axios";
import Base_URLS from "../config";
import "../asset/css/ProfileUpdate.css";
import Notify from "../utils/notify";
import Switch from "@mui/material/Switch";

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    country: "",
    city: "",
    state: "",
    postCode: "",
    suburb: "",
    bio: "",
    baseRate: "",
    dailyRate: "",
    instantBookingRate: "",
    isPublic: false,
    instantBook: false,
    skills: [],
    additionalRates: [],
    availableDates: [],
    profileImage: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  const fetchProfile = () => {
    axios
      .get(`${Base_URLS.API}/auth/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;

        const user = data;
        console.log("user:", user);
        setFormData({
          name: user.name || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "",
          address: user.address || "",
          country: user.country || "",
          city: user.city || "",
          state: user.state || "",
          postCode: user.postCode || "",
          suburb: user.suburb || "",
          bio: user.bio || "",
          baseRate: data.baseRate || "",
          dailyRate: data.dailyRate || "",
          instantBookingRate: data.instantBookingRate || "",
          isPublic: data.isPublic || false,
          instantBook: data.instantBook || false,
          skills: data.skills || [],
          additionalRates: data.additionalRates || [],
          availableDates: data.availableDates?.map((d) => d.slice(0, 10)) || [],
          profileImage: user.profileImage || "",
          getSMS: user.getSMS || false,
          jobNotifications: user.jobNotifications || false,
          chatNotifications: user.chatNotifications || false,
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load profile");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile(); // on component mount
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleImageDelete = async () => {
    try {
      const imageUrl =
        "/images/464760996_1254146839119862_3605321457742435801_n.jpg"; // correct path, no double slashes
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }

      const blob = await response.blob();
      const file = new File(
        [blob],
        "464760996_1254146839119862_3605321457742435801_n.jpg", // filename without leading slash
        { type: blob.type }
      );

      setNewImage(file); // simulate manual upload
      setFormData((prev) => ({
        ...prev,
        profileImage: "", // optional: clears any existing image name
      }));
    } catch (error) {
      console.error("Error loading default image:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (
        typeof value !== "object" ||
        value === null ||
        value instanceof File
      ) {
        submitData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((val, index) => {
          submitData.append(`${key}[${index}]`, JSON.stringify(val));
        });
      }
    });

    if (newImage) {
      submitData.append("profileImage", newImage);
    }

    axios
      .patch(`${Base_URLS.API}/auth/profile`, submitData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((data) => {
        Notify.success(data.data.message);
        fetchProfile();
      })
      .catch((err) => {
        console.error("Update failed", err);
        alert("Failed to update profile");
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-update-container">
      <div className="left-panel">
        <div className="profile-img-box">
          {formData.profileImage ? (
            <img
              src={
                newImage
                  ? URL.createObjectURL(newImage) // show selected image immediately
                  : `${Base_URLS.STATIC}${formData.profileImage}`
              }
              alt="Profile"
            />
          ) : (
            <img
              src={`/images/464760996_1254146839119862_3605321457742435801_n.jpg`}
              alt="Profile"
            />
          )}
          <div className="img-actions">
            {formData.profileImage && (
              <button type="button" onClick={handleImageDelete}>
                <i class="fa-solid fa-trash" style={{ color: "red" }}></i>
              </button>
            )}
            <div className="file-icons">
              <label htmlFor="fileInput" className="custom-file-upload">
                <i class="fa-solid fa-camera"></i>
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
        <h2>
          {formData.firstName} {formData.lastName}
        </h2>
        <p className="location">
          {formData.suburb}, {formData.state}, {formData.country}
        </p>
        <p>
          <b>📍 Events Organized:</b> 50
        </p>

        <div className="bio-section">
          <label>Short Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
        </div>
      </div>

      <div className="right-panel">
        <form className="profile-form" onSubmit={handleFormSubmit}>
          <div className="wrap-form-header">
            <div>
              <h2>Profile Info</h2>
              <p>Contact Details will not be shown to Event Staff</p>
            </div>
            <button className="save-btn" type="submit">
              Save Changes ✓
            </button>
          </div>
          <hr />
          <div className="form-grid">
            <label for="First Name">First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            <label>Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <label>Country</label>
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
            />
            <label>Suburb</label>
            <input
              name="suburb"
              value={formData.suburb}
              onChange={handleChange}
              placeholder="Suburb"
            />
            <label>State</label>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
            <label>Post Code</label>
            <input
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              placeholder="Post Code"
            />
            <label>Mobile Number</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Mobile Number"
            />
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <label>Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>
<hr />
          <div className="toggles">
            <h3>Setting</h3>
            <h6>Notification Setting</h6>
            <div>
              <label>SMS</label>
              <Switch
                name="getSMS"
                checked={formData.getSMS}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]:
                      e.target.type === "checkbox"
                        ? e.target.checked
                        : e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label>JOB</label>
              <Switch
                name="jobNotifications"
                checked={formData.jobNotifications}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]:
                      e.target.type === "checkbox"
                        ? e.target.checked
                        : e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label>Chat Message</label>
              <Switch
                name="chatNotifications"
                checked={formData.chatNotifications}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]:
                      e.target.type === "checkbox"
                        ? e.target.checked
                        : e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="change-password">
            <a href="/change-password">Change Password</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;
