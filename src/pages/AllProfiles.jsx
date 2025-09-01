import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URLS from "../config";
import UserSidebar from "../components/UserSIdebar";
import { formatDistanceToNow } from "date-fns";

const AllProfiles = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [lastLoginFilter, setLastLoginFilter] = useState("");
  const [limit, setLimit] = useState(10);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [error, setError] = useState(""); // For error messages

  const fetchUsers = () => {
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    // 🔍 Search
    if (search.trim()) {
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u._id?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 👤 Role Filter
    if (roleFilter) {
      result = result.filter((u) => u.role === roleFilter);
    }

    // ✅ Status Filter
    if (statusFilter === "Active") {
      result = result.filter((u) => u.isActive === true);
    } else if (statusFilter === "Inactive") {
      result = result.filter((u) => u.isActive === false);
    }

    // 🕒 Last Login
    if (lastLoginFilter === "1 hr") {
      result = result.filter(
        (u) => Date.now() - new Date(u.lastLogin).getTime() < 3600000
      );
    } else if (lastLoginFilter === "24 hrs") {
      result = result.filter(
        (u) => Date.now() - new Date(u.lastLogin).getTime() < 86400000
      );
    }

    // Apply limit
    result = result.slice(0, limit);

    setFilteredUsers(result);
  }, [search, roleFilter, statusFilter, lastLoginFilter, users, limit]);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}admin/edit-user/${userId}`,
        {
          isActive: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 Send token
          },
        }
      );

      // Update frontend
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: !currentStatus } : u
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className=" ">
      <div className="max-w-[1400px] p-2 mx-auto">
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}
        <div className="flex gap-4 justify-between items-center mb-6">
          <div className="w-3/4">
            <h1 className="self-stretch justify-start text-[#292929] text-3xl font-bold font-['Inter'] leading-10">
              All Profiles
            </h1>
            <p className="self-stretch justify-start text-zinc-500 text-base font-normal font-['Inter'] leading-snug">
              Manage every user profile on your platform. Quickly search,
              filter, and perform bulk actions to keep your community up to
              date.
            </p>
          </div>
          <button
            onClick={() => {
              setIsCreateMode(true);
              setSelectedUserId(null);
            }}
            className="px-6 py-3 bg-gradient-to-l text-base font-medium font-['Inter'] leading-snug text-white from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden"
          >
            Create New User
          </button>
        </div>

        {/* 🔍 Filters */}
        <div className="flex flex-wrap justify-between align-center gap-4 mb-6">
          <div className="relative bg-white rounded-lg w-full sm:w-1/3 pr-3 bg-zinc-100 rounded-LG outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-3 overflow-hidden">
            <div className="p-2 bg-pink-100 flex justify-start items-center">
              <svg
                className="w-8 h-8 text-[#E61E4D]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 32 32"
              >
                <circle cx="14" cy="14" r="8" />
                <line x1="20.07" y1="20.07" x2="24" y2="24" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or user ID..."
              className="w-full bg-transparent text-zinc-500 text-sm font-normal font-['Inter'] leading-tight focus:outline-none py-2"
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="relative inline-flex items-center">
              <select
                className="px-3 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none pr-10"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">User Type</option>
                <option value="organiser">Organiser</option>
                <option value="staff">Staff</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <div className="absolute right-2 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i className="ri-arrow-down-s-line"></i>
                </div>
              </div>
            </div>
            <div className="relative inline-flex items-center">
              <select
                className="px-4 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none pr-10"
                value={lastLoginFilter}
                onChange={(e) => setLastLoginFilter(e.target.value)}
              >
                <option value="">Last Login</option>
                <option value="1 hr">1 Hour</option>
                <option value="24 hrs">24 Hours</option>
              </select>
              <div className="absolute right-1 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i className="ri-arrow-down-s-line text-Token-Text-Secondary text-lg" />
                </div>
              </div>
            </div>
            <div className="relative inline-flex items-center">
              <select
                className="px-3 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none pr-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="absolute right-2 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i className="ri-arrow-down-s-line text-Token-Text-Secondary text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🧾 Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full border-collapse border-1 text-xs">
            <thead className="text-left text-gray-600 bg-white">
              <tr>
                <th className="px-6 py-3 border-1 border-zinc-200 w-12 text-sm font-medium font-['Inter'] leading-tight">
                  <input type="checkbox" />
                </th>
                <th className="px-6 py-3 border-1 border-zinc-200 w-48 text-xs font-medium font-['Inter'] leading-tight">
                  Name
                </th>
                <th className="px-6 py-3 border-1 border-zinc-200 w-32 text-xs font-medium font-['Inter'] leading-tight">
                  Type
                </th>
                <th className="px-6 py-3 border-1 border-zinc-200 w-32 text-xs font-medium font-['Inter'] leading-tight">
                  Location
                </th>
                <th className="px-6 py-3 border-1 border-zinc-200 w-32 text-xs font-medium font-['Inter'] leading-tight">
                  Last Login
                </th>
                <th className="px-6 py-3 border-1 border-zinc-200 w-32 text-center text-xs font-medium font-['Inter'] leading-tight">
                  Automation
                </th>
                <th className="px-6 py-3 border-1 border-zinc-200 w-32 text-center text-xs font-medium font-['Inter'] leading-tight">
                  Status
                </th>
                <th className="px-6 py-3 border-1 border-zinc-200 w-32 text-center text-xs font-medium font-['Inter'] leading-tight">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="text-xs text-gray-800 border-b-[1.2px] border-gray-900 hover:bg-gray-50 last:border-b-0"
                  >
                    <td className="px-4 border-r border-zinc-200 py-4">
                      <input type="checkbox" />
                    </td>
                    <td className="px-6 border-r border-zinc-200 py-4 text-xs font-semibold flex items-center gap-3">
                      <img
                        src={
                          u.profileImage ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7csvPWMdfAHEAnhIRTdJKCK5SPK4cHfskow&s"
                        }
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="capitalize">{u.name}</span>
                    </td>
                    <td className="px-6 border-r text-xs border-zinc-200 py-4 capitalize">
                      {u.role}
                    </td>
                    <td className="px-6 border-r border-zinc-200 py-4">
                      {u.city}, {u.state || u.country}
                    </td>
                    <td className="px-6 border-r border-zinc-200 py-4 text-xs text-gray-500">
                      {u.lastLogin
                        ? formatDistanceToNow(new Date(u.lastLogin), {
                            addSuffix: true,
                          })
                        : "No Data"}
                    </td>
                    <td className="px-6 border-r border-zinc-200 py-4 text-center">
                      <div className="relative inline-flex items-center">
                        <select className="px-4 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-gray-600 text-sm font-medium font-['Inter'] leading-tight appearance-none pr-10">
                          <option>Option 1</option>
                          <option>Option 2</option>
                          <option>Option 3</option>
                        </select>
                        <div className="absolute right-2 pointer-events-none">
                          <div className="w-5 h-5 relative flex items-center justify-center">
                            <i className="ri-arrow-down-s-line text-gray-600 text-lg" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 border-r border-zinc-200 py-4 text-center flex items-center justify-center">
                      <span className="text-zinc-500 mr-2">
                        {u?.isActive ? "Active" : "Inactive"}
                      </span>

                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={u?.isActive}
                            onChange={() =>
                              handleToggleStatus(u._id, u.isActive)
                            } // 👈 Fix
                          />
                          <div
                            className={`w-11 h-6 rounded-full ${
                              u?.isActive ? "bg-[#E61E4D]" : "bg-gray-400"
                            } flex items-center px-1 transition-colors`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                u?.isActive ? "translate-x-5" : ""
                              }`}
                            ></div>
                          </div>
                        </div>
                      </label>
                    </td>
                    <td className="px-6 border-r border-zinc-200 py-4 text-center">
                      <button
                        onClick={() => setSelectedUserId(u._id)}
                        className="border-[1px] no-underline border-[#e61e4c] text-zinc-600 rounded-full px-4 py-2 hover:bg-[#e61e4c] hover:text-white transition text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* 📊 Footer */}
        <div className="mt-4 text-sm text-gray-600">
          Showing
          <select
            className="border-1 border-gray-700 rounded-full px-1 py-1 text-xs ml-2"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={users.length}>All</option>
          </select>{" "}
          of {users.length}{" "}
        </div>
      </div>
      {(selectedUserId || isCreateMode) && (
        <UserSidebar
          userId={selectedUserId}
          onClose={() => {
            setSelectedUserId(null);
            setIsCreateMode(false);
            fetchUsers();
          }}
          isCreate={isCreateMode}
        />
      )}
    </div>
  );
};

export default AllProfiles;