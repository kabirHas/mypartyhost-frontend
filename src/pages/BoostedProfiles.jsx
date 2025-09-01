import React, { useEffect, useState } from "react";
import { RiSearchLine, RiArrowDownSLine } from "react-icons/ri";
import UserSidebar from "../components/UserSIdebar";
import BoostSidebar from "../components/BoostSidebar";
import axios from "axios";
import BASE_URLS from "../config";

const UserTable = ({ users, handleToggle, setSelectedUserId }) => {
  console.log("Users", users);
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

const PendingRequestsPopup = ({ pendingUsers, onClose, handleApprove }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
            Pending Boost Requests
          </h2>
          <button onClick={onClose} className="text-[#3D3D3D] text-xl">
            <i className="ri-close-line"></i>
          </button>
        </div>
        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
          {pendingUsers.length === 0 ? (
            <p className="text-[#3D3D3D] text-sm font-normal font-['Inter'] text-center">
              No pending requests
            </p>
          ) : (
            pendingUsers.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-3 border-b border-[#ECECEC] last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <img
                    className="w-6 h-6 rounded-full"
                    src={user.image}
                    alt={user.name}
                  />
                  <span className="text-[#292929] text-sm font-medium font-['Inter'] leading-tight">
                    {user.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <button
                    onClick={() => handleApprove(user.id)}
                    className="px-4 py-2 border-[1px] border-[#E61E4D] text-[#E61E4D] rounded-lg text-xs font-medium font-['Inter'] leading-tight hover:bg-[#D81B60]"
                  >
                    Cancel
                  </button> */}
                  <button
                    onClick={() => handleApprove(user.id)}
                    className="px-4 py-2 bg-[#E61E4D] text-white rounded-lg text-xs font-medium font-['Inter'] leading-tight hover:bg-[#D81B60]"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const BoostedProfiles = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    activeBoosts: 0,
    pendingApproval: 0,
    totalRevenue: 0,
    averageCtr: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [boostedData, setBoostedData] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [showPendingPopup, setShowPendingPopup] = useState(false); // New state for popup

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URLS.BACKEND_BASEURL}boost/all-boost-profiles`
      );
      const boostedData = response.data;
      setBoostedData(boostedData);
      console.log("Fetched boosted data:", boostedData);

      const transformedUsers = boostedData.boostedProfiles.map(
        (profile, index) => {
          const pendingPayment = boostedData.pendingPayments.find(
            (payment) =>
              payment.userId.name.toLowerCase() ===
              profile.username.toLowerCase()
          );
          return {
            id: profile.id,
            name: profile.username,
            email: pendingPayment
              ? pendingPayment.userId.email
              : `${profile.username
                  .replace(/\s+/g, ".")
                  .toLowerCase()}@example.com`,
            image: profile.profileImage,
            boostPlan: profile.boostPlan,
            totalViews: profile.totalViews,
            clicks: profile.totalClicks,
            ctr: `${profile.ctrPercent}%`,
            totalCost: `$${profile.totalCost}`,
            bookings: profile.bookedJobs,
            isActive: profile.isBoosted,
            status: profile.isBoosted ? "Active" : "Inactive",
            isApproved: profile.isBoosted,
          };
        }
      );
      console.log("Transformed Users", transformedUsers);
      setUsers(transformedUsers);

      const uniquePlans = [
        ...new Set(
          boostedData.boostedProfiles.map((profile) => profile.boostPlan)
        ),
      ];
      setAvailablePlans(uniquePlans);

      setStats({
        activeBoosts: boostedData.activeBoost,
        pendingApproval: boostedData.pendingPayments
          ? boostedData.pendingPayments.length
          : 0,
        totalRevenue: boostedData.boostRevenue.totalEarnings,
        averageCtr: parseFloat(boostedData.averageCTR),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedUserId]);

  const handleToggle = (userId, currentIsActive) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              isActive: !currentIsActive,
              status: !currentIsActive ? "Active" : "Inactive",
            }
          : user
      )
    );
    setStats((prev) => ({
      ...prev,
      activeBoosts: !currentIsActive
        ? prev.activeBoosts + 1
        : prev.activeBoosts - 1,
    }));
  };

  const handleApprove = async (userId) => {
    try {
      // Find the user to get their name for matching with pendingPayments
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      // Find the corresponding pending payment
      const pendingPayment = boostedData.pendingPayments.find(
        (payment) =>
          payment.userId.name.toLowerCase() === user.name.toLowerCase()
      );
      if (!pendingPayment) return;

      // Make API call to approve the boost
      await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}boost/payment/approve/${pendingPayment._id}`,
        { userId: pendingPayment.userId._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, isApproved: true, status: "Active", isActive: true }
            : u
        )
      );
      setStats((prev) => ({
        ...prev,
        pendingApproval: prev.pendingApproval - 1,
        activeBoosts: prev.activeBoosts + 1,
      }));
      setBoostedData((prev) => ({
        ...prev,
        pendingPayments: prev.pendingPayments.filter(
          (payment) => payment.userId._id !== pendingPayment.userId._id
        ),
      }));
    } catch (error) {
      console.error("Error approving boost:", error);
    }
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
    boostedData && (
      <div className="self-stretch relative inline-flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <h1 className="self-stretch text-[#292929] text-4xl font-bold font-['Inter'] leading-10">
              Boosted Profiles
            </h1>
            <p className="self-stretch text-[#292929] text-base font-normal font-['Inter'] leading-snug">
              Manage and track all promoted profiles, monitor performance, and
              control boost settings efficiently.
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
                        +{boostedData.approvedGrowthPercent}%
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
                      onClick={() => setShowPendingPopup(true)}
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
                    {boostedData.boostRevenue.totalEarnings
                      ? `$${boostedData.boostRevenue.totalEarnings}`
                      : "N/A"}
                  </span>
                  <div className="w-28 flex justify-start items-center gap-1">
                    <div className="p-1 bg-green-600 rounded-3xl flex justify-center items-center gap-2.5">
                      <span className="text-white text-xs font-normal font-['Inter'] leading-none">
                        +{boostedData.boostRevenue.earningsGrowth}%
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
                    {boostedData.averageCTR}%
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
                        {availablePlans.map((plan) => (
                          <option key={plan} value={plan}>
                            {plan}
                          </option>
                        ))}
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
          user={boostedData.boostedProfiles.find((user) => user.id === selectedUserId)}
            onClose={() =>{
              setSelectedUserId(null);
              fetchData(); // Refresh data when sidebar is closed
            }}
          />
        )}
        {showPendingPopup && (
          <PendingRequestsPopup
            pendingUsers={users.filter((u) => u.status === "Pending")}
            onClose={() => setShowPendingPopup(false)}
            handleApprove={handleApprove}
          />
        )}
      </div>
    )
  );
};

export default BoostedProfiles;
