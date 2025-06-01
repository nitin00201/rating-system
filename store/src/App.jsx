import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import SignupPage from './pages/Signup';
import SignInPage from './pages/Signin';
import StoreListPage from './pages/StoreListPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ChangePasswordForm from './pages/ChangePasswordForm';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProfilePage from './pages/ProfilePage';
import Unauthorized from './pages/Unauthorized ';
import NotFound from './pages/NotFound';

import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute'; 
import UserProfile from './pages/UserProfile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/signin" />} />

        {/* Public Auth Routes */}
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordForm />} />
        <Route path="/users/:id" element={<UserProfile />} />


        {/* Protected Routes */}
        <Route
          path="/stores"
          element={
            <PrivateRoute>
              <StoreListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/store-owner/dashboard"
          element={
            <PrivateRoute>
              <StoreOwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Public Utility Routes */}
        <Route path="/unauthorised" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
