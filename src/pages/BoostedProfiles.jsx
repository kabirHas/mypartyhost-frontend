import React, { useState } from "react";
import { RiSearchLine, RiArrowDownSLine } from "react-icons/ri";
import UserSidebar from "../components/UserSIdebar"; // UserSidebar component (from artifact ID: 2ebe23bc-0a64-4e3d-9b87-705348b1b085)
import BoostSidebar from "../components/BoostSidebar";
// UserTable component (from artifact ID: 2ebe23bc-0a64-4e3d-9b87-705348b1b085)
const UserTable = ({ users, handleToggle, setSelectedUserId }) => {
  return (
    <table className="w-full rounded-2xl border border-[#ECECEC] ">
      <thead>
        <tr className="bg-[#FFFFFF]">
          <th className="w-48 p-3 border-r not-last:border-[#ECECEC] border-[#ECECEC] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight text-center">
            User Name
          </th>
          <th className="p-3 border-r border-[#ECECEC] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight text-center">
            Boost Plan
          </th>
          <th className="p-3 border-r border-[#ECECEC] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight text-center">
            Total Views
          </th>
          <th className="p-3 border-r border-[#ECECEC] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight text-center">
            Clicks
          </th>
          <th className="p-3 border-r border-[#ECECEC] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight text-center">
            CTR Click (%)
          </th>
          <th className="p-3 border-r border-[#ECECEC] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight text-center">
            Total Cost
          </th>
          <th className="p-3 border-r border-[#ECECEC] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight text-center">
            Bookings Generated
          </th>
          <th className="p-3 border-r border-[#ECECEC] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight text-center">
            Status
          </th>
          <th className="p-3 border-r border-[#ECECEC] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight text-center">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="border-b border-[#656565] hover:bg-gray-50 last:border-b-0"
          >
            <td className="w-48 px-3 py-6 border-r border-gray-200">
              <div className="flex justify-start items-center gap-2">
                <img
                  className="w-6 h-6 rounded-full"
                  src={user.image}
                  alt={user.name}
                />
                <span className="text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                  {user.name}
                </span>
              </div>
            </td>
            <td className="px-3 py-6 border-r border-gray-200 text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight text-center">
              {user.boostPlan}
            </td>
            <td className="px-3 py-6 border-r border-gray-200 text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight text-center">
              {user.totalViews.toLocaleString()}
            </td>
            <td className="px-3 py-6 border-r border-gray-200 text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight text-center">
              {user.clicks}
            </td>
            <td className="px-3 py-6 border-r border-gray-200 text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight text-center">
              {user.ctr}
            </td>
            <td className="px-3 py-6 border-r border-gray-200 text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight text-center">
              {user.totalCost}
            </td>
            <td className="px-3 py-6 border-r border-gray-200 text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight text-center">
              {user.bookings}
            </td>
            <td className="px-3 py-6 border-r border-gray-200">
              <div className="flex justify-center items-center gap-2.5">
                <span className="text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                  {user.status}
                </span>
                {user.status !== "Pending" && (
                  <label className="relative inline-block w-10 h-6">
                    <input
                      type="checkbox"
                      checked={user.isActive}
                      onChange={() => handleToggle(user.id, user.isActive)}
                      className="opacity-0 w-0 h-0"
                    />
                    <span
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                        user.isActive ? "bg-[#E61E4D]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 bg-[#F9F9F9] w-4 h-4 rounded-full transition-transform duration-200 transform ${
                          user.isActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </span>
                  </label>
                )}
              </div>
            </td>
            <td className="px-3 py-6 border-r border-gray-200">
              <button
                onClick={() => setSelectedUserId(user.id)}
                className="px-6 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#FE6E85] text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight"
              >
                Manage
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// BoostedProfiles component
const BoostedProfiles = () => {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Emily Roberts",
      email: "emily.roberts@example.com",
      image: "https://placehold.co/24x24",
      boostPlan: "7-Day",
      totalViews: 1200,
      clicks: 110,
      ctr: "9.2%",
      totalCost: "$50",
      bookings: 8,
      isActive: true,
      status: "Active",
      isApproved: true,
    },
    {
      id: "2",
      name: "Sarah Smith",
      email: "sarah.smith@example.com",
      image: "https://placehold.co/24x24",
      boostPlan: "14-Day",
      totalViews: 950,
      clicks: 80,
      ctr: "8.4%",
      totalCost: "$100",
      bookings: 5,
      isActive: true,
      status: "Active",
      isApproved: true,
    },
    {
      id: "3",
      name: "Olivia Parker",
      email: "olivia.parker@example.com",
      image: "https://placehold.co/24x24",
      boostPlan: "30-Day",
      totalViews: 3500,
      clicks: 370,
      ctr: "10.6%",
      totalCost: "$150",
      bookings: 25,
      isActive: true,
      status: "Active",
      isApproved: true,
    },
    {
      id: "4",
      name: "Emma Taylor",
      email: "emma.taylor@example.com",
      image: "https://placehold.co/24x24",
      boostPlan: "7-Day",
      totalViews: 800,
      clicks: 60,
      ctr: "7.5%",
      totalCost: "$50",
      bookings: 3,
      isActive: true,
      status: "Active",
      isApproved: true,
    },
    {
      id: "5",
      name: "Liam Johnson",
      email: "liam.johnson@example.com",
      image: "https://placehold.co/24x24",
      boostPlan: "14-Day",
      totalViews: 600,
      clicks: 50,
      ctr: "8.3%",
      totalCost: "$80",
      bookings: 4,
      isActive: false,
      status: "Pending",
      isApproved: false,
    },
    {
      id: "6",
      name: "Sophia Brown",
      email: "sophia.brown@example.com",
      image: "https://placehold.co/24x24",
      boostPlan: "7-Day",
      totalViews: 500,
      clicks: 40,
      ctr: "8.0%",
      totalCost: "$60",
      bookings: 2,
      isActive: false,
      status: "Pending",
      isApproved: false,
    },
    {
      id: "7",
      name: "James Wilson",
      email: "james.wilson@example.com",
      image: "https://placehold.co/24x24",
      boostPlan: "30-Day",
      totalViews: 2000,
      clicks: 180,
      ctr: "9.0%",
      totalCost: "$120",
      bookings: 10,
      isActive: false,
      status: "Pending",
      isApproved: false,
    },
    {
      id: "8",
      name: "Ava Davis",
      email: "ava.davis@example.com",
      image: "https://placehold.co/24x24",
      boostPlan: "14-Day",
      totalViews: 700,
      clicks: 55,
      ctr: "7.9%",
      totalCost: "$90",
      bookings: 3,
      isActive: false,
      status: "Pending",
      isApproved: false,
    },
  ]);
  const [stats, setStats] = useState({
    activeBoosts: 200,
    pendingApproval: 4,
    totalRevenue: 2300,
    averageCtr: 8.5,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleToggle = (userId, currentIsActive) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, isActive: !currentIsActive, status: !currentIsActive ? "Inactive" : "Active" }
          : user
      )
    );
    setStats((prev) => ({
      ...prev,
      activeBoosts: !currentIsActive ? prev.activeBoosts + 1 : prev.activeBoosts - 1,
    }));
    // alert("User status updated successfully ✅");
  };

  const handleApprove = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, isApproved: true, status: "Active", isActive: true }
          : user
      )
    );
    setStats((prev) => ({
      ...prev,
      pendingApproval: prev.pendingApproval - 1,
      activeBoosts: prev.activeBoosts + 1,
    }));
    // alert("User boost approved successfully ✅");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.includes(searchQuery);
    const matchesPlan = filterPlan ? user.boostPlan === filterPlan : true;
    const matchesStatus = filterStatus ? user.status === filterStatus : true;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="self-stretch relative inline-flex flex-col justify-start items-start gap-2.5 ">
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="w-full  flex flex-col justify-start items-start gap-2">
          <h1 className="self-stretch text-[#292929] text-4xl font-bold font-['Inter'] leading-10">
            Boosted Profiles
          </h1>
          <p className="self-stretch text-[#292929] text-base font-normal font-['Inter'] leading-snug">
            Manage and track all promoted profiles, monitor performance, and control boost settings efficiently.
          </p>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
          <div className="self-stretch inline-flex justify-start items-center gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px] p-4 bg-[#FFFFFF] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-6">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <span className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Total Active Boosts
                </span>
              </div>
              <div className="self-stretch inline-flex justify-start items-center gap-2">
                <span className="text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                  {stats.activeBoosts}
                </span>
                <div className="flex justify-start items-center gap-1">
                  <div className="p-1 bg-green-600 rounded-3xl flex justify-center items-center gap-2.5">
                    <span className="text-white text-xs font-normal font-['Inter'] leading-none">
                      +2%
                    </span>
                  </div>
                  <span className="text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                    vs. last month
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] p-4 bg-[#FFFFFF] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-6">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <span className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Pending Approval
                </span>
              </div>
              <div className="self-stretch inline-flex justify-start items-center gap-2">
                <span className="text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                  {stats.pendingApproval}
                </span>
                <div className="flex-1 flex justify-end items-center gap-1">
                  <button
                    onClick={() => {
                      const pendingUsers = users.filter((u) => u.status === "Pending");
                      if (pendingUsers.length > 0) handleApprove(pendingUsers[0].id);
                    }}
                    className="text-[#E61E4D] text-sm font-medium font-['Inter'] underline leading-tight"
                    disabled={stats.pendingApproval === 0}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] p-4 bg-[#FFFFFF] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-6">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <span className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Total Revenue from Boosts
                </span>
              </div>
              <div className="self-stretch inline-flex justify-start items-center gap-2">
                <span className="text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                  ${stats.totalRevenue.toLocaleString()}
                </span>
                <div className="w-28 flex justify-start items-center gap-1">
                  <div className="p-1 bg-green-600 rounded-3xl flex justify-center items-center gap-2.5">
                    <span className="text-white text-xs font-normal font-['Inter'] leading-none">
                      +2%
                    </span>
                  </div>
                  <span className="flex-1 text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                    vs. previous month
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] p-4 bg-[#FFFFFF] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-6">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <span className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Average CTR
                </span>
              </div>
              <div className="self-stretch inline-flex justify-start items-center gap-2">
                <span className="text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                  {stats.averageCtr}%
                </span>
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <h2 className="self-stretch text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              Boosted Profiles List
            </h2>
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-4">
                <div className="relative bg-white rounded-lg w-full sm:w-1/3 pr-3 bg-zinc-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-pink-100 flex justify-start items-center">
                    <RiSearchLine className="w-8 h-8 text-[#E61E4D]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, email, or user ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-zinc-500 text-sm font-normal font-['Inter'] leading-tight focus:outline-none py-2"
                  />
                </div>
                <div className="flex justify-start items-center gap-4">
                  <div className="relative inline-flex items-center">
                    <select
                      value={filterPlan}
                      onChange={(e) => setFilterPlan(e.target.value)}
                      className="px-4 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight appearance-none pr-10"
                    >
                      <option value="">All Plans</option>
                      <option value="7-Day">7-Day</option>
                      <option value="14-Day">14-Day</option>
                      <option value="30-Day">30-Day</option>
                    </select>
                    <div className="absolute right-1 pointer-events-none">
                      <RiArrowDownSLine className="w-5 h-5 text-[#656565]" />
                    </div>
                  </div>
                  <div className="relative inline-flex items-center">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight appearance-none pr-10"
                    >
                      <option value="">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <div className="absolute right-1 pointer-events-none">
                      <RiArrowDownSLine className="w-5 h-5 text-[#656565]" />
                    </div>
                  </div>
                </div>
              </div>
              <UserTable
                users={filteredUsers}
                handleToggle={handleToggle}
                setSelectedUserId={setSelectedUserId}
              />
            </div>
          </div>
        </div>
      </div>
      {selectedUserId && (
        <BoostSidebar
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

export default BoostedProfiles;