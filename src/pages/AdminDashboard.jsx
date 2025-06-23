import React from "react";
import {
  Line,
  Doughnut,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../asset/css/AdminDashboard.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

// ✅ Center text plugin for Doughnut
const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart) => {
    const { width, height, ctx } = chart;
    ctx.restore();
    const fontSize = (height / 114).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = "middle";

    const text = "$45000";
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillStyle = "#000";
    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

const AdminDashboard = () => {
  const notifications = [
    {
      title: "New Booking Dispute",
      time: "30 minutes ago",
      desc: "A dispute was raised for the VIP Gala Night booking due to a payment discrepancy.",
      actions: ["Review Profile"],
    },
    {
      title: "New User Registration",
      time: "1 hour ago",
      desc: "John Doe, a new organizer from Sydney, has joined the platform and awaits verification.",
      actions: ["Review Profile", "Approve Registration"],
    },
    {
      title: "Flagged Content",
      time: "1 hour ago",
      desc: "A review by Emily Roberts has been flagged for potential spam.",
      actions: ["Dismiss Flag", "Review Flagged Review"],
    },
  ];

  const userGrowthData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "New Users",
        data: [2000, 3000, 2500, 6000, 4000, 3500, 5000, 4000, 4300, 3000, 3800, 4700],
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Returning Users",
        data: [1000, 2500, 4000, 5500, 4200, 3000, 5200, 4500, 4700, 4400, 2900, 6200],
        borderColor: "crimson",
        backgroundColor: "rgba(220, 20, 60, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ["Commission Revenue", "Boosted Profile", "Other Revenue"],
    datasets: [
      {
        data: [28500, 28500, 28500],
        backgroundColor: ["#f06", "#f77", "#0f6"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="kaab-dashboard">
      <h2 className="kaab-heading">Welcome, Admin!</h2>
      <p className="kaab-subheading">
        Your control center for managing our platform quickly and efficiently.
      </p>

      <div className="kaab-stats">
        <div className="kaab-card">
          <p className="first-child">Total Users</p>
          <h3>5,234 <span className="kaab-green">+6%</span><p className="kaab-muted">vs. last month</p></h3>
          
        </div>
        <div className="kaab-card">
          <p className="first-child">Active Event Staff</p>
          <h3>1200 <span className="kaab-green">+4%</span><p className="kaab-muted">vs. last month</p></h3>
          
        </div>
        <div className="kaab-card">
          <p className="first-child">Active Event Organizers</p>
          <h3>800<p className="kaab-muted">Stable compared to last month</p></h3>
          
        </div>
        <div className="kaab-card">
          <p className="first-child">Monthly Revenue</p>
          <h3>$45,000 <span className="kaab-green">+5%</span><p className="kaab-muted">vs. previous month</p></h3>
          
        </div>
      </div>

      <div className="kaab-main">
        <div className="kaab-notifications">
          <h3>Recent Notifications</h3>
          {notifications.map((n, i) => (
            <div key={i} className="kaab-notification">
              <strong>{n.title}</strong> <span>{n.time}</span>
              <p>{n.desc}</p>
              <div className="kaab-actions">
                {n.actions.map((action, j) => (
                  <button key={j}>{action}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="kaab-charts">
          <div className="kaab-graph">
            <div className="kaab-graph-header">
              <h4>User Growth</h4>
              <select className="kaab-dropdown">
                <option>Monthly</option>
              </select>
            </div>
            <Line data={userGrowthData} />
          </div>

          <div className="kaab-revenue">
            <h4>Revenue Breakdown</h4>
            <Doughnut
              data={doughnutData}
              options={{ cutout: "70%" }}
              plugins={[centerTextPlugin]}
            />
            <ul className="kaab-revenue-list">
              <li><span className="kaab-dot red"></span> Commission Revenue — $28,500 (63%)</li>
              <li><span className="kaab-dot pink"></span> Boosted Profile — $28,500 (63%)</li>
              <li><span className="kaab-dot green"></span> Other Revenue — $28,500 (63%)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
