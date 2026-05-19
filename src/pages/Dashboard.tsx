import React, { useState } from "react";
import { PageKey } from "../layouts/Sidebar";
import { Layout } from "../layouts/Layout";

export const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageKey>("dashboard");

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <div>Dashboard Nih</div>
    </Layout>
  );
};
