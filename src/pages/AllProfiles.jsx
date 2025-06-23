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
  const [limit, setLimit] = useState(10); // Default limit
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}user`)
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch((err) => console.error(err));
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

    // ✅ Status Filter (assuming status isActive)
    if (statusFilter === "Active") {
      result = result.filter((u) => u.isActive === true);
    } else if (statusFilter === "Inactive") {
      result = result.filter((u) => u.isActive === false);
    }

    // 🕒 Last Login (mock filter: not implemented in API, adjust as needed)
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

  return (

    <div className=" ">  

    <div className=" bg-gray-50">

      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Profiles</h1>
          <button
            onClick={() => {
              setIsCreateMode(true);
              setSelectedUserId(null); // ensure no view mode active
            }}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Create New User
          </button>
        </div>

        {/* 🔍 Filters */}
        <div className="flex flex-wrap justify-between align-center gap-4 mb-6">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
            />
            <i className="ri-search-line bg-pink-300 px-2 bg-opacity-40 absolute left-1 top-1/2 transform -translate-y-1/2 text-pink-600 text-lg" />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <select
              className="border-1 border-gray-700 rounded-full px-2 py-2 text-xs"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">User Type</option>
              <option value="organiser">Organiser</option>
              <option value="staff">Staff</option>
              <option value="superadmin">Superadmin</option>
            </select>
            <select
              className="border-1 border-gray-700 rounded-full px-2 py-2 text-xs"
              value={lastLoginFilter}
              onChange={(e) => setLastLoginFilter(e.target.value)}
            >
              <option value="">Last Login</option>
              <option value="1 hr">1 Hour</option>
              <option value="24 hrs">24 Hours</option>
            </select>
            <select
              className="border-1 border-gray-700 rounded-full px-2 py-1 text-xs"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* 🧾 Table */}
        <div className="overflow-x-auto  rounded-lg  ">
          <table className="min-w-full table-auto text-[12px]">
            <thead className="bg-white text-gray-600 font-medium">
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full table-auto text-[12px]">
            <thead className="bg-gray-100 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox" />
                </th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Last Login</th>
                <th className="px-4 py-3 text-center">Automation</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr
                    key={u._id}

                    className="border-t hover:bg-white transition text-xs"

                    className="border-t hover:bg-gray-50 transition text-xs"

                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" />
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      {u.profileImage && (
                        <img
                          src={u.profileImage}
                          alt="profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="capitalize">{u.name}</span>
                    </td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      {u.city}, {u.state || u.country}
                    </td>

                    <td className="px-4 py-3 text-xs text-gray-500">
                    {u.lastLogin
    ? formatDistanceToNow(new Date(u.lastLogin), { addSuffix: true })
    : 'No Data'}
                      
                    </td>

                    <td className="px-4 py-3 text-gray-500">—</td>

                    <td className="px-4 py-3 text-center">
                      <select className="px-3 py-1 rounded-full border-1 border-pink-600 text-pink-600 text-xs">
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        {u?.isActive ? "Active" : "Inactive"}
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={u?.isActive}
                        />
                        <div
                          className={`w-11 h-6 rounded-full ${
                            u?.isActive ? "bg-pink-600" : "bg-gray-400"
                          } flex items-center px-1 transition-colors`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                              u?.isActive ? "translate-x-5" : ""
                            }`}
                          ></div>
                        </div>
                      </label>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedUserId(u._id)}
                        className="text-pink-600 border-1 border-pink-600 px-3 py-1 rounded-full hover:underline text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500">
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
          }}
          isCreate={isCreateMode} // 👈 pass new prop
        />
      )}
    </div>
  );
};

export default AllProfiles;
