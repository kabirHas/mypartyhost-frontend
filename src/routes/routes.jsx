// routes/routes.js
import React from "react";
import { Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../Layouts/DashboardLayout";
import CreatePage from "../pages/CreatePage";
import CreateCategory from "../pages/CreateCategory";
import Genric from "../pages/Genric";
import UpdatePage from "../pages/UpdatePage";
import CreateFaq from "../pages/CreateFaq";
import OrganizerDashboard from "../pages/OrganizerDashboard";
import SuccessScreen from "../components/SuccessScreen";
import ProfileUpdate from "../pages/ProfileUpdate";
import ManagePages from "../components/ManagePages";
import MessagePage from "../pages/MessagePage";
import PaymentPage from "../pages/PaymentPage";
import CreateJobs from "../pages/EditJobs";
import ManageJobs from "../pages/ManageJobs";
import ViewJobDetails from "../pages/ViewJobDetails";
import ManageJobsLayout from "../Layouts/ManageJobLayout";
import SavedProfiles from "../pages/SavedProfiles";
import Alerts from "../pages/Alerts";
import FindJobs from "../pages/FindJobs";
import Contact from "../pages/Contact";
import ContactSupport from "../pages/ContactSupport";
import AllProfiles from "../pages/AllProfiles";
import SupportPage from "../pages/SupportPage";
import AdminDashboard from "../pages/AdminDashboard";
import BoostedProfiles from "../pages/BoostedProfiles";
import AdminSettings from "../pages/AdminSettings";
import ContentManagement from "../pages/ContentManagement";
import WorkFlow from "../pages/Workflow";
import Security from "../pages/SecurityAndWorkflow";
import BookingDetails from "../pages/BookingDetails";
import InvitesReceived from "../pages/InvitesReceived";
import PastBookingDetail from "../pages/PastBookingDetail";
import StaffSinglePage from "../pages/StaffSinglePage";
import ApplyJob from "../pages/ApplyJob";
import ManageBookings from "../pages/ManageBookings";
import SavedJobs from "../pages/SavedJobs";
import StaffPublicProfile from "../pages/StaffPublicProfile";
import ManageEvents from "../pages/ManageEvents";
import ReviewsManagement from "../pages/ReviewsManagement";
import TransactionManagement from "../pages/TransactionManagement";
import StaffDashboard from "../pages/StaffDashboard";
import AcceptBookingReq from "../pages/AcceptBookingReq";
import CreateEventMultiStepForm from "../pages/CreateEventMultiStepForm";
import BoostPaymentSuccess from "../pages/BoostPaymentSuccess";
import HirePaymentSuccess from "../pages/HirePaymentSuccess";
import HireInvitePaymentSuccess from "../pages/HireInvitePaymentSuccess";
import HireCancel from "../pages/HireCancel";

// export const getStaticRoutes = (isLoggedIn, userRole) => {
//   // const hasAccess = (allowedRoles) => allowedRoles.includes(userRole);
//   return [
//     <Route path="/login" element={<Login />} key="login" />,
//     <Route path="/register" element={<Register />} key="register" />,

//     <Route
//       path="/dashboard"
//       element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
//       key="dashboard"
//     >
//       <Route index element={<OrganizerDashboard />} />
//       <Route
//         path="/dashboard/all-pages"
//         element={isLoggedIn ? <ManagePages /> : <Navigate to="/login" />}
//         key="all-pages"
//       />
//       ,
//       <Route
//         path="/dashboard/all-pages/create-page"
//         element={isLoggedIn ? <CreatePage /> : <Navigate to="/login" />}
//         key="create-page"
//       />
//       ,
//       <Route
//         path="/dashboard/create-category"
//         element={isLoggedIn ? <CreateCategory /> : <Navigate to="/login" />}
//         key="create-category"
//       />
//       <Route
//         path="/dashboard/saved-profile"
//         element={isLoggedIn ? <SavedProfiles /> : <Navigate to="/login" />}
//         key="saved-profiles"
//       />
//       ,
//       <Route
//         path="/dashboard/create-faq"
//         element={isLoggedIn ? <CreateFaq /> : <Navigate to="/login" />}
//         key="create-faq"
//       />
//       <Route
//         path="/dashboard/alerts"
//         element={isLoggedIn ? <Alerts /> : <Navigate to="/login" />}
//         key="create-faq"
//       />
//       <Route
//         path="/dashboard/jobs"
//         element={isLoggedIn ? <FindJobs /> : <Navigate to="/login" />}
//         key="create-faq"
//       />
//       <Route
//         path="/dashboard/support"
//         element={isLoggedIn ? <SupportPage /> : <Navigate to="/login" />}
//         key="support"
//       ></Route>
//       <Route
//         path="/dashboard/support/ticket"
//         element={isLoggedIn ? <Contact /> : <Navigate to="/login" />}
//         key="support"
//       ></Route>
//       <Route
//         path="/dashboard/support/new-ticket"
//         element={isLoggedIn ? <ContactSupport /> : <Navigate to="/login" />}
//         key="contact"
//       />
//       <Route
//         path="/dashboard/all-profiles"
//         element={isLoggedIn ? <AllProfiles /> : <Navigate to="/login" />}
//         key="contact"
//       />
//       <Route
//         path="/dashboard/boosted-profiles"
//         element={isLoggedIn ? <BoostedProfiles /> : <Navigate to="/login" />}
//         key="contact"
//       />
//       <Route
//         path="/dashboard/boosted-profiles"
//         element={isLoggedIn ? <BoostedProfiles /> : <Navigate to="/login" />}
//         key="contact"
//       />
//       <Route
//         path="/dashboard/admin-settings"
//         element={isLoggedIn ? <AdminSettings /> : <Navigate to="/login" />}
//         key="contact"
//       />
//       <Route
//         path="/dashboard/content-management"
//         element={isLoggedIn ? <ContentManagement /> : <Navigate to="/login" />}
//         key="contact"
//       />
//       <Route
//         path="/dashboard/workflow"
//         element={isLoggedIn ? <WorkFlow /> : <Navigate to="/login" />}
//         key="contact"
//       />
//       <Route
//         path="/dashboard/security"
//         element={isLoggedIn ? <Security /> : <Navigate to="/login" />}
//         key="contact"
//       />
//       ,
//       <Route
//         path="/dashboard/dashboards"
//         element={isLoggedIn ? <OrganizerDashboard /> : <Navigate to="/login" />}
//         key="dashboards"
//       />
//       ,
//       <Route
//     path="/dashboard/manage-bookings"
//     element={isLoggedIn ? <ManageBookings /> : <Navigate to="/login" />}
//     key="contact"
//   />,
//       <Route
//         path="/dashboard/profile"
//         element={isLoggedIn ? <ProfileUpdate /> : <Navigate to="/login" />}
//         key="profile"
//       />
//       ,
//       <Route
//         path="/dashboard/find-jobs"
//         element={isLoggedIn ? <FindJobs /> : <Navigate to="/login" />}
//         key="contact"
//       />,
//       <Route
//         path="/dashboard/manage-jobs"
//         element={isLoggedIn ? <ManageJobsLayout /> : <Navigate to="/login" />}
//         key="profile"
//       >
//         <Route index element={<ManageJobs />} />
//         <Route path=":id/view" element={<ViewJobDetails />} />
//       </Route>
//       {/* <Route
//       path="/dashboard/manage-jobs/:id/view"
//       element={isLoggedIn ? <ViewJobDetails /> : <Navigate to="/login" />}
//       key="profile"
//     /> */}
//       <Route
//         path="/dashboard/messages"
//         element={isLoggedIn ? <MessagePage /> : <Navigate to="/login" />}
//         key="messages"
//       />
//       ,
//       <Route
//         path="/dashboard/saved-jobs"
//         element={isLoggedIn ? <SavedJobs /> : <Navigate to="/login" />}
//         key="contact"
//       />,
//       <Route
//         path="/dashboard/billing"
//         element={isLoggedIn ? <PaymentPage /> : <Navigate to="/login" />}
//         key="billing"
//       />
//       ,
//     </Route>,

//     <Route
//       path="/update-page/:id"
//       element={isLoggedIn ? <UpdatePage /> : <Navigate to="/login" />}
//       key="update-page"
//     />,
//     <Route
//       path="/create-job"
//       element={isLoggedIn ? <CreateJobs /> : <Navigate to="/login" />}
//       key="event"
//     />,

//     <Route
//       path="/bookings/:id"
//       element={isLoggedIn ? <BookingDetails /> : <Navigate to="/login" />}
//       key="manage-bookings"
//     />,
//     <Route
//       path="/invites/:id"
//       element={isLoggedIn ? <InvitesReceived /> : <Navigate to="/login" />}
//       key="manage-bookings"
//     />,
//     <Route
//       path="/past-booking/:id"
//       element={isLoggedIn ? <PastBookingDetail /> : <Navigate to="/login" />}
//       key="manage-bookings"
//     />,
//     <Route
//       path="/profile"
//       element={isLoggedIn ? <StaffSinglePage /> : <Navigate to="/login" />}
//       key="manage-bookings"
//     />,
//     <Route
//       path="/apply-job"
//       element={isLoggedIn ? <ApplyJob /> : <Navigate to="/login" />}
//       key="manage-bookings"
//     />,
//     <Route
//       path="/staff-profile"
//       element={isLoggedIn ? <StaffPublicProfile /> : <Navigate to="/login" />}
//       key="manage-bookings"
//     />,
//     <Route
//       path="/dashboard"
//       element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
//       key="dashboard"
//     />,
//     <Route path="/success" element={<SuccessScreen />} />,
//   ];
// };

export const getStaticRoutes = (isLoggedIn, userRole) => {
  // userRole= "organizer";
  const isAdmin = userRole === "superadmin";
  const isStaff = userRole === "staff";
  const isOrganizer = userRole === "organiser";

  return [
    <Route path="/login" element={<Login />} key="login" />,
    <Route path="/register" element={<Register />} key="register" />,

    <Route
      path="/dashboard"
      element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
      key="dashboard"
    >
      {isAdmin && (
        <>
          <Route index element={<AdminDashboard />} />
          <Route
            path="/dashboard/analytics"
            element={<AdminDashboard />}
            key="analytics"
          />
          <Route
            path="/dashboard/all-profiles"
            element={<AllProfiles />}
            key="all-profiles"
          />
          <Route
            path="/dashboard/events"
            element={<ManageEvents />}
            key="events"
          />
          <Route
            path="/dashboard/boosted-profiles"
            element={<BoostedProfiles />}
            key="boosted-profiles"
          />
          <Route
            path="/dashboard/messages"
            element={<MessagePage />}
            key="messages"
          />
          <Route
            path="/dashboard/reviews"
            element={<ReviewsManagement />}
            key="reviews"
          />
          <Route
            path="/dashboard/transactions"
            element={<TransactionManagement />}
            key="transaction"
          />
          <Route
            path="/dashboard/admin-settings"
            element={<AdminSettings />}
            key="admin-settings"
          />
          <Route
            path="/dashboard/workflow"
            element={<WorkFlow />}
            key="workflow"
          />
          <Route
            path="/dashboard/content-management"
            element={<ContentManagement />}
            key="content-management"
          />
          <Route
            path="/dashboard/all-pages/create-page"
            element={isLoggedIn ? <CreatePage /> : <Navigate to="/login" />}
            key="create-page"
          />
          <Route
            path="/dashboard/create-faq"
            element={isLoggedIn ? <CreateFaq /> : <Navigate to="/login" />}
            key="create-faq"
          />
          <Route
            path="/dashboard/security"
            element={<Security />}
            key="security"
          />
          <Route
            path="/dashboard/support"
            element={<SupportPage />}
            key="support"
          />
        </>
      )}

      {isStaff && (
        <>
          <Route index element={<StaffDashboard />} />
          <Route
            path="/dashboard/find-jobs"
            element={<FindJobs />}
            key="find-jobs"
          />
          <Route
            path="/dashboard/saved-jobs"
            element={<SavedJobs />}
            key="saved-jobs"
          />
          <Route
            path="/dashboard/manage-bookings"
            element={<ManageBookings />}
            key="manage-bookings"
          />

          <Route path="/dashboard/alerts" element={<Alerts />} key="alerts" />
          <Route
            path="/dashboard/messages"
            element={<MessagePage />}
            key="messages"
          />
          <Route
            path="/dashboard/billing"
            element={<PaymentPage />}
            key="billing"
          />
          <Route
            path="/dashboard/support"
            element={<SupportPage />}
            key="support"
          />
        </>
      )}

      {isOrganizer && (
        <>
          <Route index element={<OrganizerDashboard />} />
          <Route
            path="/dashboard/manage-jobs"
            element={<ManageJobsLayout />}
            key="manage-jobs"
          >
            <Route index element={<ManageJobs />} />
            <Route path=":id/view" element={<ViewJobDetails />} />
          </Route>
          <Route
            path="/dashboard/saved-profile"
            element={<SavedProfiles />}
            key="saved-profile"
          />
          <Route path="/dashboard/alerts" element={<Alerts />} key="alerts" />
          <Route
            path="/dashboard/messages"
            element={<MessagePage />}
            key="messages"
          />
          <Route
            path="/dashboard/billing"
            element={<PaymentPage />}
            key="billing"
          />
          <Route
            path="/dashboard/support"
            element={<SupportPage />}
            key="support"
          />
        </>
      )}

      {/* Common Routes */}
      <Route
        path="/dashboard/profile"
        element={isLoggedIn ? <ProfileUpdate /> : <Navigate to="/login" />}
        key="profile"
      />
      <Route
        path="/dashboard/support"
        element={isLoggedIn ? <SupportPage /> : <Navigate to="/login" />}
        key="support"
      />
      <Route
        path="/dashboard/support/ticket"
        element={isLoggedIn ? <Contact /> : <Navigate to="/login" />}
        key="ticket"
      />
      <Route
        path="/dashboard/support/new-ticket"
        element={isLoggedIn ? <ContactSupport /> : <Navigate to="/login" />}
        key="new-ticket"
      />
    </Route>,

    <Route
      path="/bookings/:id"
      element={isLoggedIn ? <BookingDetails /> : <Navigate to="/login" />}
      key="manage-bookings"
    />,
    <Route
      path="/invites/:id"
      element={isLoggedIn ? <InvitesReceived /> : <Navigate to="/login" />}
      key="manage-bookings"
    />,
    <Route
      path="/past-booking/:id"
      element={isLoggedIn ? <PastBookingDetail /> : <Navigate to="/login" />}
      key="manage-bookings"
    />,
    <Route
      path="/accept-booking/"
      element={isLoggedIn ? <AcceptBookingReq /> : <Navigate to="/login" />}
      key="manage-bookings"
    />,
    <Route
      path="/multi-step/"
      element={
        isLoggedIn ? <CreateEventMultiStepForm /> : <Navigate to="/login" />
      }
      key="manage-bookings"
    />,
    <Route
      path="/create-job"
      element={isLoggedIn ? <CreateJobs /> : <Navigate to="/login" />}
      key="event"
    />,

    <Route
      path="/staff-profile/:id"
      element={<StaffPublicProfile />}
      key="profile"
    />,

    <Route path="/profile" element={<StaffSinglePage />} key="profile" />,
    <Route path="/apply-job" element={<ApplyJob />} key="apply-job" />,

    <Route
      path="/bookings/:id"
      element={isLoggedIn ? <BookingDetails /> : <Navigate to="/login" />}
      key="manage-bookings"
    />,
    <Route
      path="/invites/:id"
      element={isLoggedIn ? <InvitesReceived /> : <Navigate to="/login" />}
      key="manage-bookings"
    />,
    <Route
      path="/past-booking/:id"
      element={isLoggedIn ? <PastBookingDetail /> : <Navigate to="/login" />}
      key="manage-bookings"
    />,
    <Route
      path="/accept-booking/"
      element={isLoggedIn ? <AcceptBookingReq /> : <Navigate to="/login" />}
      key="manage-bookings"
    />,
    <Route
      path="/multi-step/"
      element={
        isLoggedIn ? <CreateEventMultiStepForm /> : <Navigate to="/login" />
      }
      key="manage-bookings"
    />,
    <Route
      path="/edit-job"
      element={isLoggedIn ? <CreateJobs /> : <Navigate to="/login" />}
      key="event"
    />,
    <Route path="/payment-success" element={<BoostPaymentSuccess />} />,
    <Route path="/hire-payment-success" element={<HirePaymentSuccess />} />,
    <Route path="/hire-cancel" element={<HireCancel />} />,
    <Route
      path="/hire-invite-payment-success"
      element={<HireInvitePaymentSuccess />}
    />,

    <Route path="/success" element={<SuccessScreen />} key="success" />,
  ];
};

export const generateDynamicRoutes = (pages) => {
  return pages.map((page) => (
    <Route
      key={page._id}
      path={page.slug === "home" ? "/" : `/${page.slug}`}
      element={<Genric pages={page} />}
    />
  ));
};
