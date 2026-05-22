import { useState } from "react";
import { Layout } from "@/layouts/Layout";
import { PageKey } from "@/layouts/Sidebar";
import { useAppSelector } from "@/store/hooks";

const TenantDashboard = () => {
  const { activeOrganizationId } = useAppSelector((state) => state.role);
  const [currentPage, setCurrentPage] = useState<PageKey>("dashboard");

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      Hellow Tenant
    </Layout>
  );
};

export default TenantDashboard;
