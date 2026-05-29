import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Plus,
  Search,
  MoreHorizontal,
  Tag,
  ChevronDown,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";
import {
  getOrganizationMenuItems,
  getOrganizationMenuCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/services/OrganizationMenuService";
import { MenuItem, CreateMenuItemPayload } from "@/types/organizationMenu";
import MenuItemModal from "./MenuItemModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import MenuRowActionMenu from "./MenuRowActionMenu";
import AddonGroupsPanel from "./AddonGroupsPanel";

const ITEMS_PER_PAGE = 10;

const MenuItemsSection = () => {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const debouncedSearch = useDebounce(search, 200);

  const { activeOrganizationId } = useAppSelector((state) => state.role);
  const queryClient = useQueryClient();

  const { data: itemsData, isLoading } = useQuery({
    queryKey: [
      "menuItems",
      activeOrganizationId,
      currentPage,
      debouncedSearch,
      categoryFilter,
    ],
    queryFn: () =>
      getOrganizationMenuItems(activeOrganizationId, {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch || undefined,
        categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
      }),
    enabled: !!activeOrganizationId,
    placeholderData: (prev) => prev,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["menuCategories", activeOrganizationId],
    queryFn: () => getOrganizationMenuCategories(activeOrganizationId),
    enabled: !!activeOrganizationId,
  });

  const items = itemsData?.data?.result ?? [];
  const pagination = itemsData?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.total ?? 0;
  const categories = categoriesData?.data ?? [];

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuAnchorRect, setMenuAnchorRect] = useState<DOMRect | null>(null);

  // Reset page ke 1 saat search/filter berubah
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleCreate = async (payload: CreateMenuItemPayload) => {
    try {
      await createMenuItem(activeOrganizationId, payload);
      toast.success("Menu item added successfully");
      queryClient.invalidateQueries({
        queryKey: ["menuItems", activeOrganizationId],
      });
      setAddOpen(false);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to add menu item");
      throw error;
    }
  };

  const handleUpdate = async (payload: CreateMenuItemPayload) => {
    if (!editTarget) return;
    try {
      await updateMenuItem(activeOrganizationId, editTarget.id, payload);
      toast.success("Menu item updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["menuItems", activeOrganizationId],
      });
      setEditTarget(null);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to update menu item");
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMenuItem(activeOrganizationId, deleteTarget.id);
      toast.success("Menu item deleted successfully");
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["menuItems", activeOrganizationId],
        });
      }
      setDeleteTarget(null);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to delete menu item");
      throw error;
    }
  };

  const formatPrice = (price: number, discount: number) => {
    const discounted = price - (price * discount) / 100;
    return { original: price.toFixed(2), discounted: discounted.toFixed(2) };
  };

  const getPageNumbers = () => {
    const delta = 1;
    const range: (number | "...")[] = [];
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        range.push(i);
      } else if (i === left - 1 || i === right + 1) {
        range.push("...");
      }
    }
    return range;
  };

  const startItem = pagination
    ? (pagination.page - 1) * pagination.limit + 1
    : 0;
  const endItem = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-card overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex flex-col gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Left — collapse toggle */}
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary-50 dark:bg-secondary-950/40 flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-display">
                  Menu Items
                </h2>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
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

            {/* Right — search + add */}
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
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search items…"
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

          {/* Category Filter Tabs */}
          <AnimatePresence initial={false}>
            {!isCollapsed && categories.length > 0 && (
              <motion.div
                key="category-tabs"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                  <button
                    onClick={() => handleCategoryFilterChange("all")}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      categoryFilter === "all"
                        ? "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryFilterChange(cat.id)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        categoryFilter === cat.id
                          ? "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                          : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {cat.categoryName}
                    </button>
                  ))}
                </div>
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
                        Item
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider hidden md:table-cell">
                        Category
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider hidden sm:table-cell">
                        Status
                      </th>
                      <th className="px-5 py-3 w-12" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                    <AnimatePresence initial={false}>
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-12 text-center">
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
                      ) : items.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-16 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                <UtensilsCrossed className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                  No menu items found
                                </p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                                  {search || categoryFilter !== "all"
                                    ? "Try adjusting your filters."
                                    : "Add your first menu item to get started."}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        items.map((item, idx) => {
                          const { original, discounted } = formatPrice(
                            item.price,
                            item.discount
                          );
                          const hasDiscount = item.discount > 0;
                          const catName = item.category.categoryName;

                          return (
                            <>
                              <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{
                                  duration: 0.2,
                                  delay: idx * 0.03,
                                }}
                                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                              >
                                {/* Item */}
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-secondary-50 dark:bg-secondary-950/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                      {item.imagePath ? (
                                        <img
                                          src={`${
                                            import.meta.env.VITE_BASE_URL
                                          }/${item.imagePath}`}
                                          alt={item.name}
                                          className="w-full h-full object-cover rounded-lg"
                                          onError={(e) => {
                                            (
                                              e.target as HTMLImageElement
                                            ).style.display = "none";
                                          }}
                                        />
                                      ) : (
                                        <UtensilsCrossed className="w-3.5 h-3.5 text-secondary-600 dark:text-secondary-400" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                        {item.name}
                                      </p>
                                      {item.description && (
                                        <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate max-w-[200px]">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Category */}
                                <td className="px-5 py-3.5 hidden md:table-cell">
                                  {catName ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800">
                                      <Tag className="w-3 h-3" />
                                      {catName}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                      —
                                    </span>
                                  )}
                                </td>

                                {/* Price */}
                                <td className="px-5 py-3.5">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                      ${discounted}
                                    </span>
                                    {hasDiscount && (
                                      <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through">
                                        ${original}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Status */}
                                <td className="px-5 py-3.5 hidden sm:table-cell">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                      item.isActive
                                        ? "bg-success-light dark:bg-green-950/40 text-success-dark dark:text-green-400 border border-green-200 dark:border-green-800"
                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        item.isActive
                                          ? "bg-success"
                                          : "bg-neutral-400"
                                      }`}
                                    />
                                    {item.isActive ? "Active" : "Inactive"}
                                  </span>
                                </td>

                                {/* Actions */}
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() =>
                                        setExpandedItemId((prev) =>
                                          prev === item.id ? null : item.id
                                        )
                                      }
                                      title="Manage addon groups"
                                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                                        expandedItemId === item.id
                                          ? "bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 !opacity-100"
                                          : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                      }`}
                                    >
                                      <Layers className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        const rect =
                                          e.currentTarget.getBoundingClientRect();
                                        if (openMenuId === item.id) {
                                          setOpenMenuId(null);
                                          setMenuAnchorRect(null);
                                        } else {
                                          setOpenMenuId(item.id);
                                          setMenuAnchorRect(rect);
                                        }
                                      }}
                                      className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>

                                    <AnimatePresence>
                                      {openMenuId === item.id &&
                                        menuAnchorRect && (
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
                                              onEdit={() => setEditTarget(item)}
                                              onDelete={() =>
                                                setDeleteTarget(item)
                                              }
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

                              {/* Expanded addon groups row */}
                              <AnimatePresence initial={false}>
                                {expandedItemId === item.id && (
                                  <motion.tr
                                    key={`${item.id}-addons`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <td
                                      colSpan={5}
                                      className="px-6 py-4 bg-neutral-50/80 dark:bg-neutral-800/40 border-b border-neutral-100 dark:border-neutral-800"
                                    >
                                      <AddonGroupsPanel
                                        menuItemId={item.id}
                                        menuItemName={item.name}
                                      />
                                    </td>
                                  </motion.tr>
                                )}
                              </AnimatePresence>
                            </>
                          );
                        })
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Footer + Pagination */}
              {!isLoading && totalItems > 0 && (
                <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Info */}
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 flex-shrink-0">
                    Showing{" "}
                    <span className="font-medium text-neutral-600 dark:text-neutral-400">
                      {startItem}–{endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-neutral-600 dark:text-neutral-400">
                      {totalItems}
                    </span>{" "}
                    item{totalItems !== 1 ? "s" : ""}
                  </p>

                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      {/* First */}
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-600 dark:hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="First page"
                      >
                        <ChevronsLeft className="w-3.5 h-3.5" />
                      </button>

                      {/* Prev */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-600 dark:hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Previous page"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      {/* Page numbers */}
                      {getPageNumbers().map((page, i) =>
                        page === "..." ? (
                          <span
                            key={`ellipsis-${i}`}
                            className="w-7 h-7 flex items-center justify-center text-xs text-neutral-400 dark:text-neutral-500"
                          >
                            ···
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                              currentPage === page
                                ? "bg-primary-500 text-white shadow-sm"
                                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-200"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      {/* Next */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-600 dark:hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Next page"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Last */}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-600 dark:hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Last page"
                      >
                        <ChevronsRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {addOpen && (
          <MenuItemModal
            mode="add"
            categories={categories}
            onClose={() => setAddOpen(false)}
            onSubmit={handleCreate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editTarget && (
          <MenuItemModal
            mode="edit"
            item={editTarget}
            categories={categories}
            onClose={() => setEditTarget(null)}
            onSubmit={handleUpdate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            title="Delete Menu Item"
            description={
              <>
                Are you sure you want to delete{" "}
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {deleteTarget.name}
                </span>
                ? This action cannot be undone.
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

export default MenuItemsSection;
