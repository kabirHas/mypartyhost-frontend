import React, { useRef, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "../asset/css/AdminDashboard.css";
import axios from "axios";
import BASE_URLS from "../config";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

// Center text plugin for Doughnut chart
const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart, args, options) => {
    const { width, height, ctx } = chart;
    ctx.restore();
    const fontSize = (height / 120).toFixed(2);
    ctx.font = `bold ${fontSize}em Inter, sans-serif`;
    ctx.textBaseline = "middle";
    const text =
      options.totalEarnings >= 0
        ? `$${options.totalEarnings.toFixed(2)}`
        : "$0.00";
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;
    ctx.fillStyle = "#000";
    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

// Register the plugin globally
ChartJS.register(centerTextPlugin);

const addLegendSpacing = {
  id: "addLegendSpacing",
  beforeInit(chart) {
    const fitValue = chart.legend.fit;
    chart.legend.fit = function () {
      fitValue.call(this);
      this.height += 20;
    };
  },
};

const AdminDashboard = () => {
  const chartRef = useRef(null);
  const [userGrowthData, setUserGrowthData] = useState({
    labels: [],
    datasets: [],
  });
  const [growthData, setGrowthData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [isRevenueLoading, setIsRevenueLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Helper function to calculate relative time
  const getRelativeTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  };

  // Generate labels for the user growth chart
  const generateLabels = useMemo(
    () => (range) => {
      const now = new Date();
      if (range === "weekly") {
        const labels = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          labels.push(
            date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          );
        }
        return labels;
      } else if (range === "yearly") {
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      } else {
        const daysInMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        ).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);
      }
    },
    []
  );

  // Fetch general admin data
  async function getData() {
    try {
      const res = await axios.get(`${BASE_URLS.BACKEND_BASEURL}admin`);
      setGrowthData(res.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Failed to fetch admin data");
    }
  }

  async function getNotification() {
    try {
      const res = await axios.get(`${BASE_URLS.BACKEND_BASEURL}notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotification(res.data);
      console.log("Notification API Response:", res.data);
    } catch (error) {
      console.error("Error fetching notification:", error);
    }
  }

  // Fetch user growth data
  async function getUserGrowthData() {
    try {
      const res = await axios.get(
        `${BASE_URLS.BACKEND_BASEURL}admin/user-growth?range=${timePeriod}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("User Growth API Response:", res.data);
      const { newUsers = [], returningUsers = [] } = res.data;

      if (!Array.isArray(newUsers) || !Array.isArray(returningUsers)) {
        console.error(
          "Invalid API response: newUsers or returningUsers is not an array"
        );
        setError("Invalid user growth data");
        setIsLoading(false);
        return;
      }

      const labels = generateLabels(timePeriod);
      let newUsersData = new Array(labels.length).fill(0);
      let returningUsersData = new Array(labels.length).fill(0);

      if (timePeriod === "weekly") {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);

        newUsers.forEach(({ _id, count = 0 }) => {
          try {
            const date = new Date(_id);
            if (isNaN(date.getTime())) {
              console.warn(`Invalid date format in newUsers _id: ${_id}`);
              return;
            }
            const index = Math.floor(
              (date - startDate) / (1000 * 60 * 60 * 24)
            );
            if (index >= 0 && index < labels.length) {
              newUsersData[index] = count;
            }
          } catch (e) {
            console.warn(`Error parsing newUsers _id: ${_id}`, e);
          }
        });

        returningUsers.forEach(({ _id, count = 0 }) => {
          try {
            const date = new Date(_id);
            if (isNaN(date.getTime())) {
              console.warn(`Invalid date format in returningUsers _id: ${_id}`);
              return;
            }
            const index = Math.floor(
              (date - startDate) / (1000 * 60 * 60 * 24)
            );
            if (index >= 0 && index < labels.length) {
              returningUsersData[index] = count;
            }
          } catch (e) {
            console.warn(`Error parsing returningUsers _id: ${_id}`, e);
          }
        });
      } else if (timePeriod === "yearly") {
        newUsers.forEach(({ _id, count = 0 }) => {
          const month = parseInt(_id, 10);
          if (month >= 1 && month <= 12) {
            newUsersData[month - 1] = count;
          }
        });

        returningUsers.forEach(({ _id, count = 0 }) => {
          const month = parseInt(_id, 10);
          if (month >= 1 && month <= 12) {
            returningUsersData[month - 1] = count;
          }
        });
      } else {
        newUsers.forEach(({ _id, count = 0 }) => {
          const day = parseInt(_id, 10);
          if (day >= 1 && day <= labels.length) {
            newUsersData[day - 1] = count;
          }
        });

        returningUsers.forEach(({ _id, count = 0 }) => {
          const day = parseInt(_id, 10);
          if (day >= 1 && day <= labels.length) {
            returningUsersData[day - 1] = count;
          }
        });
      }

      const maxUsers = Math.max(...newUsersData, ...returningUsersData, 10);

      setUserGrowthData({
        labels,
        datasets: [
          {
            label: "New Users",
            data: newUsersData,
            borderColor: "limegreen",
            backgroundColor: (ctx) => {
              const chart = ctx.chart;
              const gradient = chart.ctx.createLinearGradient(
                0,
                0,
                0,
                chart.height
              );
              gradient.addColorStop(0, "rgba(0, 255, 0, 0.2)");
              gradient.addColorStop(1, "rgba(0, 255, 0, 0.05)");
              return gradient;
            },
            tension: 0.4,
            fill: true,
            pointRadius: 0,
          },
          {
            label: "Returning Users",
            data: returningUsersData,
            borderColor: "crimson",
            backgroundColor: (ctx) => {
              const chart = ctx.chart;
              const gradient = chart.ctx.createLinearGradient(
                0,
                0,
                0,
                chart.height
              );
              gradient.addColorStop(0, "rgba(255, 0, 0, 0.2)");
              gradient.addColorStop(1, "rgba(255, 0, 0, 0.05)");
              return gradient;
            },
            tension: 0.4,
            fill: true,
            pointRadius: 0,
          },
        ],
      });

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching user growth data:", err);
      if (err.status === 401) {
        localStorage.clear();
        navigate("/login");
        setError("Session expired. Please log in again.");
        setIsLoading(false);
        return;
      }
      setError("Failed to fetch user growth data");
      setIsLoading(false);
    }
  }

  const userGrowthOptions = useMemo(() => {
    const maxUsers = Math.max(
      ...(userGrowthData.datasets[0]?.data || [0]),
      ...(userGrowthData.datasets[1]?.data || [0]),
      10
    );
    return {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "start",
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            borderRadius: 6,
            usePointStyle: true,
            pointStyle: "circle",
            padding: 10,
            color: "#3d3d3d",
            font: { size: 14, weight: "500" },
          },
        },
        tooltip: { enabled: false },
        centerText: false,
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#3d3d3d",
            font: { size: 12, weight: "500" },
            maxTicksLimit:
              timePeriod === "weekly" ? 7 : timePeriod === "monthly" ? 10 : 12,
          },
        },
        y: {
          grid: { display: false },
          ticks: {
            color: "#3d3d3d",
            font: { size: 12, weight: "500" },
            stepSize:
              maxUsers > 100 ? Math.ceil(maxUsers / 10) : maxUsers > 50 ? 5 : 1,
            callback: (value) => value,
          },
          suggestedMin: 0,
          suggestedMax: Math.ceil(maxUsers * 1.2),
        },
      },
      elements: {
        line: { borderWidth: 2 },
      },
    };
  }, [userGrowthData, timePeriod]);

  async function fetchRevenueData() {
    try {
      const res = await axios.get(`${BASE_URLS.BACKEND_BASEURL}admin/revenue`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Revenue API Response:", res.data);
      setRevenueData(res.data);
      setIsRevenueLoading(false);
    } catch (err) {
      console.error("Error fetching revenue data:", err);
      setError("Failed to fetch revenue data");
      setIsRevenueLoading(false);
    }
  }

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
    setIsLoading(true);
  };

  const handleApprove = async (user, notification) => {
    try {
      const res = await axios.put(
        `${BASE_URLS.BACKEND_BASEURL}auth/approve`,
        {
          userId: user,
          notificationId: notification,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      getNotification();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getUserGrowthData();
    fetchRevenueData();
    getNotification();

    const interval = setInterval(() => {
      getUserGrowthData();
      fetchRevenueData();
    }, 60000 * 5);

    return () => clearInterval(interval);
  }, [timePeriod]);

  useEffect(() => {
    if (growthData && revenueData && !isRevenueLoading) {
      setIsLoading(false);
    }
  }, [growthData, revenueData, isRevenueLoading]);

  const commissionRevenue = revenueData
    ? Math.max(0, revenueData.totalEarnings - revenueData.boostEarnings)
    : 0;
  const boostRevenue = revenueData ? revenueData.boostEarnings : 0;
  const totalEarnings = revenueData ? revenueData.totalEarnings : 0;

  const doughnutData = useMemo(() => {
    console.log("Calculating doughnutData:", {
      commissionRevenue,
      boostRevenue,
      totalEarnings,
    });
    return {
      labels: ["Commission Revenue", "Boosted Profile"],
      datasets: [
        {
          data: [commissionRevenue, boostRevenue],
          backgroundColor: ["#f06", "#f77"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };
  }, [commissionRevenue, boostRevenue]);

  const doughnutOptions = useMemo(
    () => ({
      cutout: "75%",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        centerText: {
          totalEarnings: totalEarnings,
        },
      },
    }),
    [totalEarnings]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="kaab-dashboard">
      <h2 className="kaab-heading">Welcome, Admin!</h2>
      <p className="kaab-subheading">
        Your control center for managing our platform quickly and efficiently.
      </p>

      <div className="kaab-stats flex flex-col md:flex-row">
        <div className="kaab-card">
          <p className="first-child">
            Total Users{" "}
            <i
              onClick={() => navigate("/dashboard/all-profiles")}
              className="ri-arrow-right-up-line cursor-pointer"
            ></i>
          </p>
          {growthData ? (
            <h3>
              {growthData.totalUsers}{" "}
              <span
                className={
                  growthData.percentUserGrowth?.startsWith("-")
                    ? "bg-red-500 text-xs font-normal text-white px-2 rounded-full py-1"
                    : "bg-green-500 text-xs font-normal text-white px-2 rounded-full py-1"
                }
              >
                {growthData.percentUserGrowth}%
              </span>
              <p className="kaab-muted">vs. last month</p>
            </h3>
          ) : (
            <h3>No Data</h3>
          )}
        </div>
        <div className="kaab-card">
          <p className="first-child">
            Active Event Staff{" "}
            <i
              onClick={() =>
                navigate("/dashboard/all-profiles", {
                  state: { role: "staff" },
                })
              }
              className="ri-arrow-right-up-line cursor-pointer"
            ></i>
          </p>
          {growthData ? (
            <h3>
              {growthData.staffCount}{" "}
              <span
                className={
                  growthData?.percentStaffGrowth && typeof growthData.percentStaffGrowth === "string" && growthData.percentStaffGrowth.startsWith("-")
                    ? "bg-red-500 text-xs font-normal text-white px-2 rounded-full py-1"
                    : "bg-green-500 text-xs font-normal text-white px-2 rounded-full py-1"
                }
              >
                {growthData?.percentStaffGrowth ? `${growthData.percentStaffGrowth}%` : "0%"}
              </span>
              <p className="kaab-muted">vs. last month</p>
            </h3>
          ) : (
            <h3>No Data</h3>
          )}
        </div>
        <div className="kaab-card">
          <p className="first-child">
            Active Event Organizers{" "}
            <i
              onClick={() =>
                navigate("/dashboard/all-profiles", {
                  state: { role: "organiser" },
                })
              }
              className="ri-arrow-right-up-line cursor-pointer"
            ></i>
          </p>
          {growthData ? (
            <h3>
              {growthData.organiserCount}{" "}
              <p className="kaab-muted">Stable compared to last month</p>
            </h3>
          ) : (
            <h3>No Data</h3>
          )}
        </div>
        <div className="kaab-card">
          <p className="first-child">
            Monthly Revenue{" "}
            <i
              onClick={() => navigate("/dashboard/transactions")}
              className="ri-arrow-right-up-line cursor-pointer"
            ></i>
          </p>
          {growthData ? (
            <h3>
              ${growthData.currentMonthEarnings}{" "}
              <span
                className={
                  growthData.precentChangeInEarnings?.startsWith("-")
                    ? "bg-red-500 text-xs font-normal text-white px-2 rounded-full py-1"
                    : "bg-green-500 text-xs font-normal text-white px-2 rounded-full py-1"
                }
              >
                {growthData.precentChangeInEarnings}%
              </span>
              <p className="kaab-muted">vs. previous month</p>
            </h3>
          ) : (
            <h3>No Data</h3>
          )}
        </div>
      </div>

      <div className="kaab-main md:flex-row">
        <div className="kaab-notifications w-[100%] md:w-[57%]">
          <h3>Recent Notifications</h3>
          {notification && notification.length > 0 ? (
            notification.map((n, i) => (
              <div key={i} className="kaab-notification">
                <strong className="capitalize">
                  {n.type === "job_applied"
                    ? "New Job Application"
                    : n.type === "ticket_submission"
                      ? "New Ticket Raised"
                      : n.type}
                </strong>{" "}
                <span>{getRelativeTime(n.createdAt)}</span>
                <p dangerouslySetInnerHTML={{ __html: n.message }} />
                <div className="">
                  {n.type === "ticket_submission" ? (
                    <button
                      onClick={() => navigate("/dashboard/support/ticket")}
                      className="px-4 py-2 bg-gradient-to-l text-sm font-medium from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 text-white"
                    >
                      View Ticket
                    </button>
                  ) : n.type === "registration" ? (
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() =>
                          navigate("/dashboard/all-profiles", {
                            state: { user: n.sender._id, notification: n._id },
                          })
                        }
                        className="text-sm font-medium text-rose-600"
                      >
                        Review Profile
                      </button>
                      <button
                        onClick={() => handleApprove(n.sender._id, n._id)}
                        className={`px-4 py-2 border-1 border-rose-600 ${n.read
                            ? "text-rose-600 text-xs"
                            : "bg-gradient-to-l px-4 py-2 from-pink-600 to-rose-600 text-white"
                          } text-sm font-medium rounded-lg flex justify-center items-center gap-2 `}
                      >
                        {n.read ? "Registration Approved" : "Approve Registration"}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>No notifications available</div>
          )}
        </div>

        <div className="kaab-charts">
          <div className="kaab-graph">
            <div className="kaab-graph-header">
              <h4>
                User Growth <i className="ri-arrow-right-up-line"></i>
              </h4>
            </div>
            <div className="absolute inline-flex items-center right-[16px]">
              <select
                className="kaab-dropdown pl-3 pr-[25px] py-2 bg-[#FFFFFF] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
                value={timePeriod}
                onChange={handleTimePeriodChange}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <div className="absolute right-2 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i className="ri-arrow-down-s-line"></i>
                </div>
              </div>
            </div>
            {userGrowthData.datasets.length > 0 ? (
              <Line
                ref={chartRef}
                data={userGrowthData}
                options={userGrowthOptions}
                plugins={[addLegendSpacing]}
              />
            ) : (
              <div>No user growth data available</div>
            )}
          </div>

          <div className="kaab-revenue">
            <h4>
              Revenue Breakdown <i className="ri-arrow-right-up-line"></i>
            </h4>
            <div className="d-flex">
              {isRevenueLoading ? (
                <div>Loading revenue data...</div>
              ) : revenueData && totalEarnings > 0 ? (
                <>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <ul className="kaab-revenue-list">
                    <li>
                      <span className="kaab-dot red"></span> Commission Revenue
                      — ${commissionRevenue.toFixed(2)} (
                      {((commissionRevenue / totalEarnings) * 100).toFixed(1)}%)
                    </li>
                    <li>
                      <span className="kaab-dot pink"></span> Boosted Profile —
                      ${boostRevenue.toFixed(2)} (
                      {((boostRevenue / totalEarnings) * 100).toFixed(1)}%)
                    </li>
                    <li className="kaab-total-revenue">
                      Total Revenue: ${totalEarnings.toFixed(2)}
                    </li>
                  </ul>
                </>
              ) : (
                <div>No revenue data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;