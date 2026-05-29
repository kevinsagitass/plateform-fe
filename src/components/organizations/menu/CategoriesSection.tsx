import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Plus,
  Search,
  MoreHorizontal,
  FolderOpen,
  ChevronDown,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";
import {
  getOrganizationMenuCategories,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
} from "@/services/OrganizationMenuService";
import {
  MenuCategory,
  CreateMenuCategoryPayload,
} from "@/types/organizationMenu";
import CategoryModal from "./CategoryModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import MenuRowActionMenu from "./MenuRowActionMenu";

const CategoriesSection = () => {
  const { activeOrganizationId } = useAppSelector((state) => state.role);
  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["menuCategories", activeOrganizationId],
    queryFn: () => getOrganizationMenuCategories(activeOrganizationId),
    enabled: !!activeOrganizationId,
  });

  const categories = categoriesData?.data ?? [];

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MenuCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuCategory | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuAnchorRect, setMenuAnchorRect] = useState<DOMRect | null>(null);

  const filtered = categories.filter((c) =>
    c.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (payload: CreateMenuCategoryPayload) => {
    try {
      await createMenuCategory(activeOrganizationId, payload);
      toast.success("Category created successfully");
      queryClient.invalidateQueries({
        queryKey: ["menuCategories", activeOrganizationId],
      });
      setAddOpen(false);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to create category");
      throw error;
    }
  };

  const handleUpdate = async (payload: CreateMenuCategoryPayload) => {
    if (!editTarget) return;
    try {
      await updateMenuCategory(activeOrganizationId, {
        id: editTarget.id,
        ...payload,
      });
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["menuCategories", activeOrganizationId],
      });
      setEditTarget(null);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to update category");
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMenuCategory(activeOrganizationId, deleteTarget.id);
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["menuCategories", activeOrganizationId],
      });
      setDeleteTarget(null);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to delete category");
      throw error;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-card overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          {/* Left — clickable collapse toggle */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center flex-shrink-0">
              <Tag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-display">
                Menu Categories
              </h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                {categories.length} categor
                {categories.length !== 1 ? "ies" : "y"}
              </p>
            </div>
            <motion.div
              animate={{ rotate: isCollapsed ? -90 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="ml-1 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          {/* Right — search + add (hidden when collapsed) */}
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                key="toolbar-actions"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search categories…"
                    className="pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-300 dark:placeholder:text-neutral-600 bg-neutral-50 dark:bg-neutral-800 outline-none focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20 transition-all w-48"
                  />
                </div>
                <button
                  onClick={() => setAddOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-warm text-white text-sm font-semibold shadow-order hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapsible body */}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider hidden sm:table-cell">
                        Order
                      </th>
                      <th className="px-5 py-3 w-12" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                    <AnimatePresence initial={false}>
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-12 text-center">
                            <div className="flex justify-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-6 h-6 border-2 border-neutral-200 dark:border-neutral-700 border-t-primary-500 rounded-full"
                              />
                            </div>
                          </td>
                        </tr>
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-16 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                <FolderOpen className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                  No categories found
                                </p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                                  {search
                                    ? "Try adjusting your search."
                                    : "Add your first category to get started."}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filtered.map((cat, idx) => (
                          <motion.tr
                            key={cat.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, delay: idx * 0.03 }}
                            className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                          >
                            {/* Category Name */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center flex-shrink-0">
                                  <Tag className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                  {cat.categoryName}
                                </p>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                  cat.isActive
                                    ? "bg-success-light dark:bg-green-950/40 text-success-dark dark:text-green-400 border border-green-200 dark:border-green-800"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    cat.isActive
                                      ? "bg-success"
                                      : "bg-neutral-400"
                                  }`}
                                />
                                {cat.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>

                            {/* Order */}
                            <td className="px-5 py-3.5 hidden sm:table-cell">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                {cat.orderNumber}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-3.5">
                              <div className="relative flex justify-end">
                                <button
                                  onClick={(e) => {
                                    const rect =
                                      e.currentTarget.getBoundingClientRect();
                                    if (openMenuId === cat.id) {
                                      setOpenMenuId(null);
                                      setMenuAnchorRect(null);
                                    } else {
                                      setOpenMenuId(cat.id);
                                      setMenuAnchorRect(rect);
                                    }
                                  }}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                  {openMenuId === cat.id && menuAnchorRect && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-[9998]"
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          setMenuAnchorRect(null);
                                        }}
                                      />
                                      <MenuRowActionMenu
                                        anchorRect={menuAnchorRect}
                                        onEdit={() => setEditTarget(cat)}
                                        onDelete={() => setDeleteTarget(cat)}
                                        onClose={() => {
                                          setOpenMenuId(null);
                                          setMenuAnchorRect(null);
                                        }}
                                      />
                                    </>
                                  )}
                                </AnimatePresence>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              {filtered.length > 0 && (
                <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    Showing{" "}
                    <span className="font-medium text-neutral-600 dark:text-neutral-400">
                      {filtered.length}
                    </span>{" "}
                    of {categories.length} categor
                    {categories.length !== 1 ? "ies" : "y"}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {addOpen && (
          <CategoryModal
            mode="add"
            lastOrderNumber={Math.max(
              ...categories.map((cat) => cat.orderNumber)
            )}
            onClose={() => setAddOpen(false)}
            onSubmit={handleCreate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editTarget && (
          <CategoryModal
            mode="edit"
            category={editTarget}
            onClose={() => setEditTarget(null)}
            onSubmit={handleUpdate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            title="Delete Category"
            description={
              <>
                Are you sure you want to delete{" "}
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {deleteTarget.categoryName}
                </span>
                ? All menu items in this category will be unlinked. This action
                cannot be undone.
              </>
            }
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoriesSection;
