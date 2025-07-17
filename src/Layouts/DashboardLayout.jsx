import { Outlet, NavLink } from "react-router-dom";
import BASE_URLS from "../config";
import "../asset/css/Style2.css";

export default function DashboardLayout() {
  const role = localStorage.getItem("role"); // Gets role from localStorage

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URLS.API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        localStorage.clear();
        window.location.href = "/login";
      } else {
        console.error("Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Base nav items (common to all)
  let navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-line",
    },
  ];

  // Admin-specific items
  if (role === "superadmin") {
    navItems = navItems.concat([
      {
        to: "/dashboard/analytics",
        label: "Analytics",
        icon: "ri-bar-chart-line",
      },
      {
        to: "/dashboard/all-profiles",
        label: "All Profiles",
        icon: "ri-team-line",
      },
      {
        to: "/dashboard/events",
        label: "Events",
        icon: "ri-calendar-event-line",
      },
      {
        to: "/dashboard/boosted-profiles",
        label: "Boosted Profiles",
        icon: "ri-rocket-fill",
      },
      {
        to: "/dashboard/messages",
        label: "Messages",
        icon: "ri-message-line",
      },
      {
        to: "/dashboard/reviews",
        label: "Reviews",
        icon: "ri-star-line",
      },
      {
        to: "/dashboard/transactions",
        label: "Transactions",
        icon: "ri-bank-card-line",
      },
      {
        to: "/dashboard/admin-settings",
        label: "Setting",
        icon: "ri-settings-5-fill",
      },
      {
        to: "/dashboard/workflow",
        label: "Workflows & Automations",
        icon: "ri-node-tree",
      },
      {
        to: "/dashboard/content-management",
        label: "Content Management",
        icon: "ri-file-list-line",
      },
      {
        to: "/dashboard/security",
        label: "Security & Backup",
        icon: "ri-lock-line",
      },
      {
        to: "/dashboard/support",
        label: "Help & Support",
        icon: "ri-question-line",
      },
    ]);
  }

  // Staff-specific items
  if (role === "staff") {
    navItems = navItems.concat([
      {
        to: "/dashboard/find-jobs",
        label: "Find Jobs",
        icon: "ri-briefcase-line",
      },
      {
        to: "/dashboard/saved-jobs",
        label: "Saved Jobs",
        icon: "ri-heart-line",
      },
      {
        to: "/dashboard/manage-bookings",
        label: "Manage Bookings",
        icon: "ri-calendar-check-line",
      },
      {
        to: "/profile",
        label: "Your Profile",
        icon: "ri-user-line",
      },
      {
        to: "/dashboard/alerts",
        label: "Alerts & Updates",
        icon: "ri-notification-line",
      },
      {
        to: "/dashboard/messages",
        label: "Message",
        icon: "ri-message-line",
      },
      {
        to: "/dashboard/billing",
        label: "Payment & Billing",
        icon: "ri-bank-card-line",
      },
      {
        to: "/dashboard/support",
        label: "Help & Support",
        icon: "ri-question-line",
      },
    ]);
  }


  // Organizer-specific items
if (role === "organiser") {
  navItems = navItems.concat([
    {
      to: "/dashboard/manage-jobs",
      label: "Manage Jobs",
      icon: "ri-briefcase-line",
    },
    {
      to: "/dashboard/saved-profile",
      label: "Saved Profiles",
      icon: "ri-heart-line",
    },
    {
      to: "/dashboard/profile",
      label: "Your Profile",
      icon: "ri-user-line",
    },
    {
      to: "/dashboard/alerts",
      label: "Alerts & Updates",
      icon: "ri-notification-line",
    },
    {
      to: "/dashboard/messages",
      label: "Message",
      icon: "ri-message-line",
    },
    {
      to: "/dashboard/billing",
      label: "Payment & Billing",
      icon: "ri-bank-card-line",
    },
    {
      to: "/dashboard/support",
      label: "Help & Support",
      icon: "ri-question-line",
    },
  ]);
}


  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg">
        <div className="p-6 text-2xl font-bold">MYPARTYHOSTESS</div>
        <nav className="mt-4 flex flex-col text-sm text-gray-700 navs-kab">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-3 mx-2 mt-1 rounded-md hover:bg-pink-100 hover:text-pink-600 transition ${
                  isActive
                    ? "bg-pink-100 text-pink-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <i className={`${item.icon} text-base text-blue-600`}></i>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}

          <a
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 mx-2 mt-1 rounded-md hover:bg-pink-100 hover:text-pink-600 transition text-gray-700 cursor-pointer"
          >
            <i className="ri-logout-box-r-line text-lg text-blue-600"></i>
            Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-[1400px]">
        <Outlet />
      </main>
    </div>
  );
}

