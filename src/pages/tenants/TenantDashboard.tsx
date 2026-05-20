import { useState } from "react";
import { Layout } from "@/layouts/Layout";
import { PageKey } from "@/layouts/Sidebar";
import { useAppSelector } from "@/store/hooks";

const TenantDashboard = () => {
  const { activeOrganizationId } = useAppSelector((state) => state.role);
  const [currentPage, setCurrentPage] = useState<PageKey>("dashboard");

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <div className="min-h-screen bg-surface-secondary font-sans">
        Hellow Tenant
      </div>
    </Layout>
  );
};

export default TenantDashboard;
