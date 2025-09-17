import React from "react";
import { RiArrowDownSLine, RiEyeLine, RiArrowLeftLine, RiArrowUpSLine } from "react-icons/ri";
import axios from "axios";
import BASE_URLS from "../config";

const AdminSettingsSidebar = ({
  isOpen,
  mode,
  selectedId,
  admins,
  roles,
  onClose,
  onAddAdmin,
  onSavePermissions,
  onSaveRolePermissions,
}) => {
  // State for add admin form
  const [newAdmin, setNewAdmin] = React.useState({
    name: "",
    email: "",
    role: "admin",
    password: "",
  });

  // State for image file and preview
  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);

  // State for permission form
  const [permissions, setPermissions] = React.useState({
    canAccessDashboard: false,
    canViewAnalytics: false,
    canManageUser: false,
    canEditUserProfiles: false,
    canViewActivityLogs: false,
    canManageEvent: false,
    canApproveJobs: false,
    canOverrideBookingRules: false,
    canManageTransactions: false,
    canEditPaymentSettings: false,
    canViewFinancialReports: false,
    canAcceptBookings: false,
    canMessage: false,
    canApply: false,
    canSubmitReview: false,
    canPostEvents: false,
  });

  // State for collapsible sections
  const [openSections, setOpenSections] = React.useState({
    general: true,
    userProfile: true,
    eventBooking: true,
    finance: true,
    userActions: true,
  });

  // State for API feedback
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  // Determine if editing role or admin
  const isRoleEdit = roles.some((r) => r.id === selectedId);
  const selectedRole = isRoleEdit ? roles.find((r) => r.id === selectedId) : null;
  const selectedAdmin = !isRoleEdit ? admins.find((a) => a._id === selectedId) : null;

  // Set permissions when selectedId changes
  React.useEffect(() => {
    if (mode === "editPermissions" && selectedId) {
      if (isRoleEdit && selectedRole) {
        setPermissions(selectedRole.permissions);
      } else if (!isRoleEdit && selectedAdmin) {
        setPermissions({
          canAccessDashboard: selectedAdmin.canAccessDashboard,
          canViewAnalytics: selectedAdmin.canViewAnalytics,
          canManageUser: selectedAdmin.canManageUser,
          canEditUserProfiles: selectedAdmin.canEditUserProfiles,
          canViewActivityLogs: selectedAdmin.canViewActivityLogs,
          canManageEvent: selectedAdmin.canManageEvent,
          canApproveJobs: selectedAdmin.canApproveJobs,
          canOverrideBookingRules: selectedAdmin.canOverrideBookingRules,
          canManageTransactions: selectedAdmin.canManageTransactions,
          canEditPaymentSettings: selectedAdmin.canEditPaymentSettings,
          canViewFinancialReports: selectedAdmin.canViewFinancialReports,
          canAcceptBookings: selectedAdmin.canAcceptBookings,
          canMessage: selectedAdmin.canMessage,
          canApply: selectedAdmin.canApply,
          canSubmitReview: selectedAdmin.canSubmitReview,
          canPostEvents: selectedAdmin.canPostEvents,
        });
      }
    }
  }, [mode, selectedId, admins, roles, isRoleEdit, selectedRole, selectedAdmin]);

  // Handle admin form input changes
  const handleAdminInputChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        const avatar = document.querySelector(".avatar");
        avatar.style.backgroundImage = `url(${e.target.result})`;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle permission checkbox changes (update local state only)
  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions({ ...permissions, [name]: checked });
    console.log(`Permission changed locally: ${name} = ${checked}`);
  };

  // Handle save permissions
  const handleSavePermissionsButton = async () => {
    setError(null);
    setSuccess(null);
    try {
      if (isRoleEdit) {
        await onSaveRolePermissions(selectedId, permissions);
        setSuccess(`Permissions updated for role ${selectedRole?.name}`);
      } else {
        await onSavePermissions(selectedId, permissions);
        setSuccess(`Permissions updated for user ${selectedAdmin?.name}`);
      }
      console.log(`Permissions saved for ${isRoleEdit ? 'role' : 'admin'} ${selectedId}:`, permissions);
    } catch (error) {
      console.error("Error saving permissions:", error);
      setError(error.response?.data?.message || "Failed to save permissions. Please try again.");
    }
  };

  // Handle section toggle
  const toggleSection = (section) => {
    setOpenSections({ ...openSections, [section]: !openSections[section] });
  };

  // Handle add admin form submission with API call
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("name", newAdmin.name);
    formData.append("email", newAdmin.email);
    formData.append("role", newAdmin.role);
    formData.append("password", newAdmin.password);
    if (imageFile) {
      formData.append("profileImage", imageFile);
    }
    // Apply default permissions for the role
    const rolePermissions = roles.find((r) => r.id === newAdmin.role)?.permissions || {};
    Object.keys(rolePermissions).forEach((key) => {
      formData.append(key, rolePermissions[key]);
    });

    try {
      const response = await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}admin/create-user`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccess("Admin added successfully!");
      console.log("Adding new admin:", formData);
      console.log("API Response:", response.data);
      onAddAdmin(response.data.user);
      setNewAdmin({ name: "", email: "", role: "admin", password: "" });
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add admin. Please try again.");
      console.error("API Error:", err);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setNewAdmin({ name: "", email: "", role: "admin", password: "" });
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
    onClose();
  };

  // Handle restore default
  const handleRestoreDefault = () => {
    let defaultPerms;
    if (isRoleEdit) {
      defaultPerms = selectedRole.defaultPermissions;
    } else {
      const adminRole = roles.find((r) => r.id === selectedAdmin.role);
      defaultPerms = adminRole ? adminRole.defaultPermissions : {};
    }
    setPermissions(defaultPerms);
    console.log(`Restored default permissions locally for ${isRoleEdit ? 'role' : 'admin'} ${selectedId}:`, defaultPerms);
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
              : `Edit Permissions: ${isRoleEdit ? selectedRole?.name : selectedAdmin?.name || ""}`}
          </h2>
        </div>
        <div className="h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>

        {mode === "addAdmin" ? (
          <div className="self-stretch px-4 pt-4 pb-6 flex flex-col justify-start items-start gap-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {/* Avatar Placeholder */}
              <div
                className="w-36 h-36 bg-zinc-300 rounded-full cursor-pointer relative"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = handleImageChange;
                  input.click();
                }}
              >
                <div
                  className="avatar w-36 h-36 bg-zinc-300 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : "none" }}
                />
                <div className="absolute bottom-0 right-0 bg-[#E61E4D] text-white text-xs px-2 py-1 rounded-full">
                  Upload
                </div>
              </div>
              {/* Display API feedback */}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-500 text-sm">{success}</div>}
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
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
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
                      {isRoleEdit ? "Role" : "User"}:
                    </div>
                    <div className="px-3 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-start items-center gap-2">
                      <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                        {isRoleEdit ? selectedRole?.name : selectedAdmin?.name || "Unknown"}
                      </div>
                      <RiArrowDownSLine className="w-5 h-5 text-[#656565]" />
                    </div>
                  </div>
                  <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    Click Save Permissions to apply changes
                  </div>
                </div>
                <button
                  className="py-1 rounded-lg text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug"
                  onClick={handleRestoreDefault}
                >
                  Restore default
                </button>
              </div>
              {/* Error/Success Messages */}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-500 text-sm">{success}</div>}
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
                          name="canAccessDashboard"
                          checked={permissions.canAccessDashboard}
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
                          name="canViewAnalytics"
                          checked={permissions.canViewAnalytics}
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
                          name="canManageUser"
                          checked={permissions.canManageUser}
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
                          name="canEditUserProfiles"
                          checked={permissions.canEditUserProfiles}
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
                          name="canViewActivityLogs"
                          checked={permissions.canViewActivityLogs}
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
                          name="canManageEvent"
                          checked={permissions.canManageEvent}
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
                          name="canApproveJobs"
                          checked={permissions.canApproveJobs}
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
                          name="canOverrideBookingRules"
                          checked={permissions.canOverrideBookingRules}
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
                          name="canManageTransactions"
                          checked={permissions.canManageTransactions}
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
                          name="canEditPaymentSettings"
                          checked={permissions.canEditPaymentSettings}
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
                          name="canViewFinancialReports"
                          checked={permissions.canViewFinancialReports}
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
                {/* User Action Permissions */}
                {/* <div className="self-stretch p-3 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-start items-start gap-4">
                  <div
                    className="self-stretch inline-flex justify-start items-center gap-4 cursor-pointer"
                    onClick={() => toggleSection("userActions")}
                  >
                    <div className="flex-1 justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                      User Action Permissions
                    </div>
                    {openSections.userActions ? (
                      <RiArrowUpSLine className="w-6 h-6 text-[#656565]" />
                    ) : (
                      <RiArrowDownSLine className="w-6 h-6 text-[#656565]" />
                    )}
                  </div>
                  {openSections.userActions && (
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="canAcceptBookings"
                          checked={permissions.canAcceptBookings}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Accept Bookings
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Accept or decline booking requests
                          </div>
                        </div>
                      </label>
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="canMessage"
                          checked={permissions.canMessage}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Send Messages
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Communicate with other users via messaging
                          </div>
                        </div>
                      </label>
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="canApply"
                          checked={permissions.canApply}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Apply for Events
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Submit applications for events or jobs
                          </div>
                        </div>
                      </label>
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="canSubmitReview"
                          checked={permissions.canSubmitReview}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Submit Reviews
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Post reviews for events or users
                          </div>
                        </div>
                      </label>
                      <label className="self-stretch inline-flex justify-start items-start gap-2">
                        <input
                          type="checkbox"
                          name="canPostEvents"
                          checked={permissions.canPostEvents}
                          onChange={handlePermissionChange}
                          className="w-4 h-4 accent-[#E61E4D]"
                        />
                        <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch justify-start text-[#292929] text-sm font-normal font-['Inter'] leading-tight">
                            Post Events
                          </div>
                          <div className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                            Create and publish new events
                          </div>
                        </div>
                      </label>
                    </div>
                  )}
                </div> */}
              </div>
              {/* Save/Cancel Buttons */}
              <div className="self-stretch flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] text-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSavePermissionsButton}
                  className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight"
                >
                  Save Permissions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsSidebar;