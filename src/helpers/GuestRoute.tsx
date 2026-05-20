import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";

function GuestRoute() {
  const { isAuthenticated } = useAuth();
  const role = useAppSelector((state) => state.role);

  if (isAuthenticated) {
    if (role.activeOrganizationId && role.activeTenantId)
      return (
        <Navigate
          to={`/organization/${role.activeOrganizationId}/${role.activeTenantId}/dashboard`}
          replace
        />
      );
    else if (role.activeOrganizationId && !role.activeTenantId)
      return (
        <Navigate
          to={`/organization/${role.activeOrganizationId}/dashboard`}
          replace
        />
      );
    else return <Navigate to={`/home`} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
