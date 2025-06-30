import React, { useState } from "react";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import AdminSettingsSidebar from "../components/AdminSettingsSidebar";

function AdminSettings() {
  // State for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState(null); // 'addAdmin' or 'editPermissions'
  const [selectedRole, setSelectedRole] = useState(null); // Selected role for editing

  // Mock admin data
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "Adam Zampa",
      email: "a.zampa.admin@mypartyhostess.com",
      role: "Super Admin",
      password: "*********",
    },
    {
      id: 2,
      name: "John Doe",
      email: "j.doe.admin@mypartyhostess.com",
      role: "Admin",
      password: "*********",
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "j.smith.admin@mypartyhostess.com",
      role: "Moderator",
      password: "*********",
    },
  ]);

  // Mock permission data with default permissions
  const [roles, setRoles] = useState([
    {
      id: "superAdmin",
      name: "Super Admin",
      permissions: {
        accessDashboard: true,
        viewAnalytics: true,
        manageUserProfiles: true,
        editUserDetails: true,
        viewActivityLogs: true,
        manageEvents: true,
        approveRejectEvents: true,
        overrideBookingSettings: true,
        manageTransactions: true,
        editPaymentSettings: true,
        viewFinancialReports: true,
      },
      defaultPermissions: {
        accessDashboard: true,
        viewAnalytics: true,
        manageUserProfiles: true,
        editUserDetails: true,
        viewActivityLogs: true,
        manageEvents: true,
        approveRejectEvents: true,
        overrideBookingSettings: true,
        manageTransactions: true,
        editPaymentSettings: true,
        viewFinancialReports: true,
      },
    },
    {
      id: "admin",
      name: "Admin",
      permissions: {
        accessDashboard: true,
        viewAnalytics: true,
        manageUserProfiles: true,
        editUserDetails: false,
        viewActivityLogs: true,
        manageEvents: true,
        approveRejectEvents: false,
        overrideBookingSettings: false,
        manageTransactions: false,
        editPaymentSettings: false,
        viewFinancialReports: true,
      },
      defaultPermissions: {
        accessDashboard: true,
        viewAnalytics: true,
        manageUserProfiles: true,
        editUserDetails: false,
        viewActivityLogs: true,
        manageEvents: true,
        approveRejectEvents: false,
        overrideBookingSettings: false,
        manageTransactions: false,
        editPaymentSettings: false,
        viewFinancialReports: true,
      },
    },
    {
      id: "moderator",
      name: "Moderator",
      permissions: {
        accessDashboard: true,
        viewAnalytics: true,
        manageUserProfiles: false,
        editUserDetails: false,
        viewActivityLogs: false,
        manageEvents: false,
        approveRejectEvents: true,
        overrideBookingSettings: false,
        manageTransactions: false,
        editPaymentSettings: false,
        viewFinancialReports: false,
      },
      defaultPermissions: {
        accessDashboard: true,
        viewAnalytics: true,
        manageUserProfiles: false,
        editUserDetails: false,
        viewActivityLogs: false,
        manageEvents: false,
        approveRejectEvents: true,
        overrideBookingSettings: false,
        manageTransactions: false,
        editPaymentSettings: false,
        viewFinancialReports: false,
      },
    },
    {
      id: "user",
      name: "User",
      permissions: {
        accessDashboard: false,
        viewAnalytics: false,
        manageUserProfiles: false,
        editUserDetails: false,
        viewActivityLogs: false,
        manageEvents: false,
        approveRejectEvents: false,
        overrideBookingSettings: false,
        manageTransactions: false,
        editPaymentSettings: false,
        viewFinancialReports: false,
      },
      defaultPermissions: {
        accessDashboard: false,
        viewAnalytics: false,
        manageUserProfiles: false,
        editUserDetails: false,
        viewActivityLogs: false,
        manageEvents: false,
        approveRejectEvents: false,
        overrideBookingSettings: false,
        manageTransactions: false,
        editPaymentSettings: false,
        viewFinancialReports: false,
      },
    },
  ]);

  // Handle sidebar open
  const openSidebar = (mode, roleId = null) => {
    setSidebarMode(mode);
    setSelectedRole(roleId);
    setIsSidebarOpen(true);
  };

  // Handle sidebar close
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSidebarMode(null);
    setSelectedRole(null);
  };

  // Handle add admin
  const handleAddAdmin = (newAdmin) => {
    setAdmins([
      ...admins,
      {
        id: admins.length + 1,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        password: "*********",
      },
    ]);
    closeSidebar();
  };

  // Handle save permissions
  const handleSavePermissions = (permissions) => {
    setRoles(
      roles.map((role) =>
        role.id === selectedRole ? { ...role, permissions } : role
      )
    );
    // In a real app, this would involve an API call
    console.log(`Saving permissions for ${selectedRole}:`, permissions);
  };

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-8">
      {/* Header */}
      <div className="w-[802px] flex flex-col justify-start items-start gap-2">
        <div className="self-stretch justify-start text-[#292929] text-4xl font-bold font-['Inter'] leading-10">
          Admin Settings
        </div>
        <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
          Effortlessly manage your platform settings in one place
        </div>
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-start items-center gap-4">
          {/* Platform Details */}
          <div className="w-1/2 p-4 bg-[#FFFFFF] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-black text-xl font-bold font-['Inter'] leading-normal">
              Platform Details
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="inline-flex justify-start items-center gap-2">
                <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Platform Name:
                </div>
                <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                  My Party Hostess
                </div>
                <i className="ri-pencil-line text-[#656565]"></i>
              </div>
              <div className="self-stretch inline-flex justify-start items-center gap-2">
                <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Support Email:
                </div>
                <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                  support@mphhostesses.com
                </div>
                <i className="ri-pencil-line text-[#656565]"></i>
              </div>
              <div className="inline-flex justify-start items-center gap-2">
                <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Support Phone:
                </div>
                <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                  +61 400 123 456
                </div>
                <i className="ri-pencil-line text-[#656565]"></i>
              </div>
              <div className="inline-flex justify-start items-center gap-2">
                <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Time Zone:
                </div>
                <div className="relative inline-flex items-center">
                  <select className="px-4 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight appearance-none pr-10">
                    <option value="">All Plans</option>
                    <option value="7-Day">7-Day</option>
                    <option value="14-Day">14-Day</option>
                    <option value="30-Day">30-Day</option>
                  </select>
                  <div className="absolute right-1 pointer-events-none">
                    <RiArrowDownSLine className="w-5 h-5 text-[#656565]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="flex-1 p-4 bg-[#FFFFFF] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-black text-xl font-bold font-['Inter'] leading-normal">
              Notification Preferences
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {["Admin Alerts", "Email Notifications", "SMS Alerts", "Receive Downtime Warnings"].map((label, index) => (
                <div key={index} className="self-stretch inline-flex justify-between items-center">
                  <div className="justify-start text-black text-base font-medium font-['Inter'] leading-snug">
                    {label}
                  </div>
                  <label className="relative inline-block w-10 h-6">
                    <input type="checkbox" className="opacity-0 w-0 h-0" />
                    <span
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                        index === 0 ? "bg-zinc-300" : "bg-[#E61E4D]"
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 bg-[#F9F9F9] w-4 h-4 rounded-full transition-transform duration-200 transform ${
                          index === 0 ? "translate-x-0" : "translate-x-4"
                        }`}
                      />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="self-stretch inline-flex justify-start items-start gap-4">
          {/* Admin Account Management */}
          <div className="p-4 bg-[#FFFFFF] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-center gap-4">
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="flex-1 justify-start text-black text-xl font-bold font-['Inter'] leading-normal">
                Admin Account Management
              </div>
              <button
                className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2"
                onClick={() => openSidebar("addAdmin")}
              >
                <span className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                  Add Admin
                </span>
              </button>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center overflow-hidden">
              {/* Admin Column */}
              <div className="inline-flex flex-col justify-start items-start">
                <div className="self-stretch px-3 py-2 bg-[#F9F9F9] border-l border-b border-[#ECECEC] inline-flex justify-center items-center gap-2.5">
                  <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                    Admin
                  </div>
                </div>
                {admins.map((admin) => (
                  <div key={admin.id} className="p-3 border-l border-b border-[#ECECEC] inline-flex justify-start items-center gap-2">
                    <img className="w-8 h-8 rounded-full" src="https://placehold.co/32x32" />
                    <div className="inline-flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch justify-start text-[#292929] text-sm font-medium font-['Inter'] leading-tight">
                        {admin.name}
                      </div>
                      <div className="self-stretch justify-start text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">
                        {admin.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Role Column */}
              <div className="min-w-44 inline-flex flex-col justify-start items-start">
                <div className="self-stretch px-3 py-2 bg-[#F9F9F9] border-l border-b border-[#ECECEC] inline-flex justify-center items-center gap-2.5">
                  <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                    Role
                  </div>
                </div>
                {admins.map((admin) => (
                  <div key={admin.id} className="h-16 p-3 border-l border-b border-[#ECECEC] inline-flex justify-center items-center gap-2.5">
                    <div className="relative w-full inline-flex items-center">
                      <select
                        className="px-4 py-2 w-full bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight appearance-none pr-10"
                        value={admin.role}
                        onChange={(e) => {
                          setAdmins(
                            admins.map((a) =>
                              a.id === admin.id ? { ...a, role: e.target.value } : a
                            )
                          );
                        }}
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="Moderator">Moderator</option>
                        <option value="User">User</option>
                      </select>
                      <div className="absolute right-1 pointer-events-none">
                        <RiArrowDownSLine className="w-5 h-5 text-[#656565]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Password Column */}
              <div className="inline-flex flex-col justify-start items-start">
                <div className="self-stretch px-3 py-2 bg-[#F9F9F9] border-l border-b border-[#ECECEC] inline-flex justify-center items-center gap-2.5">
                  <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                    Password
                  </div>
                </div>
                {admins.map((admin) => (
                  <div key={admin.id} className="h-16 p-3 border-l border-b border-[#ECECEC] inline-flex justify-center items-center gap-2.5">
                    <div className="justify-start text-black text-base font-medium font-['Inter'] leading-snug">
                      {admin.password}
                    </div>
                  </div>
                ))}
              </div>
              {/* Action Column */}
              <div className="w-24 inline-flex flex-col justify-start items-start">
                <div className="self-stretch px-3 py-2 bg-[#F9F9F9] border-l border-b border-[#ECECEC] inline-flex justify-center items-center gap-2.5">
                  <div className="flex-1 text-center justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                    Action
                  </div>
                </div>
                {admins.map((admin) => (
                  <div key={admin.id} className="self-stretch h-16 p-3 border-l border-b border-[#ECECEC] inline-flex justify-center items-center gap-2.5">
                    <div className="px-2 py-1 rounded outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-center items-center gap-2.5">
                      <button
                        className="justify-start text-[#E61E4D] text-xs font-normal font-['Inter'] leading-none"
                        onClick={() => openSidebar("editPermissions", admin.role.toLowerCase().replace(" ", ""))}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Permission Setting */}
          <div className="flex-1 p-4 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
              User Permission Setting
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
              {roles.map((role) => (
                <div key={role.id} className="self-stretch p-2 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-between items-center">
                  <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                    {role.name}
                  </div>
                  <button
                    className="py-1.5 px-2 rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2.5"
                    onClick={() => openSidebar("editPermissions", role.id)}
                  >
                    <RiArrowRightSLine className="text-[#656565] text-xl" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Component */}
      <AdminSettingsSidebar
        isOpen={isSidebarOpen}
        mode={sidebarMode}
        selectedRole={selectedRole}
        roles={roles}
        onClose={closeSidebar}
        onAddAdmin={handleAddAdmin}
        onSavePermissions={handleSavePermissions}
      />
    </div>
  );
}

export default AdminSettings;