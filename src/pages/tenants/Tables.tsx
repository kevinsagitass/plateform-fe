import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table2,
  Search,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
} from "lucide-react";
import { Layout } from "@/layouts/Layout";
import { PageKey } from "@/layouts/Sidebar";
import { useAppSelector } from "@/store/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TableCard from "@/components/tenants/tables/TableCard";
import TableCardSkeleton from "@/components/tenants//tables/TableCardSkeleton";
import TableModal from "@/components/tenants//tables/TableModal";
import DeleteTableModal from "@/components/tenants//tables/DeleteTableModal";
import QRModal from "@/components/tenants//tables/QRModal";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} from "@/services/TableService";
import { Table } from "@/types/table";

// Base URL untuk QR order (sesuaikan dengan domain kamu)
const BASE_ORDER_URL = `${window.location.origin}/order`;

type FilterStatus = "all" | "active" | "inactive";

const Tables = () => {
  const { activeTenantId } = useAppSelector((state) => state.role);
  const [currentPage, setCurrentPage] = useState<PageKey>("tables");
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Table | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Table | null>(null);
  const [qrTarget, setQrTarget] = useState<Table | null>(null);

  const { data: tablesData, isLoading } = useQuery({
    queryKey: ["tables", activeTenantId],
    queryFn: () => getTables(activeTenantId!),
    enabled: !!activeTenantId,
  });

  const tables: Table[] = tablesData?.data || [];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["tables", activeTenantId] });

  const createMutation = useMutation({
    mutationFn: (values: { number: number }) =>
      createTable({ tenantId: activeTenantId!, ...values }),
    onSuccess: () => {
      toast.success("Table created successfully");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      tableId: string;
      number?: number;
      isActive?: boolean;
    }) => updateTable(data),
    onSuccess: () => {
      toast.success("Table updated successfully");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (tableId: string) => deleteTable(tableId),
    onSuccess: () => {
      toast.success("Table deleted successfully");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCreate = async (values: { number: number }) => {
    await createMutation.mutateAsync(values);
  };

  const handleEdit = async (values: { number: number }) => {
    if (!editTarget) return;
    await updateMutation.mutateAsync({
      tableId: editTarget.tableId,
      number: values.number,
    });
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.tableId);
    setDeleteTarget(null);
  };

  const handleToggleActive = async (table: Table) => {
    await updateMutation.mutateAsync({
      tableId: table.tableId,
      isActive: !table.isActive,
    });
    toast.success(
      `Table ${table.number} ${!table.isActive ? "activated" : "deactivated"}`
    );
  };

  // Filter
  const filtered = tables.filter((t) => {
    const matchSearch = t.number.toString().includes(search);
    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "active"
        ? t.isActive
        : !t.isActive;
    return matchSearch && matchStatus;
  });

  const activeCount = tables.filter((t) => t.isActive).length;
  const inactiveCount = tables.filter((t) => !t.isActive).length;

  const stats = [
    {
      label: "Total",
      value: tables.length,
      color:
        "bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400",
      dot: "bg-primary-500",
    },
    {
      label: "Active",
      value: activeCount,
      color:
        "bg-success-light dark:bg-success-dark/20 text-success-dark dark:text-success",
      dot: "bg-success",
    },
    {
      label: "Inactive",
      value: inactiveCount,
      color:
        "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
      dot: "bg-neutral-400 dark:bg-neutral-600",
    },
  ];

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order shrink-0">
                <Table2 size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100">
                  Tables
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Manage restaurant tables & QR codes
                </p>
              </div>
            </div>

            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gradient-warm text-white rounded-xl shadow-order hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus size={16} />
              <span>Add Table</span>
            </button>
          </div>
        </motion.div>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-card p-4 flex items-center gap-3"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}
              >
                <span className={`w-2 h-2 rounded-full ${stat.dot}`} />
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {stat.label}
                </p>
                <p className="font-display font-bold text-lg text-neutral-900 dark:text-neutral-100 leading-none">
                  {isLoading ? "—" : stat.value}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Search & Filter ─────────────────────────────────────────────── */}
        <motion.div
          className="flex items-center gap-3 mb-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by table number..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500/40 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200
                  ${
                    filterStatus !== "all"
                      ? "bg-primary-50 dark:bg-primary-950/40 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-400"
                      : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  }`}
              >
                <SlidersHorizontal size={15} />
                <span className="hidden sm:block">
                  {filterStatus === "all"
                    ? "All Status"
                    : filterStatus === "active"
                    ? "Active"
                    : "Inactive"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-36 rounded-xl shadow-menu border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            >
              {(["all", "active", "inactive"] as FilterStatus[]).map((s) => (
                <DropdownMenuCheckboxItem
                  key={s}
                  checked={filterStatus === s}
                  onCheckedChange={() => setFilterStatus(s)}
                  className="text-sm capitalize cursor-pointer rounded-lg text-neutral-700 dark:text-neutral-300"
                >
                  {s === "all"
                    ? "All Status"
                    : s.charAt(0).toUpperCase() + s.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* ── Result Count ─────────────────────────────────────────────────── */}
        <motion.p
          className="text-sm text-neutral-500 dark:text-neutral-400 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {filtered.length}
          </span>{" "}
          table{filtered.length !== 1 ? "s" : ""} found
        </motion.p>

        {/* ── Grid ────────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <TableCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered
                .sort((a, b) => a.number - b.number)
                .map((table, i) => (
                  <TableCard
                    key={table.tableId}
                    table={table}
                    index={i}
                    onEdit={setEditTarget}
                    onDelete={setDeleteTarget}
                    onToggleActive={handleToggleActive}
                    onShowQR={setQrTarget}
                  />
                ))}
            </div>
          </AnimatePresence>
        ) : (
          /* ── Empty State ─────────────────────────────────────────────── */
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              {search || filterStatus !== "all" ? (
                <Search
                  size={28}
                  className="text-neutral-300 dark:text-neutral-600"
                />
              ) : (
                <LayoutGrid
                  size={28}
                  className="text-neutral-300 dark:text-neutral-600"
                />
              )}
            </div>
            <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {search || filterStatus !== "all"
                ? "No tables match your search"
                : "No tables yet"}
            </p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-5">
              {search || filterStatus !== "all"
                ? "Try different keywords or filters"
                : "Add your first table to generate QR codes"}
            </p>
            {!search && filterStatus === "all" && (
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gradient-warm text-white rounded-xl shadow-order hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus size={16} />
                Add Table
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <TableModal
        isOpen={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <TableModal
        isOpen={!!editTarget}
        mode="edit"
        defaultValues={editTarget ? { number: editTarget.number } : undefined}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
      />
      <DeleteTableModal
        isOpen={!!deleteTarget}
        tableNumber={deleteTarget?.number ?? null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <QRModal
        isOpen={!!qrTarget}
        table={qrTarget}
        baseOrderUrl={BASE_ORDER_URL}
        onClose={() => setQrTarget(null)}
      />
    </Layout>
  );
};

export default Tables;
