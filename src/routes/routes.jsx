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
import DashboardHome from "../pages/Dashboard"
import SuccessScreen from "../components/SuccessScreen";
import ProfileUpdate from "../pages/ProfileUpdate";
import ManagePages from "../components/ManagePages";
import MessagePage from "../pages/MessagePage";
import PaymentPage from "../pages/PaymentPage";

export const getStaticRoutes = (isLoggedIn) => [
  <Route path="/login" element={<Login />} key="login" />,
  <Route path="/register" element={<Register />} key="register" />,
  
  <Route
    path="/dashboard"
    element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
    key="dashboard"
  >
    <Route index element={<DashboardHome />} /> 
    <Route
    path="/dashboard/all-pages"
    element={isLoggedIn ? <ManagePages /> : <Navigate to="/login" />}
    key="all-pages"
  />,
    <Route
    path="/dashboard/all-pages/create-page"
    element={isLoggedIn ? <CreatePage /> : <Navigate to="/login" />}
    key="create-page"
  />,
<Route
    path="/dashboard/create-category"
    element={isLoggedIn ? <CreateCategory /> : <Navigate to="/login" />}
    key="create-category"
  />,
<Route
    path="/dashboard/create-faq"
    element={isLoggedIn ? <CreateFaq /> : <Navigate to="/login" />}
    key="create-faq"
  />,
  <Route
    path="/dashboard/dashboards"
    element={isLoggedIn ? <DashboardHome /> : <Navigate to="/login" />}
    key="dashboards"
  />,
  <Route
    path="/dashboard/profile"
    element={isLoggedIn ? <ProfileUpdate /> : <Navigate to="/login" />}
    key="profile"
  />,
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
  <Route
    path="/dashboard"
    element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
    key="dashboard"
  />,
  <Route path="/success" element={<SuccessScreen />} />
  
];

// Dynamic page routes like /home, /tets
export const generateDynamicRoutes = (pages) => {
  return pages.map((page) => (
    <Route
      key={page._id}
      path={page.slug === "home" ? "/" : `/${page.slug}`}
      element={<Genric pages={page} />}
    />
  ));
};


