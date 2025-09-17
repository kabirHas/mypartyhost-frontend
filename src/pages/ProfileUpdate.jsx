import Select from "react-select";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Base_URLS from "../config";
import "../asset/css/ProfileUpdate.css";
import Notify from "../utils/notify";
import Switch from "@mui/material/Switch";
import ReviewSection from "../components/ReviewSection";
import BASE_URLS from "../config";

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    country: "",
    flag: "",
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

  const [userData, setUserData] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [flagUrl, setFlagUrl] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags")
      .then((res) => res.json())
      .then((data) => {
        const countryList = data
          .map((country) => ({
            label: country.name.common,
            value: country.name.common,
            flag: country.flags?.svg || "",
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(countryList);
      })
      .catch((err) => console.error("Failed to fetch countries", err));
  }, []);

  useEffect(() => {
    if (countries.length && formData.country) {
      const matched = countries.find((c) => c.value === formData.country);
      if (matched) {
        setFlagUrl(matched.flag);
      }
    }
  }, [countries, formData.country]);

  const fetchProfile = () => {
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}auth/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
        setUserData(data);

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
          flag: user.flag || "",
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
        setIsEditing(false);
        Notify.success(data.data.message);
        fetchProfile();
      })
      .catch((err) => {
        console.error("Update failed", err);
        alert("Failed to update profile");
      });
  };

  const handleToggleChange = async (e) => {
    const { name, checked } = e.target;

    // Update local state
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // Send update to server
    try {
      const updatePayload = { [name]: checked };
      const response = await axios.patch(
        `${Base_URLS.API}/auth/profile`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      Notify.success("Settings updated successfully");
      fetchProfile();
    } catch (err) {
      console.error("Failed to update toggle setting", err);
      Notify.error("Failed to update setting");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${Base_URLS.API}/auth/profile`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      Notify.success("Password changed successfully");
      setShowPasswordForm(false);
      setNewPassword("");
    } catch (err) {
      console.error("Password update failed", err);
      Notify.error("Failed to change password");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-update-container">
      <div className="left-panel">
        <div className="profile-data-wrap">
          <div className="profile-img-box">
            {formData.profileImage ? (
              <img
                src={
                  newImage
                    ? URL.createObjectURL(newImage) // show selected image immediately
                    : `${formData.profileImage}`
                }
                alt="Profile"
              />
            ) : (
              <img
                src={`/images/464760996_1254146839119862_3605321457742435801_n.jpg`}
                alt="Profile"
              />
            )}
            {isEditing && (
              <div className="img-actions">
                <button type="button" onClick={handleImageDelete}>
                  <i className="fa-solid fa-trash" style={{ color: "red" }}></i>
                </button>
                <div className="file-icons">
                  <label htmlFor="fileInput" className="custom-file-upload">
                    <i className="fa-solid fa-camera"></i>
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
            )}
          </div>
          <div className="head-profile-data">
            <h2>
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="location">
              <i class="ri-map-pin-line"></i> {formData.suburb},{" "}
              {formData.state}, {formData.country}
            </p>
          </div>

          <p className="events-org">
            <img src="/images/Confetti8.png" /> Events Organized: 50
          </p>
          <hr />
          <div className="bio-section">
            <div className="wrap-form-header">
              <h6>Short Bio</h6>
              {!isEditing ? (
                <div className="edit-btn" onClick={() => setIsEditing(true)}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
              ) : (
                <button
                  type="submit"
                  className="save-btn"
                  onClick={(e) => handleFormSubmit(e)}
                >
                  Save Changes <i className="fa-solid fa-check"></i>
                </button>
              )}
            </div>

            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            ) : (
              <p>{formData.bio || "No bio provided."}</p>
            )}
          </div>
        </div>
        <ReviewSection reviews={userData?.reviews}/>
      </div>

      <div className="right-panel">
        <div className="profile-form-panel">
          <form className="profile-form" onSubmit={handleFormSubmit}>
            <div className="wrap-form-header">
              <div>
                <h2>Profile Info</h2>
                <p>Contact Details will not be shown to Event Staff</p>
              </div>
              {!isEditing ? (
                <div className="edit-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile <i className="fa-solid fa-pen-to-square"></i>
                </div>
              ) : (
                <button type="submit" className="save-btn">
                  Save Changes <i className="fa-solid fa-check"></i>
                </button>
              )}
            </div>
            <hr />
            <div className="form-grid">
              {[
                "firstName",
                "lastName",
                "country",
                // "flag",
                "suburb",
                "state",
                "postCode",
                "phone",
                "email",
                "address",
              ].map((field) => (
                <React.Fragment key={field}>
                  <label>
                    {field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  {isEditing ? (
                    field === "country" ? (
                      <div>
                        <Select
                          options={countries}
                          value={countries.find(
                            (option) => option.value === formData.country
                          )}
                          onChange={(selected) => {
                            setFormData((prev) => ({
                              ...prev,
                              country: selected ? selected.value : "",
                              flag: selected ? selected.flag : "",
                            }));
                            setFlagUrl(selected ? selected.flag : "");
                          }}
                          placeholder="Select Country"
                          isClearable
                        />
                      </div>
                    ) : field === "flag" ? (
                      <input
                        name={field}
                        value={formData.flag}
                        onChange={handleChange}
                        type="hidden"
                      />
                    ) : (
                      <input
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={field
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      />
                    )
                  ) : (
                    <p>{formData[field]}</p>
                  )}
                </React.Fragment>
              ))}
            </div>
            <hr className="hr-2" />
            <div className="toggles">
              <h3>Setting</h3>
              <h6>Notification Setting</h6>
              <div>
                <label>SMS</label>
                <Switch
                  name="getSMS"
                  checked={formData.getSMS}
                  onChange={handleToggleChange}
                />
              </div>
              <div>
                <label>JOB</label>
                <Switch
                  name="jobNotifications"
                  checked={formData.jobNotifications}
                  onChange={handleToggleChange}
                />
              </div>

              <div>
                <label>Chat Message</label>
                <Switch
                  name="chatNotifications"
                  checked={formData.chatNotifications}
                  onChange={handleToggleChange}
                />
              </div>
            </div>
          </form>
          <div className="change-password">
            <button
              type="button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="toggle-password-btn"
            >
              Change Password
            </button>

            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="password-form">
                {/* <label>New Password</label> */}
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <div className="d-flex justify-content-between">
                  <button
                    type="submit"
                    className="saves-btn"
                    style={{ marginright: "10px" }}
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setNewPassword("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
