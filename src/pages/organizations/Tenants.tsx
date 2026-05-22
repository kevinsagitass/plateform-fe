import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Search,
  Plus,
  SlidersHorizontal,
  Building2,
} from "lucide-react";
import { Layout } from "@/layouts/Layout";
import { PageKey } from "@/layouts/Sidebar";
import { useAppSelector } from "@/store/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import EditableTenantCard from "@/components/tenants/EditableTenantCard";
import TenantCardSkeleton from "@/components/tenants/TenantCardSkeleton";
import TenantModal from "@/components/tenants/TenantModal";
import DeleteTenantModal from "@/components/tenants/DeleteTenantModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserTenants } from "@/services/TenantService";

const createTenant = async (data: {
  organizationId: string;
  tenantName: string;
  tenantLocation: string;
}) => {
  const res = await fetch(`/api/organizations/${data.organizationId}/tenants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create tenant");
  return res.json();
};

const updateTenant = async (data: {
  id: string;
  tenantName: string;
  tenantLocation: string;
  isActive: boolean;
}) => {
  const res = await fetch(`/api/tenants/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update tenant");
  return res.json();
};

const deleteTenant = async (id: string) => {
  const res = await fetch(`/api/tenants/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete tenant");
};

type FilterStatus = "all" | "active" | "inactive";

const Tenants = () => {
  const { activeOrganizationId } = useAppSelector((state) => state.role);
  const [currentPage, setCurrentPage] = useState<PageKey>("tenants");
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const { data: tenants, isLoading } = useQuery({
    queryKey: ["tenants", activeOrganizationId],
    queryFn: () => getUserTenants(activeOrganizationId),
    enabled: !!activeOrganizationId,
  });

  const tenantsData = tenants?.data || [];

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["tenants", activeOrganizationId],
    });

  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      toast.success("Tenant created successfully");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateTenant,
    onSuccess: () => {
      toast.success("Tenant updated successfully");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      toast.success("Tenant deleted successfully");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCreate = async (values: {
    tenantName: string;
    tenantLocation: string;
  }) => {
    await createMutation.mutateAsync({
      organizationId: activeOrganizationId,
      ...values,
    });
  };

  const handleEdit = async (values: {
    tenantName: string;
    tenantLocation: string;
  }) => {
    if (!editTarget) return;
    await updateMutation.mutateAsync({
      id: editTarget.id,
      isActive: editTarget.isActive,
      ...values,
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
  };

  const handleToggleActive = async (tenant: any) => {
    await updateMutation.mutateAsync({
      id: tenant.id,
      tenantName: tenant.tenantName,
      tenantLocation: tenant.tenantLocation,
      isActive: !tenant.isActive,
    });
    toast.success(
      `${tenant.tenantName} ${!tenant.isActive ? "activated" : "deactivated"}`
    );
  };

  const filtered = tenantsData.filter((t) => {
    const matchSearch =
      t.tenantName.toLowerCase().includes(search.toLowerCase()) ||
      t.tenantLocation.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "active"
        ? t.isActive
        : !t.isActive;
    return matchSearch && matchStatus;
  });

  const activeCount = tenantsData.filter((t) => t.isActive).length;
  const inactiveCount = tenantsData.filter((t) => !t.isActive).length;

  // Stats config
  const stats = [
    {
      label: "Total",
      value: tenantsData.length,
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
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order shrink-0">
                <Store size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100">
                  Tenants
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Manage your store locations
                </p>
              </div>
            </div>

            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gradient-warm text-white rounded-xl shadow-order hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus size={16} />
              <span>Add Tenant</span>
            </button>
          </div>
        </motion.div>

        {/* ── Stats Row ───────────────────────────────────────────────────── */}
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
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tenants..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500/40 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200"
            />
          </div>

          {/* Filter */}
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
          tenant{filtered.length !== 1 ? "s" : ""} found
        </motion.p>

        {/* ── Grid ────────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <TenantCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((tenant, i) => (
                <EditableTenantCard
                  key={tenant.tenantId}
                  tenant={tenant}
                  index={i}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          </AnimatePresence>
        ) : (
          /* ── Empty State ──────────────────────────────────────────────── */
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
                <Building2
                  size={28}
                  className="text-neutral-300 dark:text-neutral-600"
                />
              )}
            </div>
            <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {search || filterStatus !== "all"
                ? "No tenants match your search"
                : "No tenants yet"}
            </p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-5">
              {search || filterStatus !== "all"
                ? "Try different keywords or filters"
                : "Add your first store location to get started"}
            </p>
            {!search && filterStatus === "all" && (
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gradient-warm text-white rounded-xl shadow-order hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus size={16} />
                Add Tenant
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <TenantModal
        isOpen={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <TenantModal
        isOpen={!!editTarget}
        mode="edit"
        defaultValues={
          editTarget
            ? {
                tenantName: editTarget.tenantName,
                tenantLocation: editTarget.tenantLocation,
              }
            : undefined
        }
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
      />
      <DeleteTenantModal
        isOpen={!!deleteTarget}
        tenantName={deleteTarget?.tenantName ?? ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
};

export default Tenants;
