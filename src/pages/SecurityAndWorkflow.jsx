import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URLS from "../config";

const Security = () => {
  const [adminData, setAdminData] = useState(null);
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageActivities, setCurrentPageActivities] = useState(1);
  const itemsPerPage = 5;

  // Helper function to format timestamps
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to export data to CSV
  const exportToCSV = (data, filename, headers, dataMapper) => {
    const csvRows = [];
    // Add headers
    csvRows.push(headers.join(","));
    // Add data rows
    data.forEach((item) => {
      const row = dataMapper(item).map((value) =>
        `"${value.toString().replace(/"/g, '""')}"`
      );
      csvRows.push(row.join(","));
    });
    // Create CSV string
    const csvString = csvRows.join("\n");
    // Create downloadable link
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export functions for each table
  const exportUsersToCSV = () => {
    if (!adminData || adminData.length === 0) return;
    exportToCSV(
      adminData,
      "login_history.csv",
      ["Name", "Last Login", "IP"],
      (user) => [user.name, formatDate(user.lastLogin), user.ip || "N/A"]
    );
  };

  const exportActivitiesToCSV = () => {
    if (!activity || activity.length === 0) return;
    exportToCSV(
      activity,
      "system_activities.csv",
      ["Date", "Activity"],
      (act) => [formatDate(act.createdAt), act.metadata.log]
    );
  };

  const fetchActivityData = () => {
    setIsLoading(true);
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}admin/admin-history`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setAdminData(response.data.users);
        setActivity(response.data.activities);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching activity data:", error);
        setError("Failed to fetch activity data");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchActivityData();
  }, []);

  // Pagination logic
  const totalPagesUsers = adminData ? Math.ceil(adminData.length / itemsPerPage) : 1;
  const totalPagesActivities = activity ? Math.ceil(activity.length / itemsPerPage) : 1;

  const paginatedUsers = adminData
    ? adminData.slice(
        (currentPageUsers - 1) * itemsPerPage,
        currentPageUsers * itemsPerPage
      )
    : [];
  const paginatedActivities = activity
    ? activity.slice(
        (currentPageActivities - 1) * itemsPerPage,
        currentPageActivities * itemsPerPage
      )
    : [];

  const handlePageChangeUsers = (page) => {
    if (page >= 1 && page <= totalPagesUsers) {
      setCurrentPageUsers(page);
    }
  };

  const handlePageChangeActivities = (page) => {
    if (page >= 1 && page <= totalPagesActivities) {
      setCurrentPageActivities(page);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="self-stretch flex flex-col justify-start items-start gap-8 w-100%">
        <div className=" flex flex-col justify-start items-start gap-1">
          <h2 className="self-stretch justify-start text-[#292929] text-4xl font-bold font-['Inter'] leading-10">
            Security & Backup
          </h2>
          <p className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
            Mange Platform security and Backup
          </p>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          <div className="self-stretch inline-flex justify-start gap-8">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-between items-center">
                <h3 className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  Log in History
                </h3>
                <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                  <button
                    onClick={exportUsersToCSV}
                    className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="self-stretch bg-[#FFFFFF] rounded-2xl outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-center items-start overflow-hidden">
                <div className="flex-1 inline-flex flex-col justify-start items-end">
                  <div className="self-stretch px-3 py-2 border-b border-[#656565] inline-flex justify-center items-center gap-2.5">
                    <div className="flex-1 justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      Admin
                    </div>
                  </div>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <div
                        key={user._id}
                        className="self-stretch h-12 px-3 py-2 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3"
                      >
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{
                            backgroundImage: user.profileImage
                              ? `url(${user.profileImage})`
                              : "none",
                            backgroundColor: user.profileImage ? "transparent" : "zinc-300",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          {user.name}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="self-stretch h-12 px-3 py-2 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                      <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        No users found
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-48 self-stretch inline-flex flex-col justify-start items-end">
                  <div className="self-stretch px-3 py-2 border-b border-[#3D3D3D] inline-flex justify-center items-center gap-2.5">
                    <div className="flex-1 justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      Last Login
                    </div>
                  </div>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <div
                        key={user._id}
                        className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3"
                      >
                        <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          {formatDate(user.lastLogin)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                      <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        N/A
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-start items-end">
                  <div className="self-stretch px-3 py-2 border-b border-[#3D3D3D] inline-flex justify-center items-center gap-2.5">
                    <div className="flex-1 justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      IP
                    </div>
                  </div>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <div
                        key={user._id}
                        className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3"
                      >
                        <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          {user.ip || "N/A"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                      <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        N/A
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Pagination for Log in History */}
              {totalPagesUsers > 1 && (
                <div className="self-stretch flex justify-end items-center gap-2 mt-4">
                  <button
                    onClick={() => handlePageChangeUsers(currentPageUsers - 1)}
                    disabled={currentPageUsers === 1}
                    className={`px-3 py-1 rounded-lg text-sm font-medium font-['Inter'] leading-tight ${
                      currentPageUsers === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#E61E4D] hover:bg-[#E61E4D] hover:text-white"
                    }`}
                  >
                    Previous
                  </button>
                  {/* {[...Array(totalPagesUsers)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChangeUsers(index + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium font-['Inter'] leading-tight ${
                        currentPageUsers === index + 1
                          ? "bg-[#E61E4D] text-white"
                          : "text-[#E61E4D] hover:bg-[#E61E4D] hover:text-white"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))} */}
                  <button
                    onClick={() => handlePageChangeUsers(currentPageUsers + 1)}
                    disabled={currentPageUsers === totalPagesUsers}
                    className={`px-3 py-1 rounded-lg text-sm font-medium font-['Inter'] leading-tight ${
                      currentPageUsers === totalPagesUsers
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#E61E4D] hover:bg-[#E61E4D] hover:text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-between items-center">
                <h3 className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  Recent System Activities
                </h3>
                <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                  <button
                    onClick={exportActivitiesToCSV}
                    className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="self-stretch h-fit bg-[#FFFFFF] rounded-2xl outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-center items-start overflow-hidden">
                <div className="w-54 self-stretch inline-flex flex-col justify-start items-end">
                  <div className="self-stretch px-3 py-2 border-b border-[#3D3D3D] inline-flex justify-center items-center gap-2.5">
                    <div className="flex-1 justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      IP
                    </div>
                  </div>
                  {paginatedActivities.length > 0 ? (
                    paginatedActivities.map((act) => (
                      <div
                        key={act._id}
                        className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3"
                      >
                        <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          {/* {formatDate(act.createdAt)} */}
                          {act.ip}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                      <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        No activities found
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-start items-end">
                  <div className="self-stretch px-3 py-2 border-b border-[#3D3D3D] inline-flex justify-center items-center gap-2.5">
                    <div className="flex-1 justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      Activity
                    </div>
                  </div>
                  {paginatedActivities.length > 0 ? (
                    paginatedActivities.map((act) => (
                      <div
                        key={act._id}
                        className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-end items-center gap-3"
                      >
                        <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          {act.metadata.log.split("on ")[0] || act.metadata.log} on {formatDate(act.metadata.log.split("on ")[1]) || "N/A"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-end items-center gap-3">
                      <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        No activities found
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Pagination for Recent System Activities */}
              {totalPagesActivities > 1 && (
                <div className="self-stretch flex justify-end items-center gap-2 mt-4">
                  <button
                    onClick={() => handlePageChangeActivities(currentPageActivities - 1)}
                    disabled={currentPageActivities === 1}
                    className={`px-3 py-1 rounded-lg text-sm font-medium font-['Inter'] leading-tight ${
                      currentPageActivities === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#E61E4D] hover:bg-[#E61E4D] hover:text-white"
                    }`}
                  >
                    Previous
                  </button>
                  {/* {[...Array(totalPagesActivities)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChangeActivities(index + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium font-['Inter'] leading-tight ${
                        currentPageActivities === index + 1
                          ? "bg-[#E61E4D] text-white"
                          : "text-[#E61E4D] hover:bg-[#E61E4D] hover:text-white"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))} */}
                  <button
                    onClick={() => handlePageChangeActivities(currentPageActivities + 1)}
                    disabled={currentPageActivities === totalPagesActivities}
                    className={`px-3 py-1 rounded-lg text-sm font-medium font-['Inter'] leading-tight ${
                      currentPageActivities === totalPagesActivities
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#E61E4D] hover:bg-[#E61E4D] hover:text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="self-stretch inline-flex justify-start gap-8">
            <div className="w-[500px] p-4 bg-[#FFFFFF] rounded-2xl outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-4">
              <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Backup & Restore
              </h3>
              <div className="self-stretch inline-flex justify-start items-start gap-6">
                <div className="w-47% inline-flex flex-col justify-start items-start gap-2">
                  <h4 className="self-stretch justify-start text-[#3D3D3D] text-sm font-bold font-['Inter'] leading-tight">
                    Last Backup
                  </h4>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                      <div className="inline-flex justify-start items-center gap-1">
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          Date:
                        </div>
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          April 20, 2025
                        </div>
                      </div>
                      <div className="inline-flex justify-start items-center gap-1">
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          Time:
                        </div>
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          06:00 AM
                        </div>
                      </div>
                      <div className="self-stretch inline-flex justify-start items-center gap-1">
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          Status:
                        </div>
                        <div className="justify-start text-green-700 text-sm font-normal font-['Inter'] leading-tight">
                          Completed Successfully
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
                      <div className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                        Restore Last Backup
                      </div>
                    </button>
                  </div>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <h4 className="self-stretch justify-start text-[#3D3D3D] text-sm font-bold font-['Inter'] leading-tight">
                    Next Scheduled Backup
                  </h4>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                      <div className="inline-flex justify-start items-center gap-1">
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          Date:
                        </div>
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          April 21, 2025
                        </div>
                      </div>
                      <div className="inline-flex justify-start items-center gap-1">
                        <div className="flex justify-start items-center gap-1">
                          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Time:
                          </div>
                          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            06:00 AM
                          </div>
                        </div>
                      </div>
                      <div className="inline-flex justify-start items-center gap-1">
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          Backup Frequency:
                        </div>
                        <div className="p-1 rounded-[48px] outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-1">
                          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Weekly
                          </div>
                          <i className="ri-arrow-down-s-line text-zinc-800"></i>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg outline-1 border-1 outline-offset-[-1px] border-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden">
                      <div className="justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                        Initiate Manual Backup
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 h-56 relative bg-gradient-to-b from-rose-600/20 to-black/20 rounded-2xl outline-1 outline-offset-[-1px] outline-[#ECECEC] backdrop-blur-[5px] overflow-hidden">
              <div className="left-[132px] top-[97px] absolute inline-flex flex-col justify-start items-center gap-2">
                <h3 className="justify-start text-black text-2xl font-bold font-['Inter'] leading-7">
                  Other Necessary Info
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Security;