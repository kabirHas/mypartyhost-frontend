import React, { useRef, useEffect, useState } from "react";
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
  beforeDraw: (chart) => {
    const { width, height, ctx } = chart;
    ctx.restore();
    const fontSize = (height / 120).toFixed(2);
    ctx.font = `bold ${fontSize}em Inter, sans-serif`;
    ctx.textBaseline = "middle";
    const text = "$45000";
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;
    ctx.fillStyle = "#000";
    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

const addLegendSpacing = {
  id: 'addLegendSpacing',
  beforeInit(chart) {
    const fitValue = chart.legend.fit;
    chart.legend.fit = function () {
      fitValue.call(this);
      this.height += 20; // 👈 increase this to control spacing
    };
  }
};


const AdminDashboard = () => {
  const chartRef = useRef(null);
  const [userGrowthData, setUserGrowthData] = useState({ datasets: [] });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;

    const greenGradient = ctx.createLinearGradient(0, 0, 0, 300);
    greenGradient.addColorStop(0, "rgba(0, 255, 0, 0.2)");
    greenGradient.addColorStop(1, "rgba(0, 255, 0, 0.05)");

    const redGradient = ctx.createLinearGradient(0, 0, 0, 300);
    redGradient.addColorStop(0, "rgba(255, 0, 0, 0.2)");
    redGradient.addColorStop(1, "rgba(255, 0, 0, 0.05)");

    setUserGrowthData({
      labels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      datasets: [
        {
          label: "New Users",
          data: [2000, 3000, 2500, 6000, 4000, 3500, 5000, 4000, 4300, 3000, 3800, 4700],
          borderColor: "limegreen",
          backgroundColor: greenGradient,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
        },
        {
          label: "Returning Users",
          data: [1000, 2000, 4000, 5500, 4200, 3000, 5200, 4500, 4700, 4400, 2900, 6200],
          borderColor: "crimson",
          backgroundColor: redGradient,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
        },
      ]
    });
  }, []);

  const userGrowthOptions = {
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
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#3d3d3d",
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#3d3d3d",
          font: {
            size: 12,
            weight: "500",
          },
          stepSize: 2000,
          callback: function (value) {
            return `${value / 1000}k`;
          },
        },
        suggestedMin: 0,
        suggestedMax: 8000,
      },
    },
    elements: {
      line: { borderWidth: 2 },
    },
  };

  const doughnutData = {
    labels: ["Commission Revenue", "Boosted Profile", "Other Revenue"],
    datasets: [
      {
        data: [28500, 28500, 28500],
        backgroundColor: ["#f06", "#f77", "#0f6"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="kaab-dashboard">
      <h2 className="kaab-heading">Welcome, Admin!</h2>
      <p className="kaab-subheading">
        Your control center for managing our platform quickly and efficiently.
      </p>

      <div className="kaab-stats">
        <div className="kaab-card">
          <p className="first-child">
            Total Users <i className="ri-arrow-right-up-line"></i>
          </p>
          <h3>
            5,234 <span className="kaab-green">+6%</span>
            <p className="kaab-muted">vs. last month</p>
          </h3>
        </div>
        <div className="kaab-card">
          <p className="first-child">
            Active Event Staff <i className="ri-arrow-right-up-line"></i>
          </p>
          <h3>
            1,200 <span className="kaab-green">+4%</span>
            <p className="kaab-muted">vs. last month</p>
          </h3>
        </div>
        <div className="kaab-card">
          <p className="first-child">
            Active Event Organizers <i className="ri-arrow-right-up-line"></i>
          </p>
          <h3>
            800 <p className="kaab-muted">Stable compared to last month</p>
          </h3>
        </div>
        <div className="kaab-card">
          <p className="first-child">
            Monthly Revenue <i className="ri-arrow-right-up-line"></i>
          </p>
          <h3>
            $45,000 <span className="kaab-green">+5%</span>
            <p className="kaab-muted">vs. previous month</p>
          </h3>
        </div>
      </div>

      <div className="kaab-main">
        <div className="kaab-notifications">
          <h3>Recent Notifications</h3>
          {[
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
          ].map((n, i) => (
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
              <h4>User Growth <i className="ri-arrow-right-up-line"></i></h4>
              
            </div>
            <select className="kaab-dropdown">
                <option>Monthly</option>
              </select>
            <Line ref={chartRef} data={userGrowthData} options={userGrowthOptions} plugins={[addLegendSpacing]}/>
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
            <h4>Revenue Breakdown <i className="ri-arrow-right-up-line"></i></h4>
            <div className="d-flex">
              <Doughnut
                data={doughnutData}
                options={doughnutOptions}
                plugins={[centerTextPlugin]}
              />
              <ul className="kaab-revenue-list">
                <li>
                  <span className="kaab-dot red"></span> Commission Revenue — $28,500 (63%)
                </li>
                <li>
                  <span className="kaab-dot pink"></span> Boosted Profile — $28,500 (63%)
                </li>
                <li>
                  <span className="kaab-dot green"></span> Other Revenue — $28,500 (63%)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
