// layouts/DashboardLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import BASE_URLS from "../config";
import "../asset/css/Style2.css"

export default function DashboardLayout() {
  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URLS.API}/auth/logout`, {
        method: "POST",
        withCredentials: true,
      });

      if (response.ok) {
        // Optionally handle response message
        const data = await response.json();
        console.log(data.message); // e.g., "Logout successful"

        // Clear local storage or auth context
        localStorage.clear();

        // Redirect to login page
        window.location.href = "/login";
      } else {
        console.error("Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const role = localStorage.getItem("role");

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
    // {
    //   to: "/dashboard/all-pages",
    //   label: "All Page",
    //   icon: "ri-briefcase-line",
    //   hidden: role === "staff" || role === "organiser",
    // },
    // {
    //   to: "/dashboard/all-profiles",
    //   label: "All Profiles",
    //   icon: "ri-briefcase-line",
    // },
    {
      to: "/dashboard/all-profiles",
      label: "All Profiles",
      icon: "ri-briefcase-line",
    },
    {
      to: "/dashboard/boosted-profiles",
      label: "Boosted Profiles",
      icon: "ri-rocket-fill",
    },
    {
      to: "/dashboard/admin-settings",
      label: "Admin Settings",
      icon: "ri-settings-5-fill",
    },
    {
      to: "/dashboard/content-management",
      label: "Content Managment",
      icon: "ri-file-3-line",
    },
    {
      to: "/dashboard/workflow",
      label: "Workflow and Automation",
      icon: "ri-node-tree",
    },
    {
      to: "/dashboard/manage-jobs",
      label: "Manage Jobs",
      icon: "ri-briefcase-line",
      // hidden: role === "staff",
    },
    // {
    //   to: "/dashboard/create-category",
    //   label: "Create Category",
    //   icon: "ri-briefcase-line",
    //   hidden: role === "staff " || role === "organiser",
    // },
    // {
    //   to: "/dashboard/create-faq",
    //   label: "Create FAQs",
    //   icon: "ri-briefcase-line",
    //   hidden: role === "staff" || role === "organiser",
    // },
    
    {
      to: "/dashboard/saved-profile",
      label: "Saved Profiles",
      icon: "ri-heart-line",
    },
{ to: "/dashboard/profile", label: "Your Profile", icon: "ri-user-line" },
    {
      to: "/dashboard/alerts",
      label: "Alerts & Updates",
      icon: "ri-notification-line",
    },
    { to: "/dashboard/messages", label: "Message", icon: "ri-message-line" },
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
    {
      to: "/dashboard/manage-events",
      label: "Mananage Events",
      icon: "ri-question-line",
    },
    {
      to: "/dashboard/manage-reviews",
      label: "Reviews",
      icon: "ri-star-fill",
    },
    {
      to: "/dashboard/manage-transaction",
      label: "Transaction",
      icon: "ri-star-fill",
    },
    {
      to: "/dashboard/security",
      label: "Security",
      icon: "ri-star-fill",
    },
  ].filter((item) => !item.hidden);

  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg">
        <div className="p-6 text-2xl font-bold">MYPARTYHOSTESS</div>
        <nav className="mt-4 flex flex-col text-sm text-gray-700 navs-kab">
          {navItems.map((item) => (
            <>
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 mx-2 mt-1 rounded-md hover:bg-pink-100 hover:text-pink-600 transition ${
                    isActive
                      ? "bg-pink-100 text-pink-600 font-medium active"
                      : "text-gray-700"
                  }`
                }
              >
                <i className={`${item.icon} text-sm text-blue-600`}></i>
               <span className="text-sm"> {item.label}</span>
              </NavLink>
            </>
          ))}
          <a
            onClick={handleLogout}
            className="flex items-center px-6 py-3 mx-2 mt-1 rounded-md hover:bg-pink-100 hover:text-pink-600 transition text-gray-700 cursor-pointer"
            data-discover="true"
          >
            <i className="ri-logout-box-r-line text-xl text-blue-600"></i>
            Logout
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}


