import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function GuestRoute() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
}

export default GuestRoute;
