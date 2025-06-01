import React from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../store/userStore";

const PublicRoute = ({ children }) => {
  const { token, user } = useUserStore();

  // Wait until user is fetched after login
  if (token && user?.role) {
    const redirectPath =
      user.role === "SYSTEM_ADMINISTRATOR"
        ? "/admin/dashboard"
        : user.role === "STORE_OWNER"
        ? "/store-owner/dashboard"
        : "/stores";

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;
