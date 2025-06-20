// 🎯 GOAL: Side popup on "View" button click showing detailed user info

import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URLS from "../config";

const UserSidebar = ({ userId, onClose, isCreate = false }) => {
    const [data, setData] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "organiser",
    city: "",
    state: "",
    country: "",
    profileImage: "",
    isActive: true,
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleInputChange = (e) => {
        const { id, name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [id || name]: value,
        }));
      };

  const handleCreateUser = async () => {
    try {
      await axios.post(`${BASE_URLS.BACKEND_BASEURL}user`, formData);
      alert("User Created Successfully ✅");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create user ❌");
    }
  };

  if (!user && !isCreate) return null;

  return (
    <div className="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto">
      <div className="flex justify-start gap-4 items-center px-6 py-4 border-b">
        <button onClick={onClose} className="text-gray-800 text-xl">
          <i class="ri-arrow-left-line"></i>
        </button>
        <h2 className="text-lg font-semibold">
          {isCreate ? "Create New User" : "User Details"}
        </h2>
      </div>
      <div className="p-6 space-y-6">
        {isCreate ? (
            <>
           <div className="bg-zinc-100 p-4 rounded-lg space-y-4">
           <h3 className="font-semibold">User Information</h3>
 
           <div className="flex justify-center">
             <label className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
               <span className="text-xs text-gray-600">Upload Photo</span>
               <input
                 type="file"
                 accept="image/*"
                 className="hidden"
                 onChange={(e) => {
                   const file = e.target.files[0];
                   // Optional: handle image preview or upload here
                 }}
               />
             </label>
           </div>
 
           <div className="space-y-3">
             <input
               type="text"
               placeholder="Enter the user's full name"
               name="name"
               value={data.name}
               onChange={handleInputChange}
               className="w-full px-3 py-2 text-sm border rounded"
             />
             <input
               type="email"
               placeholder="Enter email address"
               name="email"
               value={data.email}
               onChange={handleInputChange}
               className="w-full px-3 py-2 text-sm border rounded"
             />
             <input
               type="text"
               placeholder="Enter phone number"
               name="phone"
               value={data.phone}
               onChange={handleInputChange}
               className="w-full px-3 py-2 text-sm border rounded"
             />
             <input
               type="text"
               placeholder="Enter city"
               name="city"
               value={data.city}
               onChange={handleInputChange}
               className="w-full px-3 py-2 text-sm border rounded"
             />
           </div>
         </div>
 
         {/* Permissions */}
         <div className="bg-zinc-100 p-4 rounded-lg space-y-4">
           <h3 className="font-semibold">Permissions & Role Management</h3>
 
           <div className="space-y-2">
             <label className="text-sm font-medium">Current Role:</label>
             <select
               name="role"
               value={data.role}
               onChange={handleInputChange}
               className="px-3 py-2 text-sm border rounded w-full"
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
                   className="accent-pink-600"
                 />
                 {perm.label}
               </label>
             ))}
           </div>
         </div>
         </>
        ) : (
          <>
            {/* Basic Info */}
            <div className="flex flex-col bg-zinc-100 p-3 rounded-lg  gap-2">
              <h2 className="text-lg tracking-tighter font-semibold">
                Basic Details
              </h2>
              <div className="flex items-center gap-4">
                <img
                  src={user.profileImage || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full border border-gray-300"
                />
                <div className="flex  flex-col gap-1">
                  <span className="text-xs - capitalize font-normal text-gray-800">
                    Full Name :{" "}
                    <span className="font-semibold">{user.name}</span>
                  </span>
                  <span className="text-xs capitalize text-gray-600">
                    User Type :{" "}
                    <span className="font-semibold">{user.role}</span>
                  </span>
                  <span className="text-xs capitalize text-gray-600">
                    Location :{" "}
                    <span className="font-semibold">
                      {user.city}, {user.country}
                    </span>
                  </span>
                  <span className="text-xs capitalize text-gray-600">
                    Status :{" "}
                    <span
                      className={` text-xs ${
                        user.isActive ? " text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </span>
                </div>
              </div>
              <hr className="border-gray-700 border-1" />
              <div className="flex justify-end gap-2 items-center">
                <button className="bg-pink-600 text-white px-4 py-2 text-xs rounded-lg">
                  Suspend User
                </button>
                <button className="border-1 border-pink-600 text-pink-600 px-4 py-2 text-xs rounded-lg">
                  Delete User
                </button>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-zinc-100 p-3 flex flex-col gap-2 rounded-lg">
              <h2 className="text-lg font-semibold tracking-tighter mb-1">
                Contact & Account
              </h2>
              <span className="text-xs text-gray-700">
                Email: <span className="font-semibold">{user.email}</span>
              </span>
              <span className="text-xs text-gray-700">
                Phone: <span className="font-semibold">{user.phone}</span>
              </span>
              <span className="text-xs text-gray-700">
                User ID: <span className="font-semibold">{user._id}</span>
              </span>
              <span className="text-xs text-gray-700">
                Account Created :{" "}
                <span className="font-semibold">
                  {new Date(user.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>
              <hr className="border-gray-700 border-1" />
              <div className="flex justify-end gap-3 items-center">
                <button className="text-zinc-500 flex place-items-center gap-2  text-sm ">
                  View as User <i class="ri-eye-line"></i>
                </button>
                <button className="bg-pink-600 text-white px-4 py-2 text-xs rounded-lg">
                  Send Message
                </button>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-zinc-100 p-3 flex flex-col gap-2 rounded-lg">
              <h2 className="text-lg font-semibold tracking-tighter mb-2">
                Permissions & Role Management
              </h2>
              <span className="text-sm mb-3">
                Current Role :{" "}
                <span className="px-3 ml-2 py-1 text-xs capitalize rounded-full border-1 border-gray-400">
                  {user.role}
                </span>
              </span>
              <p className="text-sm font-semibold">Assigned Permissions</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.canAcceptBookings}
                    className="mr-2 accent-pink-600"
                    readOnly
                  />
                  <span>Accept bookings</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.canMessage}
                    className="mr-2 accent-pink-600"
                    readOnly
                  />
                  <span>Message users</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.canApply}
                    className="mr-2 accent-pink-600"
                    readOnly
                  />
                  <span>Apply Events</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.canSubmitReview}
                    className="mr-2 accent-pink-600"
                    readOnly
                  />
                  <span>Submit reviews</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.canPostEvents}
                    className="mr-2 accent-pink-600"
                    readOnly
                  />
                  <span>Post Events</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.isBoosted}
                    className="mr-2 accent-pink-600"
                    readOnly
                  />
                  <span>Post Events</span>
                </div>
              </div>
            </div>

            {/* Actions */}
          </>
        )}
      </div>
    </div>
  );
};

export default UserSidebar;
