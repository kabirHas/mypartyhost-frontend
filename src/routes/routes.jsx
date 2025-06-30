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
import CreateJobs from "../pages/CreateJobs";
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
import ProfilePage from "../pages/ProfilePage";
import ManageEvents from "../pages/ManageEvents";
import ReviewsManagement from "../pages/ReviewsManagement";
import TransactionManagement from "../pages/TransactionManagement";

export const getStaticRoutes = (isLoggedIn, userRole) => {
  const hasAccess = (allowedRoles) => allowedRoles.includes(userRole);
  return [
  <Route path="/login" element={<Login />} key="login" />,
  <Route path="/register" element={<Register />} key="register" />,

  <Route
    path="/dashboard"
    element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
    key="dashboard"
  >
    {/* <Route index element={<OrganizerDashboard />} />  */}
    <Route index element={<AdminDashboard />} /> 
    <Route
      path="/dashboard/all-pages"
      element={isLoggedIn ? <ManagePages /> : <Navigate to="/login" />}
      key="all-pages"
    />
    ,
    <Route
      path="/dashboard/all-pages/create-page"
      element={isLoggedIn ? <CreatePage /> : <Navigate to="/login" />}
      key="create-page"
    />
    ,
    <Route
      path="/dashboard/create-category"
      element={isLoggedIn ? <CreateCategory /> : <Navigate to="/login" />}
      key="create-category"
    />
    <Route
      path="/dashboard/saved-profile"
      element={isLoggedIn ? <SavedProfiles /> : <Navigate to="/login" />}
      key="saved-profiles"
    />
    ,
    <Route
      path="/dashboard/create-faq"
      element={isLoggedIn ? <CreateFaq /> : <Navigate to="/login" />}
      key="create-faq"
    />
    <Route
      path="/dashboard/alerts"
      element={isLoggedIn ? <Alerts /> : <Navigate to="/login" />}
      key="create-faq"
    />
    <Route
      path="/dashboard/jobs"
      element={isLoggedIn ? <FindJobs /> : <Navigate to="/login" />}
      key="create-faq"
    />
    <Route
      path="/dashboard/support"
      element={isLoggedIn ? <SupportPage /> : <Navigate to="/login" />}
      key="support"
    ></Route>
    <Route
      path="/dashboard/support/ticket"
      element={isLoggedIn ? <Contact /> : <Navigate to="/login" />}
      key="support"
    >
     
    </Route>
    <Route
        path="/dashboard/support/new-ticket"
        element={isLoggedIn ? <ContactSupport /> : <Navigate to="/login" />}
        key="contact"
      />
    <Route
        path="/dashboard/all-profiles"
        element={isLoggedIn ? <AllProfiles /> : <Navigate to="/login" />}
        key="contact"
      />
    <Route
        path="/dashboard/boosted-profiles"
        element={isLoggedIn ? <BoostedProfiles /> : <Navigate to="/login" />}
        key="contact"
      />
    <Route
        path="/dashboard/boosted-profiles"
        element={isLoggedIn ? <BoostedProfiles /> : <Navigate to="/login" />}
        key="contact"
      />
    <Route
        path="/dashboard/admin-settings"
        element={isLoggedIn ? <AdminSettings /> : <Navigate to="/login" />}
        key="contact"
      />
    <Route
        path="/dashboard/content-management"
        element={isLoggedIn ? <ContentManagement /> : <Navigate to="/login" />}
        key="contact"
      />
    <Route
        path="/dashboard/workflow"
        element={isLoggedIn ? <WorkFlow /> : <Navigate to="/login" />}
        key="contact"
      />
    <Route
        path="/dashboard/security"
        element={isLoggedIn ? <Security /> : <Navigate to="/login" />}
        key="contact"
      />
    
    ,
    <Route
      path="/dashboard/dashboards"
      element={isLoggedIn ? <OrganizerDashboard /> : <Navigate to="/login" />}
      key="dashboards"
    />
    ,
    <Route
      path="/dashboard/profile"
      element={isLoggedIn ? <ProfileUpdate /> : <Navigate to="/login" />}
      key="profile"
    />
    <Route
      path="/dashboard/manage-events"
      element={isLoggedIn ? <ManageEvents /> : <Navigate to="/login" />}
      key="profile"
    />,
<Route
      path="/dashboard/manage-reviews"
      element={isLoggedIn ? <ReviewsManagement /> : <Navigate to="/login" />}
      key="profile"
    />,
    <Route
      path="/dashboard/manage-transaction"
      element={isLoggedIn ? <TransactionManagement /> : <Navigate to="/login" />}
      key="profile"
    />,
    
    
    ,
    <Route
      path="/dashboard/manage-jobs"
      element={isLoggedIn ? <ManageJobsLayout /> : <Navigate to="/login" />}
      key="profile"
    >
      <Route index element={<ManageJobs />} />
      <Route path=":id/view" element={<ViewJobDetails />} />
    </Route>
    {/* <Route
      path="/dashboard/manage-jobs/:id/view"
      element={isLoggedIn ? <ViewJobDetails /> : <Navigate to="/login" />}
      key="profile"
    /> */}
    
  <Route
    path="/dashboard/messages"
    element={isLoggedIn ? <MessagePage /> : <Navigate to="/login" />}
    key="messages"
  />,
  <Route
    path="/dashboard/billing"
    element={isLoggedIn ? <PaymentPage /> : <Navigate to="/login" />}
    key="billing"
  />,
  </Route>,

  <Route
    path="/update-page/:id"
    element={isLoggedIn ? <UpdatePage /> : <Navigate to="/login" />}
    key="update-page"
  />,
  <Route path="/create-job" element={isLoggedIn ? <CreateJobs/> : <Navigate to='/login'/>} key='event'/>,
  <Route
    path="/dashboard"
    element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
    key="dashboard"
  />,
  <Route path="/success" element={<SuccessScreen />} />,
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
