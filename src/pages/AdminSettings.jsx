import React, { useEffect, useState } from "react";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import AdminSettingsSidebar from "../components/AdminSettingsSidebar";
import axios from "axios";
import BASE_URLS from "../config";
import { toast } from "react-toastify";

function AdminSettings() {
  // Existing states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [platformDetails, setPlatformDetails] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);

  // New state for notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    adminAlerts: true,
    emailNotifications: true,
    smsAlerts: true,
    receiveDowntimeWarnings: false,
  });

  // Fetch functions
  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}admin/all-admins`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setAdmins(response.data.admins);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const fetchPlatformDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}platform`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setPlatformDetails(response.data[0]);
    } catch (error) {
      console.error("Error fetching platform details:", error);
    }
  };

  const fetchRoles = async () => {
    const roleIds = ["superadmin", "admin", "moderator", "user"];
    const fetchedRoles = await Promise.all(
      roleIds.map(async (id) => {
        try {
          const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}roles/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          const data = response.data.data;
          return {
            id: data.role,
            name: data.role.charAt(0).toUpperCase() + data.role.slice(1),
            permissions: data.permissions,
            defaultPermissions: data.permissions,
          };
        } catch (error) {
          console.error(`Error fetching role ${id}:`, error);
          return null;
        }
      })
    );
    setRoles(fetchedRoles.filter(Boolean));
  };

  const fetchNotificationPreferences = async () => {
    try {
      const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}notification-preferences`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setNotificationPreferences(response.data.data);
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
    }
  };

  const updateNotificationPreferences = async (updatedPreferences) => {
    try {
      const response = await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}notification-preferences`,
        updatedPreferences,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setNotificationPreferences(response.data.data);
    } catch (error) {
      console.error("Error updating notification preferences:", error);
    }
  };

  const startEdit = (field) => {
    setEditingField(field);
    setFieldValue(platformDetails?.[field] ?? "");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setFieldValue("");
  };

  const saveEdit = async () => {
    if (!platformDetails?._id || !editingField) return;
    try {
      const payload = { [editingField]: fieldValue };
      await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}platform/${platformDetails._id}`,
        payload,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setPlatformDetails((prev) => ({ ...prev, ...payload }));
      setEditingField(null);
      setFieldValue("");
    } catch (error) {
      console.error("Error updating platform details:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchPlatformDetails();
    fetchRoles();
    fetchNotificationPreferences();
  }, []);

  const openSidebar = (mode, id = null) => {
    setSidebarMode(mode);
    setSelectedId(id);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSidebarMode(null);
    setSelectedId(null);
  };

  const handleAddAdmin = (newAdmin) => {
    setAdmins([...admins, newAdmin]);
    closeSidebar();
  };

  const handleSavePermissions = async (adminId, permissions) => {
    try {
      const response = await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}admin/user-permissions/${adminId}`,
        permissions,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      console.log(`Permissions updated for admin ${adminId}:`, response.data);
      setAdmins(
        admins.map((admin) =>
          admin._id === adminId ? { ...admin, ...permissions } : admin
        )
      );
    } catch (error) {
      console.error("Error updating user permissions:", error);
    }
  };

  const handleSaveRolePermissions = async (roleId, permissions) => {
    try {
      const response = await axios.patch(
        `${BASE_URLS.BACKEND_BASEURL}roles/${roleId}`,
        permissions,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      console.log(`Permissions updated for role ${roleId}:`, response.data);
      setRoles(
        roles.map((role) =>
          role.id === roleId ? { ...role, permissions } : role
        )
      );
      setAdmins(
        admins.map((admin) =>
          admin.role === roleId ? { ...admin, ...permissions } : admin
        )
      );
    } catch (error) {
      console.error("Error updating role permissions:", error);
    }
  };

  const handleToggleNotification = (key) => {
    const updatedPreferences = {
      ...notificationPreferences,
      [key]: !notificationPreferences[key],
    };
    setNotificationPreferences(updatedPreferences);
    updateNotificationPreferences(updatedPreferences);
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
                {editingField === 'platformName' ? (
                  <div className="inline-flex items-center gap-2">
                    <input
                      className="px-3 py-1 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#292929] text-sm font-medium font-['Inter'] leading-tight"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                    />
                    <button className="px-3 py-1 bg-[#E61E4D] text-white rounded-full text-sm" onClick={saveEdit}>Save</button>
                    <button className="px-3 py-1 bg-zinc-200 rounded-full text-sm" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      {platformDetails && platformDetails.platformName}
                    </div>
                    <i className="ri-pencil-line text-[#656565] cursor-pointer" onClick={() => startEdit('platformName')}></i>
                  </>
                )}
              </div>
              <div className="self-stretch inline-flex justify-start items-center gap-2">
                <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Support Email:
                </div>
                {editingField === 'supportEmail' ? (
                  <div className="inline-flex items-center gap-2">
                    <input
                      type="email"
                      className="px-3 py-1 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#292929] text-sm font-medium font-['Inter'] leading-tight"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                    />
                    <button className="px-3 py-1 bg-[#E61E4D] text-white rounded-full text-sm" onClick={saveEdit}>Save</button>
                    <button className="px-3 py-1 bg-zinc-200 rounded-full text-sm" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      {platformDetails && platformDetails.supportEmail}
                    </div>
                    <i className="ri-pencil-line text-[#656565] cursor-pointer" onClick={() => startEdit('supportEmail')}></i>
                  </>
                )}
              </div>
              <div className="inline-flex justify-start items-center gap-2">
                <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Support Phone:
                </div>
                {editingField === 'supportPhoneNumber' ? (
                  <div className="inline-flex items-center gap-2">
                    <input
                      className="px-3 py-1 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#292929] text-sm font-medium font-['Inter'] leading-tight"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                    />
                    <button className="px-3 py-1 bg-[#E61E4D] text-white rounded-full text-sm" onClick={saveEdit}>Save</button>
                    <button className="px-3 py-1 bg-zinc-200 rounded-full text-sm" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                      {platformDetails && platformDetails.supportPhoneNumber}
                    </div>
                    <i className="ri-pencil-line text-[#656565] cursor-pointer" onClick={() => startEdit('supportPhoneNumber')}></i>
                  </>
                )}
              </div>
              <div className="inline-flex justify-start items-center gap-2">
                <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Time Zone:
                </div>
                {editingField === 'timeZone' ? (
                  <div className="inline-flex items-center gap-2">
                    <input
                      className="px-3 py-1 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#292929] text-sm font-medium font-['Inter'] leading-tight"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                    />
                    <button className="px-3 py-1 bg-[#E61E4D] text-white rounded-full text-sm" onClick={saveEdit}>Save</button>
                    <button className="px-3 py-1 bg-zinc-200 rounded-full text-sm" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="relative inline-flex items-center">
                      {platformDetails && platformDetails.timeZone}
                    </div>
                    <i className="ri-pencil-line text-[#656565] cursor-pointer" onClick={() => startEdit('timeZone')}></i>
                  </>
                )}
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
              {[
                { label: "Admin Alerts", key: "adminAlerts" },
                { label: "Email Notifications", key: "emailNotifications" },
                { label: "SMS Alerts", key: "smsAlerts" },
                { label: "Receive Downtime Warnings", key: "receiveDowntimeWarnings" },
              ].map(({ label, key }) => (
                <div key={key} className="self-stretch inline-flex justify-between items-center">
                  <div className="justify-start text-black text-base font-medium font-['Inter'] leading-snug">
                    {label}
                  </div>
                  <label className="relative inline-block w-10 h-6">
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0"
                      checked={notificationPreferences[key]}
                      onChange={() => handleToggleNotification(key)}
                    />
                    <span
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                        notificationPreferences[key] ? "bg-[#E61E4D]" : "bg-zinc-300"
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 bg-[#F9F9F9] w-4 h-4 rounded-full transition-transform duration-200 transform ${
                          notificationPreferences[key] ? "translate-x-4" : "translate-x-0"
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
                  <div key={admin._id} className="p-3 border-l border-b border-[#ECECEC] inline-flex justify-start items-center gap-2">
                    <img className="w-8 h-8 rounded-full" src={admin.profileImage || 'https://placehold.co/32x32'} />
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
                  <div key={admin._id} className="h-16 p-3 border-l border-b border-[#ECECEC] inline-flex justify-center items-center gap-2.5">
                    <div className="relative w-full inline-flex items-center">
                      <select
                        className="px-4 py-2 w-full bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight appearance-none pr-10"
                        value={admin.role}
                        onChange={async (e) => {
                          try {
                            const updatedRole = e.target.value;
                            await axios.patch(
                              `${BASE_URLS.BACKEND_BASEURL}admin/edit-user/${admin._id}`,
                              { role: updatedRole },
                              { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
                            );
                            setAdmins(
                              admins.map((a) =>
                                a._id === admin._id ? { ...a, role: updatedRole, ...roles.find((r) => r.id === updatedRole).permissions } : a
                              )
                            );
                          } catch (error) {
                            console.error("Error updating role:", error);
                          }
                        }}
                      >
                        <option value="superadmin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="user">User</option>
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
                  <div key={admin._id} className="h-16 p-3 border-l border-b border-[#ECECEC] inline-flex justify-center items-center gap-2.5">
                    <div className="justify-start text-black text-base font-medium font-['Inter'] leading-snug">
                      ********
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
                  <div key={admin._id} className="self-stretch h-16 p-3 border-l border-b border-[#ECECEC] inline-flex justify-center items-center gap-2.5">
                    <div className="px-2 py-1 rounded outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-center items-center gap-2.5">
                      <button
                        className="justify-start text-[#E61E4D] text-xs font-normal font-['Inter'] leading-none"
                        onClick={() => openSidebar("editPermissions", admin._id)}
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
        selectedId={selectedId}
        admins={admins}
        roles={roles}
        onClose={closeSidebar}
        onAddAdmin={handleAddAdmin}
        onSavePermissions={handleSavePermissions}
        onSaveRolePermissions={handleSaveRolePermissions}
      />
    </div>
  );
}

export default AdminSettings;