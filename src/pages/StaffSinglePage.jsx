import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PiChampagneFill } from "react-icons/pi";
import { FaHourglass } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import axios from "axios";
import BASE_URLS from "../config";
import { ChatState } from "../Context/ChatProvider";
import RemixIconPicker from "../components/RemixIconPicker";

function StaffSinglePage() {
  const { user, setUser } = ChatState();
  const navigate = useNavigate();

  // Initialize states
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const [isInstantBook, setIsInstantBook] = useState(true);
  const [isDailyBooking, setIsDailyBooking] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAddRateOpen, setIsAddRateOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [showInstantPopup, setShowInstantPopup] = useState(false);
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [notification, setNotification] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [flagUrl, setFlagUrl] = useState("");
  const [location, setLocation] = useState("Loading...");
  const [name, setName] = useState("Loading...");
  const [bio, setBio] = useState("Loading...");
  const [editedBio, setEditedBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableFor, setAvailableFor] = useState([]);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [tempHourlyRate, setTempHourlyRate] = useState(0);
  const [staffdailyRate, setStaffdailyRate] = useState(0);
  const [tempStaffdailyRate, setTempStaffdailyRate] = useState(0);
  const [additionalRates, setAdditionalRates] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [addtionalRatesList, setAddtionalRatesList] = useState([
    "Beach Party",
    "Bikini Waitress",
    "Poker Dealer",
    "Party Hostess",
    "Topless Waitress",
    "Brand Promotion",
    "Atmosphere Model",
  ]);
  const [jobHistory, setJobHistory] = useState({ pastBookings: 0, cancelledBookings: 0, noShows: 0 });
  const [profileImage, setProfileImage] = useState("https://imgs.search.brave.com/gvHmpglOB6wYM1zBXrNIN3Lwphpd6DaygXXFFothvbc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y29ybndhbGxidXNp/bmVzc2F3YXJkcy5j/by51ay93cC1jb250/ZW50L3VwbG9hZHMv/MjAxNy8xMS9kdW1t/eTQ1MHg0NTAtMzAw/eDMwMC5qcGc");
  const [photos, setPhotos] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newService, setNewService] = useState("");
  const [newRate, setNewRate] = useState("");
  const [newSkillTitle, setNewSkillTitle] = useState("");
  const [newSkillIcon, setNewSkillIcon] = useState("");
  const [newSkillPrice, setNewSkillPrice] = useState("");
  const [isHourlyRateModified, setIsHourlyRateModified] = useState(false);
  const [isDailyRateModified, setIsDailyRateModified] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [userDataError, setUserDataError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialBaseRate, setInitialBaseRate] = useState(0);
  const [isBaseRateModified, setIsBaseRateModified] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempCity, setTempCity] = useState("");
  const [tempCountry, setTempCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [tempFlag, setTempFlag] = useState("");

  const fileInputRef = useRef(null);
  const addPhotoInputRef = useRef(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchStaffData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const [staffResponse, bookingsResponse] = await Promise.all([
        axios.get(`${BASE_URLS.BACKEND_BASEURL}auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URLS.BACKEND_BASEURL}jobs/manage-bookings`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const staff = staffResponse.data;
      console.log('Staff Data: ', staff);
      if (!staff) throw new Error("Staff data not found");

      setProfileImage(staff.profileImage || profileImage);
      setPhotos(staff.photos || []);
      const staffReviews = staff.reviews || [];
      setReviews(staffReviews);
      const totalRating = staffReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
      setAvgRating(staffReviews.length > 0 ? (totalRating / staffReviews.length).toFixed(1) : 0);
      setLocation(`${staff.suburb || ""}, ${staff.country || ""}`);
      setFlagUrl(staff.flag || "");
      setName(staff.name || "N/A");
      setBio(staff.bio || "");
      setSkills(staff.skills || []);
      setAvailableDates(staff.availableDates?.map(date => date.split('T')[0]) || []);
      setAvailableFor(staff.availableFor || []);
      setHourlyRate(staff.baseRate || 0);
      setTempHourlyRate(staff.baseRate || 0);
      setStaffdailyRate(staff.dailyRate || 0);
      setTempStaffdailyRate(staff.dailyRate || 0);
      setAdditionalRates(staff.additionalRates || []);
      setInitialBaseRate(staff.baseRate || 0); // Initialize initialBaseRate
      setIsProfileVisible(staff.isPublic ?? true);
      setIsInstantBook(staff.instantBook ?? true);
      setAddtionalRatesList(staff.serviceOptions || addtionalRatesList);

      const allLabels = new Set(staff.skills?.map(skill => skill.title) || []);
      setServiceOptions([...allLabels].sort());

      setJobHistory({
        pastBookings: bookingsResponse.data.pastBookings?.length || 0,
        cancelledBookings: bookingsResponse.data.cancelledBookings?.length || 0,
        noShows: 0,
      });

      localStorage.setItem("userInfo", JSON.stringify(staff));
    } catch (error) {
      console.error("Error fetching staff data:", error);
      showNotification("Failed to load profile data. Please try again.", 'error');
      if (error.response?.status === 401) navigate("/login");
    }
  }, [navigate, profileImage]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (userInfo._id) {
      setIsProfileVisible(userInfo.isPublic ?? true);
      setIsInstantBook(userInfo.instantBook ?? true);
      setHourlyRate(userInfo.baseRate || 0);
      setTempHourlyRate(userInfo.baseRate || 0);
      setStaffdailyRate(userInfo.dailyRate || 0);
      setTempStaffdailyRate(userInfo.dailyRate || 0);
      setProfileImage(userInfo.profileImage || profileImage);
      setPhotos(userInfo.photos || []);
      setAdditionalRates(userInfo.additionalRates || []);
      setInitialBaseRate(userInfo.baseRate || 0);
    }
    fetchStaffData();
  }, [fetchStaffData, profileImage]);

  const handleImageUpload = async (event, fieldName) => {
    const file = event.target.files[0];
    if (!file || !["image/jpeg", "image/png", "image/jpg"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      showNotification("Invalid image file. Must be JPEG/PNG/JPG under 5MB.", 'error');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append(fieldName, file);

      const response = await axios.patch(`${BASE_URLS.BACKEND_BASEURL}staff`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      const updatedData = response.data.data || response.data;
      if (fieldName === "profileImage") {
        setProfileImage(updatedData.profileImage);
      } else if (fieldName === "photos") {
        setPhotos(updatedData.photos || []);
      }

      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, [fieldName]: updatedData[fieldName] }));

      showNotification("Image updated successfully!");
    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error);
      showNotification("Failed to update image.", 'error');
    }
  };

  const handleProfileImageUpload = (e) => handleImageUpload(e, "profileImage");
  const handleAddPhotoUpload = (e) => handleImageUpload(e, "photos");

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


  const handleSaveLocation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
  
      const payload = { 
        suburb: tempCity, 
        country: tempCountry,
        flag: tempFlag // ✅ backend me flag bhejna
      };
  
      const res = await axios.patch(`${BASE_URLS.BACKEND_BASEURL}auth/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      const updated = res.data?.data || res.data || {};
      const newLocation = `${updated.suburb || tempCity || ""}, ${updated.country || tempCountry || ""}`;
      setLocation(newLocation);
  
      if (updated.flag) setFlagUrl(updated.flag);
      setIsLocationModalOpen(false);
  
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem("userInfo", JSON.stringify({ 
        ...userInfo, 
        suburb: tempCity, 
        country: tempCountry, 
        flag: updated.flag || tempFlag || userInfo.flag
      }));
  
      showNotification("Location updated successfully!");
    } catch (err) {
      console.error("Error updating location:", err);
      showNotification("Failed to update location.", 'error');
    }
  };
  


  const handleSaveBio = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      await axios.patch(`${BASE_URLS.BACKEND_BASEURL}staff`, { bio: editedBio }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBio(editedBio);
      setIsBioModalOpen(false);

      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, bio: editedBio }));

      showNotification("Bio updated successfully!");
    } catch (error) {
      console.error("Error updating bio:", error);
      showNotification("Failed to update bio.", 'error');
    }
  };

  const handleSaveSkill = async () => {
    if (!newSkillTitle || !newSkillIcon || isNaN(newSkillPrice) || newSkillPrice <= 0) {
      showNotification("Please fill in all fields with valid data.", 'error');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const newSkill = { icon: newSkillIcon, title: newSkillTitle, pricePerHour: parseFloat(newSkillPrice) };
      const updatedSkills = [...skills, newSkill];

      await axios.patch(`${BASE_URLS.BACKEND_BASEURL}staff`, { skills: updatedSkills }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSkills(updatedSkills);
      setServiceOptions([...new Set(updatedSkills.map(s => s.title))].sort());
      setIsSkillModalOpen(false);
      setNewSkillTitle("");
      setNewSkillIcon("");
      setNewSkillPrice("");

      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, skills: updatedSkills }));

      showNotification("Skill added successfully!");
    } catch (error) {
      console.error("Error adding skill:", error);
      showNotification("Failed to add skill.", 'error');
    }
  };

  const toggleProfileVisibility = async () => {
    const newVisibility = !isProfileVisible;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      await axios.patch(`${BASE_URLS.BACKEND_BASEURL}staff`, { isPublic: newVisibility }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsProfileVisible(newVisibility);

      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, isPublic: newVisibility }));

      showNotification("Profile visibility updated!");
    } catch (error) {
      console.error("Error updating visibility:", error);
      showNotification("Failed to update visibility.", 'error');
    }
  };

  const toggleInstantBook = async () => {
    const newInstantBook = !isInstantBook;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      await axios.patch(`${BASE_URLS.BACKEND_BASEURL}staff`, { instantBook: newInstantBook }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsInstantBook(newInstantBook);

      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, instantBook: newInstantBook }));

      showNotification("Instant book status updated!");
    } catch (error) {
      console.error("Error updating instant book:", error);
      showNotification("Failed to update instant book.", 'error');
    }
  };

  const startEditingRates = () => {
    setTempHourlyRate(hourlyRate);
    setTempStaffdailyRate(staffdailyRate);
    setIsEditingRates(true);
  };

  const cancelEditingRates = () => {
    setIsEditingRates(false);
  };

  const handleTempHourlyRateChange = (e) => {
    setTempHourlyRate(parseFloat(e.target.value) || 0);
  };

  const handleTempDailyRateChange = (e) => {
    setTempStaffdailyRate(parseFloat(e.target.value) || 0);
  };

  const saveRates = async () => {
    if (tempHourlyRate <= 0 || tempStaffdailyRate <= 0) {
      showNotification("Please enter valid rates.", 'error');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const updatedData = {
        baseRate: tempHourlyRate,
        dailyRate: tempStaffdailyRate,
      };

      await axios.patch(`${BASE_URLS.BACKEND_BASEURL}staff`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHourlyRate(tempHourlyRate);
      setStaffdailyRate(tempStaffdailyRate);
      setIsEditingRates(false);

      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, ...updatedData }));

      showNotification("Rates updated successfully!");
    } catch (error) {
      console.error("Error saving rates:", error);
      showNotification("Failed to save rates.", 'error');
    }
  };

  const handleUpdateAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.patch(`${BASE_URLS.BACKEND_BASEURL}staff`, { availableDates }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, availableDates }));

      setIsCalendarOpen(false);
      showNotification("Availability updated successfully!");
    } catch (error) {
      console.error("Error updating availability:", error);
      showNotification("Failed to update availability.", 'error');
    }
  };

  const handleSaveRate = async (isAddingNewRate = false) => {
    const currentRates = additionalRates || [];

    console.log("=== DEBUG INFO ===");
    console.log("isAddingNew (state):", isAddingNew);
    console.log("isAddingNewRate (param):", isAddingNewRate);
    console.log("shouldAddNew (final):", isAddingNewRate || isAddingNew);
    console.log("hourlyRate:", hourlyRate);
    console.log("staffdailyRate:", staffdailyRate);
    console.log("newService:", newService);
    console.log("newRate:", newRate);
    console.log("currentRates:", currentRates);
    console.log("==================");

    // Use parameter if provided, otherwise use state
    const shouldAddNew = isAddingNewRate || isAddingNew;

    // Validation for base rates
    if (isNaN(hourlyRate) || hourlyRate <= 0) {
      showNotification("Please enter a valid base rate.", 'error');
      return;
    }

    // Validation for daily rate
    if (isNaN(staffdailyRate) || staffdailyRate <= 0) {
      showNotification("Please enter a valid daily rate.", 'error');
      return;
    }

    // Validation for new rate addition (only when actually adding new)
    if (shouldAddNew) {
      if (!newService || !newRate || isNaN(newRate) || newRate <= 0) {
        showNotification("Please select a service and enter a valid rate.", 'error');
        return;
      }

      // Check if service already exists
      if (currentRates.some(rate => rate.label.toLowerCase() === newService.toLowerCase())) {
        showNotification("This service already exists. Please choose a different service.", 'error');
        return;
      }
    }

    setIsLoading(true);
    setUserDataError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const updatedData = {
        baseRate: parseFloat(hourlyRate),
        dailyRate: parseFloat(staffdailyRate),
        additionalRates: shouldAddNew
          ? [
            ...currentRates,
            { label: newService, amount: parseFloat(newRate) },
          ]
          : currentRates,
      };

      console.log("Sending payload to API:", updatedData);

      const response = await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}staff`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Update local state
      setHourlyRate(updatedData.baseRate);
      setStaffdailyRate(updatedData.dailyRate);
      setAdditionalRates(updatedData.additionalRates);

      // Update localStorage
      const updatedUserInfo = {
        ...JSON.parse(localStorage.getItem("userInfo") || "{}"),
        baseRate: updatedData.baseRate,
        dailyRate: updatedData.dailyRate,
        additionalRates: updatedData.additionalRates,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      // Reset form fields
      setNewService("");
      setNewRate("");
      setIsAddingNew(false);
      setInitialBaseRate(updatedData.baseRate);
      setIsBaseRateModified(false);
      setShowInstantPopup(false);
      setIsAddRateOpen(false);

      showNotification(shouldAddNew ? "New rate added successfully!" : "Rates updated successfully!");
    } catch (error) {
      console.error("Error saving rates:", error);
      showNotification("Failed to save rates. Please try again.", 'error');
      setUserDataError("Failed to save rates. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleAddNewToggle = () => {
    setIsAddingNew(true);
  };

  const handleDeleteRate = async (index) => {
    const updatedRates = additionalRates.filter((_, i) => i !== index);
    setAdditionalRates(updatedRates);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      await axios.patch(`${BASE_URLS.BACKEND_BASEURL}staff`, { additionalRates: updatedRates }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, additionalRates: updatedRates }));

      showNotification("Rate deleted successfully!");
    } catch (error) {
      console.error("Error deleting rate:", error);
      showNotification("Failed to delete rate.", 'error');
    }
  };

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setAvailableDates(prev =>
      prev.includes(dateString)
        ? prev.filter(d => d !== dateString)
        : [...prev, dateString].sort((a, b) => new Date(a) - new Date(b))
    );
  };

  const handleSelectAll = () => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const allDates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      allDates.push(d.toISOString().split("T")[0]);
    }
    setAvailableDates(allDates);
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const renderBioModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="w-[517px] p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-[#292929] text-xl font-bold">Edit Bio</div>
            </div>
            <button
              onClick={() => setIsBioModalOpen(false)}
              className="p-2 rounded-lg border border-[#ECECEC]"
            >
              <i className="ri-close-line text-xl text-[#656565]"></i>
            </button>
          </div>
          <textarea
            className="self-stretch h-40 p-3 border border-[#292929] resize-none"
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsBioModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#ECECEC] text-[#656565]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBio}
              className="px-4 py-2 rounded-lg border border-[#E61E4D] text-[#E61E4D]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSkillModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="w-[517px] p-6 bg-white rounded-2xl shadow-[0px_0px_231px_9px_rgba(0,0,0,0.2)] outline outline-1 outline-[#ECECEC] flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">Add New Skill</div>
              <div className="text-[#656565] text-base font-medium font-['Inter'] leading-snug">Enter skill details</div>
            </div>
            <button onClick={() => setIsSkillModalOpen(false)} className="p-2 rounded-lg outline outline-1 outline-[#ECECEC] flex items-center gap-2.5">
              <i className="ri-close-line text-xl text-[#656565]"></i>
            </button>
          </div>
          <div className="self-stretch flex flex-col gap-4">
            <div className="self-stretch flex flex-col gap-2">
              <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">Skill Title</div>
              <input type="text" value={newSkillTitle} onChange={(e) => setNewSkillTitle(e.target.value)} placeholder="Enter skill title" className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']" />
            </div>
            <div className="self-stretch flex flex-col gap-2">
              <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">Icon Class (Remix Icon)</div>
              <input type="text" value={newSkillIcon} onChange={(e) => setNewSkillIcon(e.target.value)} placeholder="e.g., ri-billiards-line" className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']" />
            </div>
            <div className="self-stretch flex flex-col gap-2">
              <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">Price Per Hour ($)</div>
              <input type="number" value={newSkillPrice} onChange={(e) => setNewSkillPrice(e.target.value)} placeholder="Enter price per hour" className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsSkillModalOpen(false)} className="px-4 py-2 rounded-lg outline outline-1 outline-[#ECECEC] text-[#656565] text-sm font-medium font-['Inter'] leading-tight">Cancel</button>
              <button onClick={handleSaveSkill} className="px-4 py-2 rounded-lg outline outline-1 outline-[#E61E4D] text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    const days = [];

    const prevMonthDays = startDay === 0 ? 6 : startDay - 1;
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    for (let i = prevMonthDays; i > 0; i--) {
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i + 1),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    const nextMonthDays = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i),
        isCurrentMonth: false,
      });
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="md:w-[479px] w-full p-6 bg-white rounded-2xl shadow-[0px_0px_231px_9px_rgba(0,0,0,0.2)] outline outline-1 outline-[#ECECEC] flex flex-col gap-2.5">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                Select Available Dates
              </div>
              <div className="text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                {availableDates.length} Date Selected
              </div>
            </div>
            <button
              onClick={() => setIsCalendarOpen(false)}
              className="p-2 rounded-lg outline outline-1 outline-[#ECECEC] flex items-center gap-2.5"
            >
              <i className="ri-close-line text-xl text-[#656565]"></i>
            </button>
          </div>
          <div className="md:min-w-80 p-4 bg-[#F9F9F9] rounded-lg outline outline-1 outline-[#ECECEC] flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <button onClick={handlePrevMonth} className="relative">
                <i className="ri-arrow-left-s-line text-xl text-[#3D3D3D]"></i>
              </button>
              <div className="text-center text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
              </div>
              <button onClick={handleNextMonth} className="relative">
                <i className="ri-arrow-right-s-line text-xl text-[#3D3D3D]"></i>
              </button>
            </div>
            <div className="h-0 outline outline-1 outline-[#ECECEC]"></div>
            <div className="flex justify-between items-center">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div key={day} className="flex-1 px-1 md:px-2 py-1 flex justify-center items-center">
                  <div className="text-center text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                    {day}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              {weeks.map((week, index) => (
                <div key={index} className="flex justify-between items-center">
                  {week.map((day) => {
                    const dateString = day.date.toISOString().split("T")[0];
                    const isSelected = availableDates.includes(dateString);
                    const isToday = day.date.toDateString() === new Date().toDateString();
                    return (
                      <button
                        key={dateString}
                        onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
                        className={`flex-1 h-8 md:p-3 p-1 rounded ${day.isCurrentMonth
                          ? isSelected
                            ? "bg-[#E61E4D] text-white outline outline-1 outline-[#B11235]"
                            : isToday
                              ? "text-[#E61E4D]"
                              : "text-[#292929]"
                          : "text-zinc-500"
                          } flex justify-center items-center`}
                        disabled={!day.isCurrentMonth}
                      >
                        <div className="text-center text-sm font-normal font-['Inter'] leading-tight">
                          {day.date.getDate()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="h-0 outline outline-1 outline-[#ECECEC]"></div>
            <div className="flex justify-end items-center gap-3">
              <button onClick={handleSelectAll} className="px-2 py-1 bg-[#FFF1F2] rounded-lg outline outline-1 outline-[#3D3D3D] flex items-center gap-2">
                <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">Select All</div>
                <i className="ri-check-line text-[#3D3D3D]"></i>
              </button>
              <button onClick={() => setAvailableDates([])} className="px-2 py-1 bg-[#FFF1F2] rounded-lg outline outline-1 outline-[#3D3D3D] flex items-center gap-2">
                <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">Clear All</div>
                <i className="ri-close-line text-[#3D3D3D]"></i>
              </button>
            </div>
          </div>
          <button onClick={handleUpdateAvailability} className="px-6 py-3 cursor-pointer w-fit rounded-lg outline outline-1 outline-[#E61E4D] flex justify-center items-center gap-2">
            <div className="text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">Update Availability</div>
            <i className="ri-calendar-check-line text-[#E61E4D]"></i>
          </button>
        </div>
      </div>
    );
  };

  const renderAddRateModal = () => (
    <div className="md:w-[517px] p-6 bg-white rounded-2xl shadow-[0px_0px_231px_9px_rgba(0,0,0,0.2)] outline outline-1 outline-[#ECECEC] flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">Add New Rate</div>
          <div className="text-[#656565] text-base font-medium font-['Inter'] leading-snug">Select a service and set its rate</div>
        </div>
        <button onClick={() => setIsAddRateOpen(false)} className="p-2 rounded-lg outline outline-1 outline-[#ECECEC] flex items-center gap-2.5">
          <i className="ri-close-line text-xl text-[#656565]"></i>
        </button>
      </div>
      <div className="self-stretch flex flex-col gap-4">
        {userDataError && <div className="text-red-500 text-sm">{userDataError}</div>}
        <div className="self-stretch flex flex-col gap-2">
          <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">Service</div>
          <select value={newService} onChange={(e) => setNewService(e.target.value)} className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']">
            <option value="" disabled>Select a service</option>
            {addtionalRatesList.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
        <div className="self-stretch flex flex-col gap-2">
          <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">Rate ($/hour)</div>
          <input
            type="number"
            value={newRate}
            onChange={(e) => setNewRate(parseFloat(e.target.value) || "")}
            placeholder="Enter rate"
            className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={() => setIsAddRateOpen(false)} className="px-4 py-2 rounded-lg outline outline-1 outline-[#ECECEC] text-[#656565] text-sm font-medium font-['Inter'] leading-tight">Cancel</button>
          <button
            onClick={() => {
              handleSaveRate(true); // Pass true to indicate we're adding new
            }}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg outline outline-1 outline-[#E61E4D] text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  const isAdditionalModified = JSON.stringify(additionalRates) !== JSON.stringify(JSON.parse(localStorage.getItem("userInfo") || "{}").additionalRates || []);

  return (
    <div className="self-stretch bg-[#fafafa] w-full px-4 md:px-12 pt-20 pb-40 flex flex-col justify-center items-center gap-2.5">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
      {isCalendarOpen && <div className="fixed inset-0 p-4 bg-black bg-opacity-50 flex justify-center items-center z-50">{renderCalendar()}</div>}
      {isAddRateOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">{renderAddRateModal()}</div>}
      {isBioModalOpen && renderBioModal()}
      {isSkillModalOpen && renderSkillModal()}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-[517px] p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <div className="text-[#292929] text-xl font-bold">Edit Location</div>
                <div className="text-[#656565] text-sm">Update your city and country</div>
              </div>
              <button onClick={() => setIsLocationModalOpen(false)} className="p-2 rounded-lg border border-[#ECECEC]">
                <i className="ri-close-line text-xl text-[#656565]"></i>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#656565] font-medium">City</label>
                <input value={tempCity} onChange={(e) => setTempCity(e.target.value)} className="p-2 rounded-lg border border-[#292929]" placeholder="Enter city" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#656565] font-medium">Country</label>
                <select
                  value={tempCountry}
                  onChange={(e) => {
                    const selected = countries.find(c => c.value === e.target.value);
                    setTempCountry(selected.value);
                    setTempFlag(selected.flag); // ✅ flag bhi store karna
                  }}
                  className="p-2 rounded-lg border border-[#292929]"
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>

                {/* Selected flag preview */}
                {tempFlag && (
                  <div className="flex items-center gap-2 mt-2">
                    <img src={tempFlag} alt="flag" className="w-6 h-4" />
                    <span className="text-sm">{tempCountry}</span>
                  </div>
                )}
              </div>

            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsLocationModalOpen(false)} className="px-4 py-2 rounded-lg border border-[#ECECEC] text-[#656565]">Cancel</button>
              <button onClick={handleSaveLocation} className="px-4 py-2 rounded-lg border border-[#E61E4D] text-[#E61E4D]">Save</button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-[1200px] flex flex-col justify-start gap-6">
        <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
          <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2">
            <i className="ri-arrow-left-s-line text-xl text-[#656565]"></i>
            <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">Back</div>
          </button>
        </div>
        <div className="w-full max-w-[1200px] flex justify-start items-start gap-12">
          <div className="flex w-full gap-6 flex-col md:flex-row">
            <div className="self-stretch flex w-full md:w-1/2 flex-col gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                <div className="self-stretch md:h-[630px] relative rounded-lg overflow-hidden bg-gray-200">
                  <img className="w-full h-full object-fill" src={profileImage} alt="" />
                  <label htmlFor="profileImageInput" className="p-2 right-[30px] top-[27px] absolute bg-white rounded-lg inline-flex justify-start items-center gap-2.5">
                    <i className="ri-camera-line text-3xl text-[#3f3f3f]"></i>
                  </label>
                  <input id="profileImageInput" type="file" accept="image/*" ref={fileInputRef} onChange={handleProfileImageUpload} className="hidden" />
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1.5">
                  <div className="flex-1 h-28 flex justify-start items-start gap-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      photos[index] ? (
                        <img key={index} className="flex-1 w-16 h-full object-cover object-top rounded-lg" src={photos[index]} alt={`Thumbnail ${index + 1}`} />
                      ) : (
                        <div key={index} className="flex-1 w-16 h-full bg-gray-200 rounded-lg"></div>
                      )
                    ))}
                  </div>
                  <input id="addPhotoInput" type="file" accept="image/*" ref={addPhotoInputRef} onChange={handleAddPhotoUpload} className="hidden" />
                </div>
                <button onClick={() => addPhotoInputRef.current.click()} className="px-3 py-1 bg-[#FFF1F2] rounded-2xl inline-flex justify-start items-center gap-2">
                  <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">Add Photo</div>
                  <i className="ri-camera-line text-2xl text-[#3f3f3f]"></i>
                </button>
                <button onClick={() => showNotification("Add Voice Note clicked")} className="px-3 py-1 bg-[#FFF1F2] rounded-2xl inline-flex justify-start items-center gap-2">
                  <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">Add Voice Note</div>
                </button>
              </div>
              <div className="self-stretch md:h-fit p-4 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#F9F9F9] flex flex-col justify-start items-start gap-6">
                <div className="inline-flex justify-start items-center gap-2">
                  <div className="flex justify-start items-center gap-2">
                    <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">Reviews</div>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <i className="ri-star-s-fill text-orange-500"></i>
                      <div className="justify-start text-orange-500 text-sm font-medium font-['Inter'] leading-tight">{avgRating}/5</div>
                    </div>
                    <div className="justify-start text-[#656565] text-sm font-medium font-['Inter'] underline leading-tight">({reviews.length} Reviews)</div>
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  {reviews.slice(0, visibleReviews).map((review, index) => (
                    <div key={index} className="self-stretch pb-4 border-b border-[#ECECEC] flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch inline-flex justify-start items-start gap-3">
                        <img className="w-12 h-12 rounded-full" src="https://images.unsplash.com/photo-1613991917225-836ecf204c77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D" alt="Reviewer" />
                        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">{review.reviewerName || "Anonymous"}</div>
                          <div className="inline-flex justify-start items-start gap-1.5">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`ri-star-s-fill ${i < review.rating ? "text-orange-500" : "text-gray-300"}`}></i>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">{review.comment || "No comment provided."}</div>
                    </div>
                  ))}
                  {reviews.length === 0 && <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">No reviews yet.</div>}
                </div>
                {reviews.length > visibleReviews && <button onClick={() => setVisibleReviews(prev => prev + 5)} className="justify-start my-4 text-[#E61E4D] text-base font-bold font-['Inter'] leading-snug">View More</button>}
              </div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="flex justify-start flex-col md:flex-row items-center gap-4">
                    <div className="flex justify-start items-center gap-2">
                      <div className="flex justify-start items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`ri-star-s-fill ${i < Math.floor(avgRating) ? "text-orange-500" : "text-gray-300"}`}></i>
                        ))}
                      </div>
                      <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">{avgRating}/5</div>
                      <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] underline leading-snug">({reviews.length} Reviews)</div>
                    </div>
                    <div className="w-0 h-2 hidden md:block outline outline-1 outline-offset-[-0.50px] outline-[#656565]"></div>
                    <div className="flex justify-start items-center gap-2">
                      {flagUrl && <img src={flagUrl} alt="Flag" className="w-22 h-8 md:w-10 md:h-6" />}
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">{location || "N/A"}</div>
                      <button onClick={() => {
                        const [suburb, country] = (location || '').split(',').map(s => s.trim());
                        setTempCity(suburb || '');
                        setTempCountry(country || '');
                        setIsLocationModalOpen(true);
                      }} className="bg-rose-200 flex items-center gap-1 text-sm px-3 py-1 text-zinc-700 rounded-2xl">
                        <i className="ri-edit-box-line"></i>
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-3">
                    <div className="capitalize self-stretch justify-start text-[#292929] text-6xl font-bold font-['Inter'] leading-[60.60px]">{name}</div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-[#292929] text-sm font-medium font-['Inter'] leading-tight">About Me</div>
                        <button onClick={() => { setEditedBio(bio); setIsBioModalOpen(true); }} className="w-4 h-4">
                          <i className="ri-edit-box-line text-[#656565]"></i>
                        </button>
                      </div>
                      <div className="self-stretch h-40 p-3 outline outline-1 outline-offset-[-1px] outline-[#292929] overflow-auto whitespace-pre-wrap">{bio}</div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">Top Skills</div>
                    <button onClick={() => setIsSkillModalOpen(true)} className="w-4 h-4">
                      <i className="ri-edit-box-line text-[#656565]"></i>
                    </button>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-end gap-3 flex-wrap">
                    {skills.map((skill, i) => (
                      <div key={i} className="inline-flex flex-col justify-center items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded-2xl outline outline-dotted outline-1 outline-offset-[-1px] outline-[#656565]">
                          <i className={skill.icon || "ri-vip-crown-line text-[#3D3D3D]"}></i>
                        </div>
                        <div className="text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-tight">{skill.title}</div>
                      </div>
                    ))}
                    {!skills.length && <div className="text-[#656565] text-xs font-normal font-['Inter'] leading-tight">No skills available</div>}
                  </div>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl inline-flex justify-start items-center gap-4">
                <div className="flex-1 flex justify-between items-center">
                  <div className="text-[#292929] text-sm font-bold font-['Inter'] leading-tight">Profile Public Visibility</div>
                  <button onClick={toggleProfileVisibility} className={`w-12 h-6 relative rounded-full ${isProfileVisible ? "bg-[#E61E4D]" : "bg-[#656565]"}`}>
                    <div className={`w-3 h-3 absolute top-[6px] ${isProfileVisible ? "left-[27px]" : "left-[9px]"} bg-white rounded-full`} />
                  </button>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
                <div className="inline-flex justify-start items-center gap-2">
                  <i className="ri-money-dollar-circle-line text-[#E61E4D] text-xl"></i>
                  <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">Rates</div>
                  {!isEditingRates && <button onClick={startEditingRates} className="ml-auto px-3 py-1 bg-[#FFF1F2] rounded-2xl flex justify-start items-center gap-2">
                    <div className="text-black text-sm font-normal font-['Inter'] leading-tight">Edit</div>
                    <i className="ri-edit-box-line text-[#656565]"></i>
                  </button>}
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">Base Hourly Rate</div>
                    {isEditingRates ? (
                      <input type="number" value={tempHourlyRate} onChange={handleTempHourlyRateChange} className="w-fit px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug" />
                    ) : (
                      <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        ${hourlyRate}
                      </div>
                    )}
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="flex-1 text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">Are You Available for Daily Bookings</div>
                    <button onClick={() => setIsDailyBooking(!isDailyBooking)} className={`w-12 h-6 relative rounded-full ${isDailyBooking ? "bg-[#E61E4D]" : "bg-[#656565]"}`}>
                      <div className={`w-3 h-3 absolute top-[6px] ${isDailyBooking ? "left-[27px]" : "left-[9px]"} bg-white rounded-full`} />
                    </button>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">Daily Rate</div>
                      {isEditingRates ? (
                        <input type="number" value={tempStaffdailyRate} onChange={handleTempDailyRateChange} className="w-fit px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug" />
                      ) : (
                        <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          ${staffdailyRate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {isEditingRates && (
                  <div className="flex justify-end gap-3 w-full">
                    <button onClick={cancelEditingRates} className="px-4 py-2 rounded-lg outline outline-1 outline-[#ECECEC] text-[#656565] text-sm font-medium font-['Inter'] leading-tight">Cancel</button>
                    <button onClick={saveRates} className="px-4 py-2 rounded-lg outline outline-1 outline-[#E61E4D] text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">Save</button>
                  </div>
                )}
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
                <div className="inline-flex justify-start items-center gap-2">
                  <i className="ri-calendar-line text-[#E61E4D] text-xl"></i>
                  <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">Available Dates</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  {availableDates.length > 0 ? (
                    <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      {new Date(availableDates[0]).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} – {new Date(availableDates[availableDates.length - 1]).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </div>
                  ) : (
                    <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">No available dates</div>
                  )}
                  <button onClick={() => setIsCalendarOpen(true)} className="text-[#E61E4D] text-sm font-normal font-['Inter'] underline">{availableDates.length} open dates</button>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2">
                    <i className="ri-check-line text-[#E61E4D] text-lg"></i>
                    <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">Available for</div>
                  </div>
                  <button onClick={() => setShowInstantPopup(true)} className="px-3 py-1 bg-[#FFF1F2] rounded-2xl flex justify-start items-center gap-2">
                    <div className="text-black text-sm font-normal font-['Inter'] leading-tight">Edit</div>
                    <i className="ri-edit-box-line text-[#656565]"></i>
                  </button>
                </div>
                <div className="inline-flex justify-start items-center flex-wrap gap-2">
                  {additionalRates.map((event, i) => (
                    <div key={i} className="px-3 py-2 bg-[#F9F9F9] rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5">
                      <div className="text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">{event.label}</div>
                    </div>
                  ))}
                  {!additionalRates.length && <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">No availability specified</div>}
                </div>
              </div>
              <div className="self-stretch p-6 bg-white rounded-3xl flex flex-col justify-start items-center gap-3">
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                      <div className="self-stretch flex flex-col justify-start items-start gap-1">
                        <div className="inline-flex justify-start items-center gap-1">
                          <div className="text-[#292929] text-sm font-bold font-['Inter'] leading-tight">Hide Profile from Directory</div>
                          <i className="ri-eye-off-line text-[#656565] text-lg"></i>
                        </div>
                        <div className="self-stretch text-[#656565] text-xs font-normal font-['Inter'] leading-none">Hiding will limit your visibility to organizers</div>
                      </div>
                    </div>
                  </div>
                  <button onClick={toggleProfileVisibility} className={`w-12 h-6 relative rounded-full ${!isProfileVisible ? "bg-[#E61E4D]" : "bg-[#656565]"}`}>
                    <div className={`w-3 h-3 absolute top-[6px] ${!isProfileVisible ? "left-[27px]" : "left-[9px]"} bg-white rounded-full`} />
                  </button>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                      <div className="self-stretch flex flex-col justify-start items-start">
                        <div className="self-stretch text-[#292929] text-sm font-bold font-['Inter'] leading-tight">Turn Instant Book</div>
                      </div>
                    </div>
                  </div>
                  <button onClick={toggleInstantBook} className={`w-12 h-6 relative rounded-full ${isInstantBook ? "bg-[#E61E4D]" : "bg-[#656565]"}`}>
                    <div className={`w-3 h-3 absolute top-[6px] ${isInstantBook ? "left-[27px]" : "left-[9px]"} bg-white rounded-full`} />
                  </button>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch text-[#656565] text-sm font-medium font-['Inter'] leading-tight">Instant Booking Rate</div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 text-[#292929] text-sm font-bold font-['Inter'] leading-tight">Base Hourly Rate</div>
                      <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center">
                        <div className="text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">${hourlyRate}</div>
                      </div>
                    </div>
                    <button onClick={() => setShowInstantPopup(true)} className="">
                      <i className="ri-edit-box-line text-[#656565] font-semibold ml-2"></i>
                    </button>
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch inline-flex justify-start items-start gap-2">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch text-[#292929] text-sm font-bold font-['Inter'] leading-tight">Additional Rate Options</div>
                    <div className="self-stretch text-[#656565] text-xs font-normal font-['Inter'] leading-none">If you work different rates for different job types, add each.</div>
                  </div>
                  <button onClick={() => setIsAddRateOpen(true)} className="">
                    <i className="ri-edit-box-line text-[#656565] font-semibold ml-2"></i>
                  </button>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-2.5">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch text-[#292929] text-xl font-bold font-['Inter'] leading-normal">Job History</div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    {[
                      { label: "Event Completed", value: jobHistory.pastBookings, icon: <PiChampagneFill /> },
                      { label: "Cancels", value: jobHistory.cancelledBookings, icon: <FaHourglass /> },
                      { label: "No Shows", value: jobHistory.noShows, icon: <FaStar /> },
                    ].map((item, i) => (
                      <div key={i} className="self-stretch inline-flex justify-start items-center gap-2">
                        <div className="p-2 bg-[#FFF1F2] rounded-lg flex justify-start items-center gap-2.5">
                          <div className="text-lg text-[#E61E4D]">{item.icon}</div>
                        </div>
                        <div className="justify-start">
                          <span className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">{item.label}: </span>
                          <span className="text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showInstantPopup && (
        <div className="fixed inset-0 p-4 flex items-center justify-center z-50">
          <div className="p-6 bg-white rounded-2xl shadow-[0px_0px_231.1999969482422px_9px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-center items-start gap-4 overflow-hidden">
            <div className="self-stretch inline-flex justify-end items-center gap-2.5">
              <div className="flex-1 justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">Manage Instant Booking</div>
              <button onClick={() => setShowInstantPopup(false)} className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5">
                <i className="ri-close-line text-xl text-[#656565]"></i>
              </button>
            </div>
            <div className="w-full md:w-[517px] flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-[#656565] text-base font-bold font-['Inter'] leading-snug">Instant Booking Rate</div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">Base Hourly Rate</div>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => {
                        setHourlyRate(parseFloat(e.target.value) || 0);
                        setIsBaseRateModified(true);
                      }}
                      className="w-1/5 px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug"
                    />
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">Daily Rate</div>
                    <input
                      type="number"
                      value={staffdailyRate}
                      onChange={(e) => {
                        setStaffdailyRate(parseFloat(e.target.value) || 0);
                        setIsDailyRateModified(true);
                      }}
                      className="w-1/5 px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug"
                    />
                  </div>
                </div>
              </div>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-[#656565] text-base font-bold font-['Inter'] leading-snug">Rate By Services</div>
                  {additionalRates.map((item, index) => (
                    <div key={index} className="self-stretch inline-flex justify-between items-center gap-4">
                      <div className="flex-1 justify-start text-black text-sm font-bold font-['Inter'] leading-tight">{item.label}</div>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => {
                          const updated = [...additionalRates];
                          updated[index].amount = parseFloat(e.target.value) || 0;
                          setAdditionalRates(updated);
                          setIsBaseRateModified(true);
                        }}
                        min="0"
                        step="0.01"
                        className="w-1/4 px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']"
                      />
                      <button onClick={() => handleDeleteRate(index)}>
                        <i className="ri-subtract-line bg-[#656565] text-sm px-1 py-1 rounded-sm text-white"></i>
                      </button>
                    </div>
                  ))}
                  {additionalRates.length === 0 && (
                    <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">No additional rates set</div>
                  )}
                </div>
                {userDataError && <div className="text-red-500 text-sm">{userDataError}</div>}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveRate(false)} // Pass false to indicate not adding new
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setIsAddRateOpen(true);
                      setShowInstantPopup(false);
                    }}
                    className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden"
                  >
                    <div className="justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">Add New Service</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffSinglePage;