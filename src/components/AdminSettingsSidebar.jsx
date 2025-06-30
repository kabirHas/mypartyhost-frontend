import React from "react";
import { RiArrowDownSLine, RiEyeLine, RiArrowLeftLine, RiArrowUpSLine } from "react-icons/ri";

const AdminSettingsSidebar = ({
  isOpen,
  mode,
  selectedRole,
  roles,
  onClose,
  onAddAdmin,
  onSavePermissions,
}) => {
  // State for add admin form
  const [newAdmin, setNewAdmin] = React.useState({
    name: "",
    email: "",
    role: "Admin",
    password: "",
  });

  // State for permission form
  const [permissions, setPermissions] = React.useState({
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
  });

  // State for collapsible sections
  const [openSections, setOpenSections] = React.useState({
    general: true,
    userProfile: true,
    eventBooking: true,
    finance: true,
  });

  // Set permissions when selectedRole changes
  React.useEffect(() => {
    if (mode === "editPermissions" && selectedRole) {
      const role = roles.find((r) => r.id === selectedRole);
      if (role) {
        setPermissions(role.permissions);
      }
    }
  }, [mode, selectedRole, roles]);

  // Handle admin form input changes
  const handleAdminInputChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (e) => {
    const newPermissions = { ...permissions, [e.target.name]: e.target.checked };
    setPermissions(newPermissions);
    onSavePermissions(newPermissions); // Auto-save on change
  };

  // Handle section toggle
  const toggleSection = (section) => {
    setOpenSections({ ...openSections, [section]: !openSections[section] });
  };

  // Handle add admin form submission
  const handleAddAdmin = (e) => {
    e.preventDefault();
    onAddAdmin(newAdmin);
    setNewAdmin({ name: "", email: "", role: "Admin", password: "" });
  };

  // Handle cancel action
  const handleCancel = () => {
    setNewAdmin({ name: "", email: "", role: "Admin", password: "" });
    onClose();
  };

  // Handle restore default
  const handleRestoreDefault = () => {
    const role = roles.find((r) => r.id === selectedRole);
    if (role) {
      setPermissions(role.defaultPermissions || role.permissions);
      onSavePermissions(role.defaultPermissions || role.permissions);
    }
  };

  // Handle permission form submission
  const handleSavePermissions = (e) => {
    e.preventDefault();
    onSavePermissions(permissions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-zinc-400 bg-opacity-50"
        onClick={onClose}
      ></div>
      {/* Sidebar Content */}
      <div className="relative ml-auto overflow-auto w-[600px] bg-white h-full p-4 flex flex-col gap-6 shadow-lg">
        <div className="flex gap-4 items-center">
          <button className="text-[#656565] text-2xl" onClick={onClose}>
            <RiArrowLeftLine />
          </button>
          <h2 className="text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
            {mode === "addAdmin"
              ? "Add New Admin"
              : `Edit Permissions: ${
                  roles.find((r) => r.id === selectedRole)?.name
                }`}
          </h2>
        </div>
        <div className="h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>

        {mode === "addAdmin" ? (
          <div className="self-stretch px-4 pt-4 pb-6 flex flex-col justify-start items-start gap-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {/* Avatar Placeholder */}
              <div
                className="w-36 h-36 bg-zinc-300 rounded-full cursor-pointer"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const avatar = document.querySelector(".avatar");
                      avatar.style.backgroundImage = `url(${e.target.result})`;
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }}
              >
                <div className="avatar w-36 h-36 bg-zinc-300 rounded-full" />
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                {/* User Name */}
                <div className="self-stretch h-20 flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      User Name
                    </div>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={newAdmin.name}
                    onChange={handleAdminInputChange}
                    placeholder="Full Name"
                    className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                    required
                  />
                </div>
                {/* Email */}
                <div className="self-stretch h-20 flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Email
                    </div>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={newAdmin.email}
                    onChange={handleAdminInputChange}
                    placeholder="User Email"
                    className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                    required
                  />
                </div>
                {/* Password */}
                <div className="self-stretch h-20 flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Password
                    </div>
                  </div>
                  <div className="self-stretch relative">
                    <input
                      type="password"
                      name="password"
                      value={newAdmin.password}
                      onChange={handleAdminInputChange}
                      placeholder="Password"
                      className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight pr-10"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <RiEyeLine className="w-6 h-6 text-[#656565]" />
                    </div>
                  </div>
                </div>
                {/* Role */}
                <div className="self-stretch h-20 flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Role
                    </div>
                  </div>
                  <div className="self-stretch relative">
                    <select
                      name="role"
                      value={newAdmin.role}
                      onChange={handleAdminInputChange}
                      className="self-stretch px-3 py-2 w-full rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight appearance-none pr-10"
                      required
                    >
                      <option value="" disabled>
                        Choose a role
                      </option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Moderator">Moderator</option>
                      <option value="User">User</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <RiArrowDownSLine className="w-6 h-6 text-[#656565]" />
                    </div>
                  </div>
                </div>
                {/* Buttons */}
                <div className="self-stretch flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] text-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddAdmin}
                    className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight"
                  >
                    Add Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="w-full inline-flex flex-col justify-start items-start gap-4">
              {/* Header Section */}
              <div className="self-stretch inline-flex justify-between items-end">
                <div className="inline-flex flex-col justify-start items-start gap-2">
                  <div className="inline-flex justify-start items-center gap-6">
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      User:
                    </div>
                    <div className="px-3 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-start items-center gap-2">
                      <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                        {roles.find((r) => r.id === selectedRole)?.name || "Moderator"}
                      </div>
                      <RiArrowDownSLine className="w-5 h-5 text-[#656565]" />
                    </div>
                  </div>
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    Changes saves automatically
                  </div>
                </div>
                <button
                  className="py-1 rounded-lg text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug"
                  onClick={handleRestoreDefault}
                >
                  Restore default
                </button>
              </div>
              {/* Permission Sections */}
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                {/* General Access Permissions */}
                <div className="self-stretch p-3 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-start items-start gap-4">
                  <div
                    className="self-stretch inline-flex justify-start items-center gap-4 cursor-pointer"
                    onClick={() => toggleSection("general")}
                  >
                    <div className="flex-1 justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                      General Access Permissions
                    </div>
                    {openSections.general ? (
                      <RiArrowUpSLine className="w-6 h-6 text-[#656565]" />
                    ) : (
                      <RiArrowDownSLine className="w-6 h-6 text-[#656565]" />
                    )}
                  </div>
                  {openSections.general && (
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="accessDashboard"
                          checked={permissions.accessDashboard}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Access Dashboard
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            View and interact with the Admin Command Center
                          </div>
                        </div>
                      </label>
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="viewAnalytics"
                          checked={permissions.viewAnalytics}
                          onChange={handlePermissionChange}
                         className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            View Analytics
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Access real-time data and performance metrics
                          </div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                {/* User & Profile Permissions */}
                <div className="self-stretch p-3 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-start items-start gap-4">
                  <div
                    className="self-stretch inline-flex justify-start items-center gap-4 cursor-pointer"
                    onClick={() => toggleSection("userProfile")}
                  >
                    <div className="flex-1 justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                      User & Profile Permissions
                    </div>
                    {openSections.userProfile ? (
                      <RiArrowUpSLine className="w-6 h-6 text-[#656565]" />
                    ) : (
                      <RiArrowDownSLine className="w-6 h-6 text-[#656565]" />
                    )}
                  </div>
                  {openSections.userProfile && (
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="manageUserProfiles"
                          checked={permissions.manageUserProfiles}
                          onChange={handlePermissionChange}
                        className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Manage User Profiles
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Approve, suspend, or ban user accounts
                          </div>
                        </div>
                      </label>
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="editUserDetails"
                          checked={permissions.editUserDetails}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Edit User Details
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Modify user information and permissions
                          </div>
                        </div>
                      </label>
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="viewActivityLogs"
                          checked={permissions.viewActivityLogs}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            View Activity Logs
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Monitor user actions and audit trails
                          </div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                {/* Event & Booking Permissions */}
                <div className="self-stretch p-3 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-start items-start gap-4">
                  <div
                    className="self-stretch inline-flex justify-start items-center gap-4 cursor-pointer"
                    onClick={() => toggleSection("eventBooking")}
                  >
                    <div className="flex-1 justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                      Event & Booking Permissions
                    </div>
                    {openSections.eventBooking ? (
                      <RiArrowUpSLine className="w-6 h-6 text-[#656565]" />
                    ) : (
                      <RiArrowDownSLine className="w-6 h-6 text-[#656565]" />
                    )}
                  </div>
                  {openSections.eventBooking && (
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="manageEvents"
                          checked={permissions.manageEvents}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Manage Events
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Create, edit, and update events across the platform
                          </div>
                        </div>
                      </label>
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="approveRejectEvents"
                          checked={permissions.approveRejectEvents}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Approve/Reject Event Submissions
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Control which events go live on the site
                          </div>
                        </div>
                      </label>
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="overrideBookingSettings"
                          checked={permissions.overrideBookingSettings}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Override Booking Settings
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Customize booking rules for specific cases
                          </div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                {/* Financial & Transaction Permissions */}
                <div className="self-stretch p-3 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-start items-start gap-4">
                  <div
                    className="self-stretch inline-flex justify-start items-center gap-4 cursor-pointer"
                    onClick={() => toggleSection("finance")}
                  >
                    <div className="flex-1 justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                      Financial & Transaction Permissions
                    </div>
                    {openSections.finance ? (
                      <RiArrowUpSLine className="w-6 h-6 text-[#656565]" />
                    ) : (
                      <RiArrowDownSLine className="w-6 h-6 text-[#656565]" />
                    )}
                  </div>
                  {openSections.finance && (
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="manageTransactions"
                          checked={permissions.manageTransactions}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Manage Transactions
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            View, edit, refund, or dispute transactions
                          </div>
                        </div>
                      </label>
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="editPaymentSettings"
                          checked={permissions.editPaymentSettings}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Edit Payment Settings
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Configure payment gateway integrations and commission rates
                          </div>
                        </div>
                      </label>
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="viewFinancialReports"
                          checked={permissions.viewFinancialReports}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            View Financial Reports
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Access and export revenue and transaction reports
                          </div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
              {/* Save/Cancel Buttons */}
              {/* <div className="self-stretch flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] text-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSavePermissions}
                  className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight"
                >
                  Save Permissions
                </button>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsSidebar;