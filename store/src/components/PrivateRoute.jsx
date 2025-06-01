import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

const PrivateRoute = ({ children }) => {
  const { token } = useUserStore();

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;
