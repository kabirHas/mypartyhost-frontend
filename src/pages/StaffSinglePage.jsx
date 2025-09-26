import React, { useState, useEffect, useRef } from "react";
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
  // const [isProfileVisible, setIsProfileVisible] = useState(true);
  const [isProfileVisible, setIsProfileVisible] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.isPublic ?? true;
  });



  const [isDailyBooking, setIsDailyBooking] = useState(true);
  const [isInstantBook, setIsInstantBook] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.instantBook ?? true;
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAddRateOpen, setIsAddRateOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showInstantPopup, setShowInstantPopup] = useState(false);
  const [additionalRates, setAdditionalRates] = useState([
    { label: "Beach Party", amount: 200 },
    { label: "Bikini Waitress", amount: 250 },
  ]);
  const [newService, setNewService] = useState("");
  const [newRate, setNewRate] = useState("");
  const [visibleReviews, setVisibleReviews] = useState(5);




  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [flagUrl, setFlagUrl] = useState("")
  const [location, setLocation] = useState("Loading...");
  const [name, setName] = useState("Loading...");
  const [bio, setBio] = useState("Loading;..")
  const [skills, setSkills] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableFor, setAvailableFor] = useState([]);

  const [hourlyRate, setHourlyRate] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.baseRate;
  });
  const [initialHourlyRate, setInitialHourlyRate] = useState(hourlyRate);
  const [isHourlyRateModified, setIsHourlyRateModified] = useState(false);

  const [staffdailyRate, setStaffdailyRate] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.dailyRate || 0;
  });

  const [initialStaffdailyRate, setInitialStaffdailyRate] = useState(staffdailyRate);
  const [isDailyRateModified, setIsDailyRateModified] = useState(false);

  const [serviceOptions, setServiceOptions] = useState([]);
  const [initialAdditionalRates, setInitialAdditionalRates] = useState([]);

  // Modal for BIO
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [editedBio, setEditedBio] = useState("");


  const [jobHistory, setJobHistory] = useState({
    completed: 0,
    cancelled: 0,
    noShows: 0, // Keep noShows as 0 or fetch if available
  });

  const [profileImage, setProfileImage] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.profileImage || "https://images.unsplash.com/photo-1536924430914-91f9e2041b83?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZWxzfGVufDB8fDB8fHww";
  });

  const fileInputRef = useRef(null);


  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select an image file.");
      return;
    }

    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validImageTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, or JPG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should not exceed 5MB.");
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userId = userInfo._id;
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        console.error("User not authenticated.");
        return;
      }

      // Fetch staff data to get the staff._id
      // const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}staff`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // const staff = response.data.data.find((u) => u._id === userId);

      // if (!staff) {
      //   return;
      // }

      const formData = new FormData();
      formData.append("profileImage", file);
      // formData.append("staffId", staff._id); // Include staffId in FormData

      const uploadResponse = await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}staff`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newImageUrl = uploadResponse.data.data?.profileImage || uploadResponse.data.profileImage;

      setProfileImage(newImageUrl);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...userInfo, profileImage: newImageUrl })
      );
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", {
        message: error.message,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
      });
      alert("Failed to update profile image. Please try again.");
    }
  };



  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        const userId = userInfo ? JSON.parse(userInfo)?._id : null;

        if (!userId) {
          console.error("No user ID found in localStorage");
          return;
        }

        // const response = await axios.get("https://mypartyhost.onrender.com/api/staff", {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // });
        // const staff = response.data.data.find(u => u._id === userId);

        const token = localStorage.getItem("token");
        const [staffResponse, bookingsResponse] = await Promise.all([
          axios.get(`${BASE_URLS.BACKEND_BASEURL}auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URLS.BACKEND_BASEURL}jobs/manage-bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("staffResponse:", staffResponse.data);

        const staff = staffResponse.data;

        if (staff && staff.user) {
          setProfileImage(staff.profileImage || profileImage);
          setPhotos(staff.photos || []);
          const staffReviews = staff.reviews || [];
          setReviews(staffReviews);
          const totalRating = staffReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
          const avg = staffReviews.length > 0 ? totalRating / staffReviews.length : 0;
          setAvgRating(avg.toFixed(1));
          setLocation(`${staff.city}, ${staff.country}`);
          setFlagUrl(staff.flag || "");
          setName(`${staff.name}` || "N/A");
          setBio(staff.bio);
          setSkills(staff.skills || []);
          setAvailableDates(staff.availableDates.map(date => date.split('T')[0]) || []);
          setAvailableFor(staff.availableFor || []);
          setHourlyRate(staff.baseRate || []);
          setInitialHourlyRate(staff.baseRate || []);

          setAdditionalRates(
            staff.additionalRates.map((rate) => ({
              label: rate.label,
              amount: rate.amount,
            })) || []
          );
          setInitialAdditionalRates(
            JSON.parse(
              JSON.stringify(
                staff.additionalRates.map((rate) => ({
                  label: rate.label,
                  amount: rate.amount,
                })) || []
              )
            )
          );

          setStaffdailyRate(staff.dailyRate || []);
          setIsProfileVisible(staff.isPublic ?? true);
          setIsInstantBook(staff.instantBook ?? true);
          // setServiceOptions(staff.skills || []);


          const allLabels = new Set();
          (staff.skills || []).forEach(skill => {
            allLabels.add(skill.title);
          });
          setServiceOptions([...allLabels].sort());

          setJobHistory({
            pastBookings: bookingsResponse.data.pastBookings?.length || 0,
            cancelledBookings: bookingsResponse.data.cancelledBookings?.length || 0,
            noShows: 0, // Static as per original code
          });
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };
    fetchStaffData();
  }, []);



  const [photos, setPhotos] = useState([]);
  const addPhotoInputRef = useRef(null);

  const handleAddPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select an image file.");
      return;
    }

    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validImageTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, or JPG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should not exceed 5MB.");
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userId = userInfo._id;
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        console.error("User not authenticated.");
        alert("Please log in to add a photo.");
        return;
      }

      const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // const staff = response.data.data.find((u) => u._id === userId);
      // if (!staff) {
      //   console.error("Staff profile not found for user ID:", userId);
      //   alert("Staff profile not found.");
      //   return;
      // }

      const formData = new FormData();
      formData.append("photos", file); // Changed from "photo" to "photos"
      // formData.append("staffId", staff._id);

      const uploadResponse = await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}staff`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedPhotos = uploadResponse.data.data?.photos || uploadResponse.data.photos || [];
      setPhotos(updatedPhotos);
      alert("Photo added successfully!");
    } catch (error) {
      console.error("Error adding photo:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert("Failed to add photo. Please try again.");
    }
  };


  const handleAddPhoto = () => {
    addPhotoInputRef.current.click();
  }


  const handleEditBio = () => {
    setEditedBio(bio); // Set current bio to edit
    setIsBioModalOpen(true);
  };

  // Add modal component for Bio
  const renderBioModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="w-[517px] p-6 bg-white rounded-2xl shadow-[0px_0px_231px_9px_rgba(0,0,0,0.2)] outline outline-1 outline-[#ECECEC] flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Edit Bio
              </div>
            </div>
            <button
              onClick={() => setIsBioModalOpen(false)}
              className="p-2 rounded-lg outline outline-1 outline-[#ECECEC] flex items-center gap-2.5"
            >
              <i className="ri-close-line text-xl text-[#656565]"></i>
            </button>
          </div>
          <textarea
            className="self-stretch h-40 p-3 outline outline-1 outline-offset-[-1px] outline-[#292929] resize-none"
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
          ></textarea>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsBioModalOpen(false)}
              className="px-4 py-2 rounded-lg outline outline-1 outline-[#ECECEC] text-[#656565] text-sm font-medium font-['Inter'] leading-tight"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBio}
              className="px-4 py-2 rounded-lg outline outline-1 outline-[#E61E4D] text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }; // end renderBioModal



  //   const handleSaveBio = async () => {
  //   try {
  //     const userInfo = localStorage.getItem("userInfo");
  //     const userId = userInfo ? JSON.parse(userInfo)?._id : null;
  //     const token = localStorage.getItem("token");

  //     if (!userId || !token) {
  //       console.error("User ID or token missing");
  //       alert("Please log in again to update your bio.");
  //       return;
  //     }

  //     const response = await axios.patch(
  //       `https://mypartyhost.onrender.com/api/staff`,
  //       { bio: editedBio },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setBio(editedBio); // Update local state
  //     setIsBioModalOpen(false); // Close modal
  //     console.log("Bio updated successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error updating bio:", error);
  //     alert("Failed to update bio. Please try again later."); // 
  //   }
  // }; 

  const handleSaveBio = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      const userId = userInfo ? JSON.parse(userInfo)?._id : null;
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        console.error("User ID or token missing");
        alert("Please log in again to update your bio.");
        return;
      }

      // // Fetch staff data to get the correct staff._id
      // const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}staff`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // console.log("API response for staff fetch:", response.data);
      // const staff = response.data.data.find(u => u._id === userId);
      // if (!staff) {
      //   console.error("Staff profile not found for user ID:", userId);
      //   alert("Staff profile not found.");
      //   return;
      // }

      await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}staff/`,
        { bio: editedBio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBio(editedBio);
      setIsBioModalOpen(false);
      console.log("Bio updated successfully");
    } catch (error) {
      console.error("Error updating bio:", error);
      alert("Failed to update bio. Please try again later.");
    }
  };



  // Modal for Skills
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkillTitle, setNewSkillTitle] = useState("");
  const [newSkillIcon, setNewSkillIcon] = useState("");
  const [newSkillPrice, setNewSkillPrice] = useState("");

  const renderSkillModal = () => {
    if (!isSkillModalOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="w-[517px] p-6 bg-white rounded-2xl shadow-[0px_0px_231px_9px_rgba(0,0,0,0.2)] outline outline-1 outline-[#ECECEC] flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Add New Skill
              </div>
              <div className="text-[#656565] text-base font-medium font-['Inter'] leading-snug">
                Enter skill details
              </div>
            </div>
            <button
              onClick={() => setIsSkillModalOpen(false)}
              className="p-2 rounded-lg outline outline-1 outline-[#ECECEC] flex items-center gap-2.5"
            >
              <i className="ri-close-line text-xl text-[#656565]"></i>
            </button>
          </div>
          <div className="self-stretch flex flex-col gap-4">
            <div className="self-stretch flex flex-col gap-2">
              <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">
                Skill Title
              </div>
              <input
                type="text"
                value={newSkillTitle}
                onChange={(e) => setNewSkillTitle(e.target.value)}
                placeholder="Enter skill title"
                className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']"
              />
            </div>
            <div className="self-stretch flex flex-col gap-2">
              <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">
                Icon Class (Remix Icon)
              </div>
              <input
                type="text"
                value={newSkillIcon}
                onChange={(e) => setNewSkillIcon(e.target.value)}
                placeholder="e.g., ri-billiards-line"
                className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']"
              />
            </div>
            {/* <RemixIconPicker/> */}
            <div className="self-stretch flex flex-col gap-2">
              <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">
                Price Per Hour ($)
              </div>
              <input
                type="number"
                value={newSkillPrice}
                onChange={(e) => setNewSkillPrice(e.target.value)}
                placeholder="Enter price per hour"
                className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsSkillModalOpen(false)}
                className="px-4 py-2 rounded-lg outline outline-1 outline-[#ECECEC] text-[#656565] text-sm font-medium font-['Inter'] leading-tight"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSkill}
                className="px-4 py-2 rounded-lg outline outline-1 outline-[#E61E4D] text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const handleSaveSkill = async () => {
    console.log("handleSaveSkill called");
    console.log("Input values:", { newSkillTitle, newSkillIcon, newSkillPrice });

    if (newSkillTitle && newSkillIcon && newSkillPrice && !isNaN(newSkillPrice) && newSkillPrice > 0) {
      try {
        const userInfo = localStorage.getItem("userInfo");
        const userId = userInfo ? JSON.parse(userInfo)?._id : null;
        const token = localStorage.getItem("token");

        console.log("meri id", userId);
        console.log("Token:", token ? "Present" : "Missing");

        if (!userId || !token) {
          console.error("User not authenticated. userId:", userId, "token:", token);
          alert("User not authenticated. Please log in.");
          return;
        }

        const newSkill = {
          icon: newSkillIcon,
          title: newSkillTitle,
          pricePerHour: parseFloat(newSkillPrice),
        };

        // Fetch staff data for the specific user
        // const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}staff`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // console.log("API response:", response.data);
        // const staff = response.data.data.find(u => u._id === userId);
        // if (!staff) {
        //   console.error("Staff profile not found for user ID:", userId);
        //   alert("Staff profile not found.");
        //   return;
        // }
        // console.log("Found staff:", staff);
        // const currentSkills = staff.skills || [];

        // Update skills array with new skill
        const updatedSkills = [...user.skills, newSkill];
        await axios.patch(
          `${BASE_URLS.BACKEND_BASEURL}staff`, // Changed endpoint
          { skills: updatedSkills }, // Include staffId in payload
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update local state
        setSkills(updatedSkills);
        setIsSkillModalOpen(false);
        setNewSkillTitle("");
        setNewSkillIcon("");
        setNewSkillPrice("");
        // alert("Skill added successfully!");
      } catch (error) {
        console.error("Error adding skill:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
        alert("Failed to add skill. Please try again.");
      }
    } else {
      console.log("Validation failed:", {
        newSkillTitle,
        newSkillIcon,
        newSkillPrice,
        isNaN: !isNaN(newSkillPrice),
        priceGtZero: newSkillPrice > 0,
      });
      alert("Please fill in all fields with valid data.");
    }
  };


  const handleSkillEdit = () => {
    setIsSkillModalOpen(true);
    setNewSkillTitle("");
    setNewSkillIcon("");
    setNewSkillPrice("");
  };



  const handleBack = () => {
    navigate(-1)
  };


  const handleAddVoiceNote = () => {
    alert("Add Voice Note clicked");
  };

  const handleViewMore = () => {
    setVisibleReviews((prev) => prev + 5);
  };

  const handleEdit = () => {
    setShowInstantPopup(!showInstantPopup);
  };

  // Modified Profile Public Visibility section
  const toggleProfileVisibility = async () => {
    const newVisibility = !isProfileVisible;
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userId = userInfo._id;
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("User not authenticated. userId:", userId, "token:", token);
      alert("Please log in to update profile visibility.");
      return;
    }

    try {
      const response = await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}staff`,
        { staffId: userId, isPublic: newVisibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsProfileVisible(newVisibility);
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, isPublic: newVisibility }));
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      console.log("Profile visibility updated:", newVisibility);
    } catch (error) {
      console.error("Error updating profile visibility:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert("Failed to update profile visibility. Please try again.");
    }
  };


  const toggleInstantBook = async () => {
    const newInstantBook = !isInstantBook;
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userId = userInfo._id;
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("User not authenticated. userId:", userId, "token:", token);
      alert("Please log in to update instant booking status.");
      return;
    }

    try {
      const response = await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}staff`,
        { staffId: userId, instantBook: newInstantBook },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsInstantBook(newInstantBook);
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, instantBook: newInstantBook }));
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      console.log("Instant booking updated:", newInstantBook);
    } catch (error) {
      console.error("Error updating instant booking:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert("Failed to update instant booking status. Please try again.");
    }
  };



  const handleHourlyRateChange = (e) => {
    const newRate = e.target.value;
    setHourlyRate(newRate);
    setIsHourlyRateModified(newRate !== String(initialHourlyRate));
  };

  const toggleDailyBooking = () => {
    setIsDailyBooking(!isDailyBooking);
  };



  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const toggleAddRate = () => {
    setShowInstantPopup(!showInstantPopup);
    setIsAddRateOpen(!isAddRateOpen);
    setNewService("");
    setNewRate("");
  };

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setAvailableDates((prev) =>
      prev.includes(dateString)
        ? prev.filter((d) => d !== dateString)
        : [...prev, dateString].sort((a, b) => new Date(a) - new Date(b))
    );
  };
  const handleSelectAll = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const allDates = [];
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d).toISOString().split("T")[0]);
    }
    setAvailableDates(allDates);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleUpdateAvailability = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userId = userInfo._id;
      const token = localStorage.getItem("token");
      if (!userId || !token) {
        console.error("User not authenticated.");
        // alert("Please log in to update availability."); 
        localStorage.clear();
        navigate("/login");
        return;
      }
      const response = await axios.patch(`${BASE_URLS.BACKEND_BASEURL}staff`, {
        availableDates: availableDates,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Availability updated:", response.data);
      // alert("Availability updated successfully!");
      // Optionally update localStorage if needed

      const updatedUserInfo = { ...userInfo, availableDates: availableDates };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      setIsCalendarOpen(false);
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability. Please try again.");
    }
  };






  const handleBaseRateChange = (e) => {
    const newRate = e.target.value;
    setStaffdailyRate(newRate);
    setIsDailyRateModified(newRate !== String(initialStaffdailyRate));
  };



  const handleSaveRate = async () => {
    if (isNaN(hourlyRate) || hourlyRate <= 0 || isNaN(staffdailyRate) || staffdailyRate <= 0) {
      alert("Please enter valid rates.");
      return;
    }
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userId = userInfo._id;
      const token = localStorage.getItem("token");
      if (!userId || !token) {
        console.error("User not authenticated.");
        alert("Please log in to update rates.");
        return;
      }
      const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const staff = response.data.data.find((u) => u._id === userId);
      if (!staff) {
        console.error("Staff profile not found for user ID:", userId);
        alert("Staff profile not found.");
        return;
      }
      const updatedData = {
        baseRate: parseFloat(hourlyRate),
        dailyRate: parseFloat(staffdailyRate),
        additionalRates: additionalRates.map((rate) => ({
          label: rate.label,
          amount: rate.amount,
        })),
      };
      console.log("Data being sent to API:", updatedData);
      await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}staff`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInitialHourlyRate(updatedData.baseRate);
      setInitialStaffdailyRate(updatedData.dailyRate);
      setInitialAdditionalRates([...updatedData.additionalRates]);
      setIsHourlyRateModified(false);
      setIsDailyRateModified(false);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...userInfo,
          baseRate: updatedData.baseRate,
          dailyRate: updatedData.dailyRate,
          additionalRates: updatedData.additionalRates,
        })
      );
      alert("Rates updated successfully!");
    } catch (error) {
      console.error("Error saving rates:", error);
      alert("Failed to save rates. Please try again.");
    }
  };




  // Update isModified to include daily rate changes
  const isAdditionalModified =
    JSON.stringify(
      initialAdditionalRates.map(item => ({ label: item.label, amount: item.amount }))
    ) !==
    JSON.stringify(
      additionalRates.map(item => ({ label: item.label, amount: item.amount }))
    );
  const isModified = isHourlyRateModified || isDailyRateModified || isAdditionalModified;



  const handleDeleteRate = async (index) => {
    const updatedRates = additionalRates.filter((_, i) => i !== index);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userId = userInfo._id;
      const token = localStorage.getItem("token");
      if (!userId || !token) {
        console.error("User not authenticated.");
        alert("Please log in to update rates.");
        return;
      }
      const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const staff = response.data.data.find(u => u._id === userId);
      if (!staff) {
        console.error("Staff profile not found for user ID:", userId);
        alert("Staff profile not found.");
        return;
      }
      await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}staff`,
        { additionalRates: updatedRates },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdditionalRates(updatedRates);
      localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, additionalRates: updatedRates }));
      alert("Rate deleted successfully!");
    } catch (error) {
      console.error("Error deleting rate:", error);
      alert("Failed to delete rate. Please try again.");
    }
  };


  const renderCalendar = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    const days = [];

    const prevMonthDays = startDay === 0 ? 6 : startDay;
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    const totalDays = days.length;
    const nextMonthDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
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
                {/* {selectedDates.length} Date Selected */}
                {availableDates.length} Date Selected

              </div>
            </div>
            <button
              onClick={toggleCalendar}
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
                {currentMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button onClick={handleNextMonth} className="relative">
                <i className="ri-arrow-right-s-line text-xl text-[#3D3D3D]"></i>
              </button>
            </div>
            <div className="h-0 outline outline-1 outline-[#ECECEC]"></div>
            <div className="flex justify-between items-center">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div
                  key={day}
                  className="flex-1 px-1 md:px-2 py-1 flex justify-center items-center"
                >
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
                    const isToday =
                      day.date.toDateString() === new Date().toDateString();
                    return (
                      <button
                        key={dateString}
                        onClick={() =>
                          day.isCurrentMonth && handleDateClick(day.date)
                        }
                        className={`flex-1 h-8 md:p-3 p-1  rounded ${day.isCurrentMonth
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
              <button
                onClick={handleSelectAll}
                className="px-2 py-1 bg-[#FFF1F2] rounded-lg outline outline-1 outline-[#3D3D3D] flex items-center gap-2"
              >
                <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                  Select All
                </div>
                <i className="ri-check-line text-[#3D3D3D]"></i>
              </button>
              <button
                onClick={() => setAvailableDates([])}
                className="px-2 py-1 bg-[#FFF1F2] rounded-lg outline outline-1 outline-[#3D3D3D] flex items-center gap-2"
              >
                <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                  Clear All
                </div>
                <i className="ri-close-line text-[#3D3D3D]"></i>
              </button>
            </div>
          </div>
          <button className="px-6 py-3 cursor-pointer w-fit rounded-lg outline outline-1 outline-[#E61E4D] flex justify-center items-center gap-2">
            <div onClick={handleUpdateAvailability} className="text-[#E61E4D]  text-base font-medium font-['Inter'] leading-snug">
              Update Availability
            </div>
            <i className="ri-calendar-check-line text-[#E61E4D]"></i>
          </button>
        </div>
      </div>
    );
  };

  const renderAddRateModal = () => {
    return (
      <div className="md:w-[517px] p-6 bg-white rounded-2xl shadow-[0px_0px_231px_9px_rgba(0,0,0,0.2)] outline outline-1 outline-[#ECECEC] flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              Add New Rate
            </div>
            <div className="text-[#656565] text-base font-medium font-['Inter'] leading-snug">
              Select a service and set its rate
            </div>
          </div>
          <button
            onClick={toggleAddRate}
            className="p-2 rounded-lg outline outline-1 outline-[#ECECEC] flex items-center gap-2.5"
          >
            <i className="ri-close-line text-xl text-[#656565]"></i>
          </button>
        </div>
        <div className="self-stretch flex flex-col gap-4">
          <div className="self-stretch flex flex-col gap-2">
            <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">
              Service
            </div>
            <select
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']"
            >
              <option value="" disabled>
                Select a service
              </option>
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          <div className="self-stretch flex flex-col gap-2">
            <div className="text-[#656565] text-base font-bold font-['Inter'] leading-snug">
              Rate ($/hour)
            </div>
            <input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="Enter rate"
              className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              // onClick={toggleAddRate}
              onClick={() => {
                setIsAddRateOpen(false);
                setNewService("");
                setNewRate("");
              }}
              className="px-4 py-2 rounded-lg outline outline-1 outline-[#ECECEC] text-[#656565] text-sm font-medium font-['Inter'] leading-tight"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRate}
              //  onClick={() => {
              //   if (newService && newRate && !isNaN(newRate) && newRate > 0) {
              //     const newRateObj = { label: newService, amount: parseFloat(newRate) };
              //     setAdditionalRates([...additionalRates, newRateObj]);
              //     setNewService("");
              //     setNewRate("");
              //     setIsAddRateOpen(false);
              //     setShowInstantPopup(true); // Reopen Manage Instant Booking to show the new rate
              //   } else {
              //     alert("Please select a service and enter a valid rate.");
              //   }
              // }}
              className="px-4 py-2 rounded-lg outline outline-1 outline-[#E61E4D] text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="self-stretch bg-[#fafafa] w-full px-4 md:px-12 pt-20 pb-40 flex flex-col justify-center items-center gap-2.5">
      {isCalendarOpen && (
        <div className="fixed inset-0 p-4 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {renderCalendar()}
        </div>
      )}
      {isAddRateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {renderAddRateModal()}
        </div>
      )}
      <div className="w-full max-w-[1200px] flex flex-col justify-start gap-6">
        <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
          <button
            onClick={handleBack}
            className="px-3 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2"
          >
            <i className="ri-arrow-left-s-line text-xl text-[#656565]"></i>
            <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
              Back
            </div>
          </button>
        </div>
        <div className="w-full max-w-[1200px] flex justify-start items-start gap-12">
          <div className="flex w-full gap-6 flex-col md:flex-row">
            <div className="self-stretch flex w-full md:w-1/2 flex-col gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                <div className="self-stretch md:h-[630px] relative rounded-lg overflow-hidden bg-gray-200">
                  <img
                    className="w-full h-full object-fill"
                    src={profileImage}
                    alt=""
                  />
                  <label htmlFor="profileImageInput" className="p-2 right-[30px] top-[27px] absolute bg-white rounded-lg inline-flex justify-start items-center gap-2.5">
                    {/* <i className="ri-search-line text-xl text-[#3f3f3f]"></i> */}
                    <i class="ri-camera-line text-3xl text-[#3f3f3f]"></i>
                  </label>
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-1.5">
                  <div className="flex-1 h-28 flex justify-start items-start gap-2">
                    <img
                      className="flex-1 w-16 h-full object-cover object-top rounded-lg"
                      src={photos[0]}
                      alt="Thumbnail 1"
                    />
                    <img
                      className="flex-1 w-16 h-full object-cover object-top rounded-lg"
                      src={photos[1]}
                      alt="Thumbnail 2"
                    />
                  </div>
                  <div className="flex-1 h-28 flex justify-start items-start gap-2">
                    <img
                      className="flex-1 w-16 h-full object-cover object-top rounded-lg"
                      src={photos[2]}
                      alt="Thumbnail 3"
                    />
                    <img
                      className="flex-1 w-16 h-full object-cover object-top rounded-lg"
                      src={photos[3]}
                      alt="Thumbnail 4"
                    />
                  </div>
                  <input
                    id="addPhotoInput"
                    type="file"
                    accept="image/*"
                    ref={addPhotoInputRef}
                    onChange={handleAddPhotoUpload}
                    className="hidden"
                  />
                </div>
                <button
                  onClick={handleAddPhoto}
                  className="px-3 py-1 bg-[#FFF1F2] rounded-2xl inline-flex justify-start items-center gap-2"
                >
                  <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
                    Add Photo
                  </div>
                  {/* <i className="ri-add-line text-xl text-[#656565]"></i> */}
                  <i class="ri-camera-line text-2xl text-[#3f3f3f]"></i>
                </button>
                <button
                  onClick={handleAddVoiceNote}
                  className="px-3 py-1 bg-[#FFF1F2] rounded-2xl inline-flex justify-start items-center gap-2"
                >
                  <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
                    Add Voice Note
                  </div>
                </button>
              </div>
              <div className="self-stretch md:h-fit p-4 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#F9F9F9] flex flex-col justify-start items-start gap-6">
                <div className="inline-flex justify-start items-center gap-2">
                  <div className="flex justify-start items-center gap-2">
                    <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                      Reviews
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <i className="ri-star-s-fill text-orange-500"></i>
                      <div className="justify-start text-orange-500 text-sm font-medium font-['Inter'] leading-tight">
                        {avgRating}/5
                      </div>
                    </div>
                    {/* <button
                      onClick={handleViewMore}
                      className="justify-start text-[#656565] text-sm font-medium font-['Inter'] underline leading-tight"
                    >
                      ({reviews.length} Reviews)
                    </button> */}
                    <div className="justify-start text-[#656565] text-sm font-medium font-['Inter'] underline leading-tight">
                      ({reviews.length} Reviews)
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  {reviews.slice(0, 3).map((review, index) => (
                    <div className="self-stretch pb-4 border-b border-[#ECECEC] flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch inline-flex justify-start items-start gap-3">
                        <img
                          className="w-12 h-12 rounded-full"
                          src="https://images.unsplash.com/photo-1613991917225-836ecf204c77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D"
                          alt="Reviewer"
                        />
                        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                            {review.reviewerName || "Anonymous"}
                          </div>
                          <div className="inline-flex justify-start items-start gap-1.5">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`ri-star-s-fill ${i < review.rating ? "text-orange-500" : "text-gray-300"}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        {review.comment || "No comment provided."}
                      </div>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      No reviews yet.
                    </div>
                  )}
                </div>
                {reviews.length > visibleReviews && (
                  <button
                    onClick={handleViewMore}
                    className="justify-start my-4 text-[#E61E4D] text-base font-bold font-['Inter'] leading-snug"
                  >
                    View More
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="flex justify-start flex-col md:flex-row items-center gap-4">
                    <div className="flex justify-start items-center gap-2">
                      <div className="flex justify-start items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`ri-star-s-fill ${i < Math.floor(avgRating) ? "text-orange-500" : "text-gray-300"}`}
                          ></i>
                        ))}
                        {avgRating % 1 !== 0 && (
                          <i
                            className={`ri-star-s-fill text-orange-500 opacity-50`}
                            style={{ clipPath: `inset(0 ${100 - (avgRating % 1) * 100}% 0 0)` }}
                          ></i>
                        )}
                        {/* {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className="ri-star-s-fill text-orange-500"
                          ></i>
                        ))} */}
                        <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                          {avgRating}/5
                        </div>
                      </div>
                      <button
                        onClick={handleViewMore}
                        className="justify-start text-[#292929] text-base font-medium font-['Inter'] underline leading-snug"
                      >
                        {/* (120 Reviews) */}
                        ({reviews.length} Reviews)
                      </button>
                    </div>
                    <div className="w-0 h-2 hidden md:block outline outline-1 outline-offset-[-0.50px] outline-[#656565]"></div>
                    <div className="flex justify-start items-center gap-2">
                      {/* <i className="ri-flag-2-fill text-[#3D3D3D]"></i> */}
                      {flagUrl && (
                        <img src={flagUrl} alt="Flag" className="w-22 h-8 md:w-10 md:h-6" />
                      )}
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        {/* Sydney, NSW */}

                        {location || "N/A"}
                      </div>
                    </div>
                  </div>
                  {isBioModalOpen && renderBioModal()}
                  <div className="self-stretch flex flex-col justify-start items-start gap-3">
                    <div className="capitalize self-stretch justify-start text-[#292929] text-6xl font-bold font-['Inter'] leading-[60.60px]">
                      {/* Samantha Lee */}
                      {name}
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-[#292929] text-sm font-medium font-['Inter'] leading-tight">
                          About Me
                        </div>
                        <button onClick={handleEditBio} className="w-4 h-4">
                          <i className="ri-edit-box-line text-[#656565]"></i>
                        </button>
                      </div>
                      <textarea
                        className="self-stretch h-40 p-3 outline outline-1 outline-offset-[-1px] outline-[#292929] resize-none"
                        value={bio}
                        readOnly
                      ></textarea>
                    </div>
                  </div>
                </div>


                {isSkillModalOpen && renderSkillModal()}
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                      Top Skills
                    </div>
                    <button onClick={handleSkillEdit} className="w-4 h-4">
                      <i className="ri-edit-box-line text-[#656565]"></i>
                    </button>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-end gap-3 flex-wrap">
                    {skills.length > 0 ? (
                      skills.map((skill, i) => (
                        <div
                          key={i}
                          className="inline-flex flex-col justify-center items-center gap-2"
                        >
                          <div className="w-8 h-8 flex items-center justify-center rounded-2xl outline outline-dotted outline-1 outline-offset-[-1px] outline-[#656565]">
                            <i className={skill.icon || "ri-vip-crown-line text-[#3D3D3D]"}></i>
                          </div>
                          <div className="text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-tight">
                            {skill.title}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[#656565] text-xs font-normal font-['Inter'] leading-tight">
                        No skills available
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl inline-flex justify-start items-center gap-4">
                <div className="flex-1 flex justify-between items-center">
                  <div className="text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                    Profile Public Visibility
                  </div>
                  <button
                    onClick={toggleProfileVisibility}
                    className={`w-12 h-6 relative rounded-full ${isProfileVisible ? "bg-[#E61E4D]" : "bg-[#656565]"
                      }`}
                  >
                    <div
                      className={`w-3 h-3 absolute top-[6px] ${isProfileVisible ? "left-[27px]" : "left-[9px]"
                        } bg-white rounded-full`}
                    />
                  </button>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
                <div className="inline-flex justify-start items-center gap-2">
                  <i className="ri-money-dollar-circle-line text-[#E61E4D] text-xl"></i>
                  <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                    Rates
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                      Base Hourly Rate
                    </div>
                    <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5">
                      <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        ${hourlyRate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="flex-1 text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                      Are You Available for Daily Bookings
                    </div>
                    <button
                      onClick={toggleDailyBooking}
                      className={`w-12 h-6 relative rounded-full ${isDailyBooking ? "bg-[#E61E4D]" : "bg-[#656565]"
                        }`}
                    >
                      <div
                        className={`w-3 h-3 absolute top-[6px] ${isDailyBooking ? "left-[27px]" : "left-[9px]"
                          } bg-white rounded-full`}
                      />
                    </button>
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                        Daily Rate
                      </div>
                      <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5">
                        <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          ${staffdailyRate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
                <div className="inline-flex justify-start items-center gap-2">
                  <i className="ri-calendar-line text-[#E61E4D] text-xl"></i>
                  <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                    Available Dates
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  {availableDates.length > 0 ? (
                    <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      {new Date(availableDates[0]).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} –{" "}
                      {new Date(availableDates[availableDates.length - 1]).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </div>
                  ) : (
                    <div className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      No available dates
                    </div>
                  )}
                  <button
                    onClick={toggleCalendar}
                    className="text-[#E61E4D] text-sm font-normal font-['Inter'] underline"
                  >
                    {availableDates.length} open dates
                  </button>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2">
                    <i className="ri-check-line text-[#E61E4D] text-lg"></i>
                    <div className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                      Available for
                    </div>
                  </div>
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-[#FFF1F2] rounded-2xl flex justify-start items-center gap-2"
                  >
                    <div className="text-black text-sm font-normal font-['Inter'] leading-tight">
                      Edit
                    </div>
                    <i className="ri-edit-box-line text-[#656565]"></i>
                  </button>
                </div>

                <div className="inline-flex justify-start items-center gap-2">
                  {availableFor.length > 0 ? (
                    availableFor.map((event, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 bg-[#F9F9F9] rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5"
                      >
                        <div className="text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          {event}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                      No availability specified
                    </div>
                  )}
                </div>
              </div>

              <div className="self-stretch p-6 bg-white rounded-3xl flex flex-col justify-start items-center gap-3">
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                      <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch flex flex-col justify-start items-start gap-1">
                          <div className="inline-flex justify-start items-center gap-1">
                            <div className="text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                              Hide Profile from Directory
                            </div>
                            <i className="ri-eye-off-line text-[#656565] text-lg"></i>
                          </div>
                          <div className="self-stretch text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Hiding will limit your visibility to organizers
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggleProfileVisibility}
                    className={`w-12 h-6 relative rounded-full ${!isProfileVisible ? "bg-[#E61E4D]" : "bg-[#656565]"
                      }`}
                  >
                    <div
                      className={`w-3 h-3 absolute top-[6px] ${!isProfileVisible ? "left-[27px]" : "left-[9px]"
                        } bg-white rounded-full`}
                    />
                  </button>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                      <div className="self-stretch flex flex-col justify-start items-start">
                        <div className="self-stretch text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                          Turn Instant Book
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <button
                    onClick={toggleInstantBook}
                    className={`w-12 h-6 relative rounded-full ${
                      isInstantBook ? "bg-[#E61E4D]" : "bg-[#656565]"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 absolute top-[6px] ${
                        isInstantBook ? "left-[27px]" : "left-[9px]"
                      } bg-white rounded-full`}
                    />
                  </button> */}
                  <button
                    onClick={toggleInstantBook}
                    className={`w-12 h-6 relative rounded-full ${isInstantBook ? "bg-[#E61E4D]" : "bg-[#656565]"
                      }`}
                  >
                    <div
                      className={`w-3 h-3 absolute top-[6px] ${isInstantBook ? "left-[27px]" : "left-[9px]"
                        } bg-white rounded-full`}
                    />
                  </button>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                    Instant Booking Rate
                  </div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <div className="flex-1 flex justify-start items-center gap-2">
                      <div className="flex-1 text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                        Base Hourly Rate
                      </div>
                      <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5">
                        <div className="text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                          ${hourlyRate}
                        </div>
                      </div>
                    </div>
                    <button onClick={handleEdit} className="">
                      <i className="ri-edit-box-line text-[#656565] font-semibold ml-2"></i>
                    </button>
                  </div>
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                <div className="self-stretch inline-flex justify-start items-start gap-2">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                      Additional Rate Options
                    </div>
                    <div className="self-stretch text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                      If you work different rates for different job types, add
                      each.
                    </div>
                  </div>
                  <button onClick={toggleAddRate} className="">
                    <i className="ri-edit-box-line text-[#656565] font-semibold ml-2"></i>
                  </button>
                </div>
              </div>
              <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-2.5">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                    Job History
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    {/* {[
                      { label: "Event Completed", value: "100" , icon: <PiChampagneFill /> },
                      { label: "Cancels", value: "2" , icon: <FaHourglass /> },
                      { label: "No Shows", value: "1" , icon: <FaStar />  },
                    ].map((item, i) => ( */}
                    {[
                      { label: "Event Completed", value: jobHistory.pastBookings, icon: <PiChampagneFill /> }, { label: "Cancels", value: jobHistory.cancelledBookings, icon: <FaHourglass /> },
                      { label: "No Shows", value: jobHistory.noShows, icon: <FaStar /> },].map((item, i) => (
                        <div
                          key={i}
                          className="self-stretch inline-flex justify-start items-center gap-2"
                        >
                          <div className="p-2 bg-[#FFF1F2] rounded-lg flex justify-start items-center gap-2.5">
                            {/* <i className="ri-goblet-fill text-[#E61E4D]"></i> */}
                            <div className="text-lg text-[#E61E4D]">{item.icon}</div>
                          </div>
                          <div className="justify-start">
                            <span className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                              {item.label}:{" "}
                            </span>
                            <span className="text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                              {item.value}
                            </span>
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
              <div className="flex-1 justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Manage Instant Booking
              </div>
              <button
                onClick={handleEdit}
                className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5"
              >
                <i className="ri-close-line text-xl text-[#656565]"></i>
              </button>
            </div>
            <div className="w-full md:w-[517px] flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-[#656565] text-base font-bold font-['Inter'] leading-snug">
                  Instant Booking Rate
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                      Base Hourly Rate
                    </div>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={handleHourlyRateChange} className="w-1/5 px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5" />
                    {/* <input
                          type="number"
                          value={baseRate}
                          onChange={handleBaseRateChange} className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug"/>
                         </div> */}
                  </div>
                </div>
                {/* <div className="self-stretch inline-flex justify-start items-center gap-1">
                  <div className="flex-1 flex justify-start items-center gap-2">
                    <div className="flex-1 justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                      Base Hourly Rate
                    </div>
                    <div className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5">
                      <div className="justify-end text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                         $150 
                        ${hourlyRate}
                        <input
                        type="number"
                        value={hourlyRate}
                        onChange={handleHourlyRateChange} className="w-1/5 px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center gap-2.5"/>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-[#656565] text-base font-bold font-['Inter'] leading-snug">
                    Rate By Services
                  </div>
                  {additionalRates.map((item, index) => (
                    <div
                      key={index}
                      className="self-stretch inline-flex justify-between items-center gap-4"
                    >
                      <div className="flex-1 justify-start text-black text-sm font-bold font-['Inter'] leading-tight">
                        {item.label}
                        {/* {item.service} */}
                      </div>
                      <div className="flex justify-start items-center gap-2">
                        {/* <div className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center"> */}
                        <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          {/* ${item.amount} */}
                          {/* ${item.rate} */}
                        </div>
                      </div>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => {
                          const newAmount = parseFloat(e.target.value) || 0;
                          const updatedRates = [...additionalRates];
                          updatedRates[index] = { ...item, amount: newAmount };
                          setAdditionalRates(updatedRates);
                          setIsHourlyRateModified(true); // Trigger modification flag
                        }}
                        className="w-1/4 px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#292929] flex justify-center items-center" />
                      <button onClick={() => handleDeleteRate(index)}>
                        <i className="ri-subtract-line bg-[#656565] text-sm px-1 py-1 rounded-sm text-white"></i>
                      </button>
                      {/* </div> */}
                    </div>
                  ))}
                </div>
                <button
                  // onClick={isModified ? handleSaveRate : toggleAddRate}
                  // onClick={toggleAddRate}
                  onClick={isModified ? handleSaveRate : toggleAddRate}
                  className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden"
                >
                  <div className="justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                    {isModified ? "Save" : "Add New"}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffSinglePage;
