import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) return <Spinner />; // Show spinner while loading

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
