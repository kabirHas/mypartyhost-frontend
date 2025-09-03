import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URLS from "../config";
import { RiArrowLeftLine } from "react-icons/ri";
import Select from "react-select";
import Notify from "../utils/notify";
import { useNavigate } from "react-router-dom";

const UserSidebar = ({ userId, onClose, isCreate = false }) => {
  const [data, setData] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "organiser",
    city: "-",
    state: "-",
    country: "",
    profileImage: "",
    isActive: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIsActive, setNewIsActive] = useState(null);
  const [countries, setCountries] = useState([]);
  const [reason, setReason] = useState("");
  const [days, setDays] = useState("");
  const [logs, setLogs] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const safeLogs = Array.isArray(logs) ? logs : [];
  const visibleLogs = showAll ? safeLogs : safeLogs.slice(0, 4);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags")
      .then((res) => res.json())
      .then((data) => {
        const countryList = data
          .map((country) => ({
            label: country.name.common,
            value: country.name.common,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(countryList);
      })
      .catch((err) => console.error("Failed to fetch countries", err));
  }, []);

  useEffect(() => {
    if (!isCreate && userId) {
      axios
        .get(`${BASE_URLS.BACKEND_BASEURL}user/${userId}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [userId, isCreate]);

  useEffect(() => {
    if (!isCreate && userId) {
      const token = localStorage.getItem("token");
      axios
        .get(`${BASE_URLS.BACKEND_BASEURL}admin/activity/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLogs(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [userId, isCreate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleRoleChange = (e) => {
    const { id, name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id || name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { id, name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id || name]: value == "on" ? "true" : "false",
    }));
  };

  const handleCreateUser = async () => {
    try {
      console.log(formData);
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URLS.API}/admin/create-user`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      Notify.success("User created successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      Notify.error("Failed to create user ❌");
    }
  };

  const handleSuspendUser = () => {
    setNewIsActive(!user.isActive);
    setIsModalOpen(true);
  };

  const confirmSuspendUser = async () => {
    try {
      await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}admin/suspend-user/${userId}`,
        {
          isActive: newIsActive,
          reason: reason,
          days: days,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUser((prev) => ({ ...prev, isActive: newIsActive }));
      Notify.success("User status updated successfully ✅");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating user status:", error);
      Notify.error("Failed to update user status ❌");
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URLS.API}/admin/delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Notify.success("User deleted successfully!");
      onClose();
    } catch (error) {
      Notify.error("Failed to delete Yser. Please try again.");
    }
  };

  if (!user && !isCreate) return null;

  return (
    <>
      <div className="fixed top-0 right-0 w-full sm:w-[600px] h-full bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto">
        <div className="flex justify-start gap-4 items-center px-6 py-4 border-b">
          <button onClick={onClose} className="text-gray-800 text-xl">
            <i className="ri-arrow-left-line"></i>
          </button>
          <h2 className="text-lg font-semibold">
            {isCreate ? "Create New User" : "User Details"}
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {isCreate ? (
            <>
              <div className="self-stretch p-4 bg-[#F9F9F9] rounded-2xl flex flex-col justify-start items-start gap-3">
                <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  User Information
                </div>

                <div className="w-28 h-28 relative bg-zinc-300 rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] overflow-hidden flex items-center justify-center">
                  {formData.profileImage ? (
                    <img
                      src={URL.createObjectURL(formData.profileImage)}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-black text-sm font-medium">
                      Upload Photo
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData((prev) => ({
                          ...prev,
                          profileImage: file,
                        }));
                      }
                    }}
                  />
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch w-full h-20 flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch inline-flex justify-start items-center gap-3">
                        <div className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          Full Name
                        </div>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        id="name"
                        placeholder="Enter the user’s full name"
                        className="self-stretch flex-1 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight focus:outline-blue-500 focus:outline-2"
                      />
                    </div>
                    <div className="self-stretch h-20 flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch inline-flex justify-start items-center gap-3">
                        <div className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          Email Address
                        </div>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        id="email"
                        placeholder="Enter email address"
                        className="self-stretch flex-1 px-3 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight focus:outline-blue-500 focus:outline-2"
                      />
                    </div>
                    <div className="self-stretch h-20 flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch inline-flex justify-start items-center gap-3">
                        <div className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          Phone Number
                        </div>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="self-stretch flex-1 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight focus:outline-blue-500 focus:outline-2"
                      />
                    </div>
                    <div className="self-stretch h-20 flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch inline-flex justify-start items-center gap-3">
                        <div className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          Location
                        </div>
                      </div>
                      <div className="relative self-stretch flex-1">
                        <Select
                          className="chammel-select"
                          options={countries}
                          value={countries.find(
                            (option) => option.value === formData.country
                          )}
                          onChange={(selected) => {
                            setFormData((prev) => ({
                              ...prev,
                              country: selected ? selected.value : "",
                            }));
                          }}
                          placeholder="Select Country"
                          isClearable
                        />
                        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <i className="ri-map-pin-line text-lg text-[#656565]"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#F9F9F9] p-4 rounded-lg space-y-4">
                <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  Permissions & Role Management
                </h3>
                <div className="space-y-2 flex gap-3 items-center">
                  <label className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                    Current Role:
                  </label>
                  <select
                    name="role"
                    value={data.role}
                    onChange={handleRoleChange}
                    className="px-3 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-start items-center gap-2"
                  >
                    <option value="hostess">Hostess</option>
                    <option value="organiser">Organiser</option>
                    <option value="staff">Staff</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { label: "Accept bookings", name: "canAcceptBookings" },
                    { label: "Message users", name: "canMessage" },
                    { label: "Boost profile", name: "isBoosted" },
                    { label: "Apply Events", name: "canApply" },
                    { label: "Submit reviews", name: "canSubmitReview" },
                    { label: "Post Events", name: "canPostEvents" },
                  ].map((perm) => (
                    <label key={perm.name} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={perm.name}
                        checked={data[perm.name]}
                        onChange={handleInputChange}
                        className="accent-[#E61E4D] w-4 h-4"
                      />
                      <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        {perm.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="w-[100%] p-4 pb-0 bg-Token-BG-Neutral-Light-1 border-t border-Token-Border-&-Divider-Neutral-Light-2 inline-flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-400 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg text-white text-sm font-medium"
                  onClick={handleCreateUser}
                >
                  Create User
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="self-stretch p-4 bg-[#F9F9F9] rounded-2xl flex flex-col justify-start items-start gap-3">
                <h2 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  Basic Details
                </h2>
                <div className="flex items-center gap-4">
                  <img
                    src={user.profileImage || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Full Name:{" "}
                      <span className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                        {user.name}
                      </span>
                    </span>
                    <span className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      User Type:{" "}
                      <span className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                        {user.role}
                      </span>
                    </span>
                    <span className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Location:{" "}
                      <span className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                        {user.city}, {user.country}
                      </span>
                    </span>
                    <span className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                      Status:{" "}
                      <span
                        className={`justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug ${
                          user.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </span>
                  </div>
                </div>
                <hr className="border-gray-300 w-full border-1" />
                <div className="flex justify-end w-full gap-2 items-center">
                  <button
                    onClick={handleSuspendUser}
                    className="px-4 justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden"
                  >
                    {user.isActive ? "Suspend User" : "Unsuspend User"}
                  </button>
                  <button
                    className="px-4 justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete User
                  </button>
                </div>
              </div>
              <div className="self-stretch p-4 bg-[#F9F9F9] rounded-2xl flex flex-col justify-start items-start gap-4">
                <h2 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  Contact & Account
                </h2>
                <span className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                  Email:{" "}
                  <span className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    {user.email}
                  </span>
                </span>
                <span className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                  Phone:{" "}
                  <span className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    {user.phone}
                  </span>
                </span>
                <span className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                  User ID:{" "}
                  <span className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    {user._id}
                  </span>
                </span>
                <span className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                  Account Created:{" "}
                  <span className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    {new Date(user.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </span>
                <hr className="border-gray-300 border-1 w-full" />
                <div className="flex justify-end gap-3 w-full items-center">
                  <button className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight flex items-center gap-2">
                    <span>View as User</span>{" "}
                    <i className="ri-eye-line text-lg"></i>
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-l justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden"
                    onClick={() =>
                      navigate("/dashboard/messages", {
                        state: { userId: user._id },
                      })
                    }
                  >
                    Send Message
                  </button>
                </div>
              </div>
              <div className="self-stretch p-4 bg-[#F9F9F9] rounded-2xl flex flex-col justify-start items-start gap-4">
                <h2 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  Permissions & Role Management
                </h2>
                <span className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                  Current Role:{" "}
                  <span className="px-3 py-2 text-center justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug capitalize bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] inline-flex justify-start items-center gap-2">
                    {user.role}
                  </span>
                </span>
                <p className="self-stretch justify-start text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                  Assigned Permissions
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.canAcceptBookings}
                      className="mr-2 accent-[#E61E4D] w-4 h-4"
                      readOnly
                    />
                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Accept bookings
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.canMessage}
                      className="mr-2 accent-[#E61E4D] w-4 h-4"
                      readOnly
                    />
                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Message users
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.canApply}
                      className="mr-2 accent-[#E61E4D] w-4 h-4"
                      readOnly
                    />
                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Apply Events
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.canSubmitReview}
                      className="mr-2 accent-[#E61E4D] w-4 h-4"
                      readOnly
                    />
                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Submit reviews
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.canPostEvents}
                      className="mr-2 accent-[#E61E4D] w-4 h-4"
                      readOnly
                    />
                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Post Events
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.isBoosted}
                      className="mr-2 accent-[#E61E4D] w-4 h-4"
                      readOnly
                    />
                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Post Events
                    </span>
                  </div>
                </div>
              </div>
              <div className="self-stretch p-4 bg-[#F9F9F9] rounded-2xl inline-flex flex-col justify-start items-start gap-4">
                <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  Activity Log
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    {logs && logs.length > 0 ? (
                      visibleLogs.map((log, i) => (
                        <div
                          key={i}
                          className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug"
                        >
                          {log.metadata.log}
                        </div>
                      ))
                    ) : (
                      <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        No Activity
                      </div>
                    )}
                  </div>
                  {logs && logs.length > 4 && (
                    <>
                      <div className="w-[520px] h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                      <div className="self-stretch flex flex-col justify-center items-end gap-2.5">
                        <div
                          className="py-1 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
                          onClick={() => setShowAll(!showAll)}
                        >
                          <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                            {showAll ? "Show Less" : "View Full Activity Log"}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed sm:w-[600px] right-0 top-0 h-full  flex items-center justify-center z-50">
          <div className="w-96 p-6  bg-[#F9F9F9] rounded-2xl shadow-[5px_8px_88.9000015258789px_51px_rgba(0,0,0,0.15)] outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-3 overflow-hidden">
            <h3 className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              Account {user.isActive ? "Suspension" : "Activation"}
            </h3>
            <div className="self-stretch inline-flex justify-start items-center gap-4 ">
              <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                Reason:
              </div>
              <div className="relative flex-1">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug appearance-none pr-10 focus:outline-blue-500 focus:outline-2"
                >
                  <option value="">Select Reason</option>
                  <option value="violation">
                    Violation of platform policies
                  </option>
                  <option value="inappropriate">Inappropriate behavior</option>
                  <option value="spam">Spam or abuse</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {/* <RiArrowDownSLine className="text-[#3D3D3D] text-lg" /> */}
                  <i class="ri-arrow-drop-down-line text-[#3D3D3D] text-4xl"></i>
                </div>
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-3 ">
              <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                Duration:
              </div>
              <div className="relative flex-1">
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="flex-1 px-3 py-2 w-full bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug appearance-none pr-10 focus:outline-blue-500 focus:outline-2"
                >
                  <option value="">Select Duration</option>
                  <option value="15">15 days</option>
                  <option value="20">20 days</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {/* <RiArrowDownSLine className="text-[#3D3D3D] text-lg" /> */}
                  <i class="ri-arrow-drop-down-line text-[#3D3D3D] text-4xl"></i>
                </div>
              </div>
            </div>
            <hr className="w-full border border-zinc-300" />
            <div className="inline-flex w-full justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] inline-flex justify-center items-center gap-2 overflow-hidden justify-start text-[#292929] text-sm font-medium font-['Inter'] leading-tight"
              >
                No, Keep Account
              </button>
              <button
                onClick={confirmSuspendUser}
                className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight px-4 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden "
              >
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSidebar;
