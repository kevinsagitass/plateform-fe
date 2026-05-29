import { useEffect, useState } from "react";
import { Layout } from "@/layouts/Layout";
import { PageKey } from "@/layouts/Sidebar";
import { useAppSelector } from "@/store/hooks";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoriesSection from "@/components/organizations/menu/CategoriesSection";
import MenuItemsSection from "@/components/organizations/menu/MenuitemsSection";

const OrgMenus = () => {
  const { activeOrganizationId } = useAppSelector((state) => state.role);
  const [currentPage, setCurrentPage] = useState<PageKey>("organization-menus");
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeOrganizationId) navigate("/home");
  }, [activeOrganizationId, navigate]);

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-display tracking-tight">
                Organization Menu
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Manage your menu categories and items.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Categories Section */}
        <CategoriesSection />

        {/* Menu Items Section */}
        <MenuItemsSection />
      </div>
    </Layout>
  );
};

export default OrgMenus;
