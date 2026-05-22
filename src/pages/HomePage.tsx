import { useState } from "react";
import { Layout } from "@/layouts/Layout";
import { PageKey } from "@/layouts/Sidebar";
import { useAppSelector } from "@/store/hooks";
import OrganizationHome from "@/components/organizations/OrganizationHome";
import TenantHome from "@/components/tenants/TenantHome";

const HomePage = () => {
  const { activeOrganizationId } = useAppSelector((state) => state.role);
  const [currentPage, setCurrentPage] = useState<PageKey>("home");

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {activeOrganizationId != null ? <TenantHome /> : <OrganizationHome />}
    </Layout>
  );
};

export default HomePage;
