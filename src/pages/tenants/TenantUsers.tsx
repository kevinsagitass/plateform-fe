import { useEffect, useState } from "react";
import { Layout } from "@/layouts/Layout";
import { PageKey } from "@/layouts/Sidebar";
import { useAppSelector } from "@/store/hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Trash2,
  ChevronDown,
  X,
  Check,
  Search,
  MoreHorizontal,
  AlertTriangle,
  ChefHat,
  UserCog,
  BanknoteArrowDown,
} from "lucide-react";
import { TenantRole, TenantUserRole } from "@/types/role";
import { Avatar } from "@/components/ui/Avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAllTenantUsersRole,
  inviteTenantMember,
  removeTenantUser,
} from "@/services/RoleService";
import { useAuth } from "@/hooks/useAuth";

const ROLE_STYLES: Record<TenantRole, string> = {
  STORE_MANAGER:
    "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800",
  CASHIER:
    "bg-info-light dark:bg-info-dark/20 text-info-dark dark:text-info border border-blue-200 dark:border-blue-800",
  COOK: "",
};

const ROLE_ICONS: Record<TenantRole, React.ReactNode> = {
  STORE_MANAGER: <UserCog className="w-3 h-3" />,
  CASHIER: <BanknoteArrowDown className="w-3 h-3" />,
  COOK: <ChefHat className="w-3 h-3" />,
};

// ─── Role Dropdown ────────────────────────────────────────────────────────────

const ROLES: {
  value: TenantRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "STORE_MANAGER",
    label: "Store Manager",
    description: "Manage members, tables, and special menus",
    icon: <UserCog className="w-3.5 h-3.5" />,
  },
  {
    value: "CASHIER",
    label: "Cashier",
    description: "Manage orders and reservations",
    icon: <BanknoteArrowDown className="w-3.5 h-3.5" />,
  },
  {
    value: "COOK",
    label: "Cook",
    description: "See ongoing orders",
    icon: <ChefHat className="w-3.5 h-3.5" />,
  },
];

const RoleDropdown = ({
  currentRole,
  onSelect,
  onClose,
  anchorRect,
}: {
  currentRole: TenantRole;
  onSelect: (role: TenantRole) => void;
  onClose: () => void;
  anchorRect: DOMRect;
}) => {
  const menuWidth = 224; // w-56 = 224px
  const left = anchorRect.left;
  const top = anchorRect.bottom + 6;

  return createPortal(
    <>
      {/* Click-away overlay */}
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        style={{ position: "fixed", top, left, width: menuWidth }}
        className="bg-white dark:bg-neutral-900 rounded-xl shadow-menu border border-neutral-200 dark:border-neutral-700 z-[9999] overflow-hidden"
      >
        <div className="p-1.5">
          {ROLES.map((role) => (
            <button
              key={role.value}
              onClick={() => {
                onSelect(role.value);
                onClose();
              }}
              className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                  ${
                    currentRole === role.value
                      ? "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400"
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  }
                `}
            >
              <span
                className={`
                  flex-shrink-0 p-1 rounded-md
                  ${
                    currentRole === role.value
                      ? "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
                      : "bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                  }
                `}
              >
                {role.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{role.label}</span>
                  {currentRole === role.value && (
                    <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                  )}
                </div>
                <p className="text-2xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                  {role.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </>,
    document.body
  );
};

// ─── Invite Modal ─────────────────────────────────────────────────────────────

const InviteModal = ({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (email: string, role: TenantRole) => void;
}) => {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<TenantRole>("STORE_MANAGER");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleAnchorRect, setRoleAnchorRect] = useState<DOMRect | null>(null);
  const { activeTenantId } = useAppSelector((state) => state.role);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setIsSubmitting(true);
    try {
      await inviteTenantMember(activeTenantId, {
        email,
        role: selectedRole,
      });

      onInvite(email, selectedRole);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === "string") {
        toast.error(error);
      } else {
        toast.error("Failed to create Tenant");
      }

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRoleData = ROLES.find((r) => r.value === selectedRole)!;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 mt-0 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-neutral-950/40 dark:bg-neutral-950/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-modal border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 font-display">
                Invite Member
              </h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                Send an invitation to join your tenant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email Address <span className="text-accent-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                placeholder="colleague@company.com"
                className={`
                  w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm
                  bg-white dark:bg-neutral-800
                  text-neutral-800 dark:text-neutral-100
                  placeholder:text-neutral-300 dark:placeholder:text-neutral-600
                  outline-none transition-all
                  ${
                    emailError
                      ? "border-error dark:border-red-700 focus:border-error focus:ring-2 focus:ring-error/20 dark:focus:ring-red-900/40"
                      : "border-neutral-200 dark:border-neutral-700 focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
                  }
                `}
              />
            </div>
            <AnimatePresence>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-xs text-error dark:text-red-400 flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3" />
                  {emailError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Role
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  if (roleDropdownOpen) {
                    setRoleDropdownOpen(false);
                    setRoleAnchorRect(null);
                  } else {
                    setRoleDropdownOpen(true);
                    setRoleAnchorRect(rect);
                  }
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors text-sm text-neutral-800 dark:text-neutral-200"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400">
                    {selectedRoleData.icon}
                  </span>
                  <div className="text-left">
                    <span className="font-medium">
                      {selectedRoleData.label}
                    </span>
                    <span className="text-neutral-400 dark:text-neutral-500 text-xs ml-2">
                      {selectedRoleData.description}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 transition-transform ${
                    roleDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {roleDropdownOpen && roleAnchorRect && (
                  <RoleDropdown
                    currentRole={selectedRole}
                    onSelect={setSelectedRole}
                    onClose={() => {
                      setRoleDropdownOpen(false);
                      setRoleAnchorRect(null);
                    }}
                    anchorRect={roleAnchorRect}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="flex-1 py-2.5 rounded-xl bg-gradient-warm text-white text-sm font-medium shadow-order hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Sending…
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Invite
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Remove Confirm Modal ─────────────────────────────────────────────────────

const RemoveModal = ({
  user,
  onClose,
  onConfirm,
}: {
  user: TenantUserRole;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const { activeTenantId } = useAppSelector((state) => state.role);
  const queryClient = useQueryClient();

  const handleConfirm = async () => {
    setIsRemoving(true);
    try {
      await removeTenantUser(activeTenantId, user.userId, user.role);
      onConfirm();

      queryClient.invalidateQueries({ queryKey: ["tenantUsersRole"] });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === "string") {
        toast.error(error);
      } else {
        toast.error("Failed to create tenant");
      }
      // Re-throw so the modal stays open on error
      throw error;
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 mt-0 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-neutral-950/40 dark:bg-neutral-950/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-modal border border-neutral-200 dark:border-neutral-700 p-6"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-error-light dark:bg-red-950/50 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-error dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 font-display">
              Remove Member
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
              Are you sure you want to remove{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                {user.name}
              </span>{" "}
              from the tenant? This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isRemoving}
              className="flex-1 py-2.5 rounded-xl bg-error dark:bg-red-700 text-white text-sm font-medium hover:bg-error-dark dark:hover:bg-red-800 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isRemoving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Removing…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Remove
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Row Action Menu ──────────────────────────────────────────────────────────

const RowActionMenu = ({
  user,
  onEditRole,
  onRemove,
  onClose,
  anchorRect,
}: {
  user: TenantUserRole;
  onEditRole: () => void;
  onRemove: () => void;
  onClose: () => void;
  anchorRect: DOMRect;
}) => {
  const menuWidth = 176;
  const left = anchorRect.right - menuWidth;
  const top = anchorRect.bottom + 6;
  const { activeOrganizationId, activeTenantId } = useAppSelector(
    (state) => state.role
  );
  const { user: currentUser } = useAuth();

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{ position: "fixed", top, left, width: menuWidth }}
      className="bg-white dark:bg-neutral-900 rounded-xl shadow-menu border border-neutral-200 dark:border-neutral-700 z-[9999] overflow-hidden"
    >
      <div className="p-1.5 space-y-0.5">
        {currentUser.organizationRoles.some(
          (role) =>
            (role.organizationId === activeOrganizationId &&
              role.role === "OWNER") ||
            currentUser.tenantRoles.some(
              (role) =>
                role.tenantId === activeTenantId &&
                role.role === "STORE_MANAGER"
            )
        ) && (
          <button
            onClick={() => {
              onEditRole();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
          >
            <Shield className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
            Edit Role
          </button>
        )}
        {user.role !== "STORE_MANAGER" && (
          <>
            <div className="h-px bg-neutral-100 dark:bg-neutral-800 mx-1" />
            <button
              onClick={() => {
                onRemove();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-error dark:text-red-400 hover:bg-error-light dark:hover:bg-red-950/40 transition-colors text-left"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove User
            </button>
          </>
        )}
      </div>
    </motion.div>,
    document.body
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const TenantUsers = () => {
  const { activeOrganizationId, activeTenantId } = useAppSelector(
    (state) => state.role
  );
  const [currentPage, setCurrentPage] = useState<PageKey>("users");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: tenantUsersRoleData } = useQuery({
    queryKey: ["tenantUsersRole"],
    queryFn: () => getAllTenantUsersRole(activeTenantId),
  });

  const users = tenantUsersRoleData?.data || [];

  useEffect(() => {
    if (!activeOrganizationId) navigate("/home");
    queryClient.invalidateQueries({ queryKey: ["tenantUsersRole"] });
  }, []);

  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<TenantUserRole | null>(null);
  const [editRoleTarget, setEditRoleTarget] = useState<TenantUserRole | null>(
    null
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuAnchorRect, setMenuAnchorRect] = useState<DOMRect | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (
    userId: string,
    tenantId: string,
    role: string,
    newRole: TenantRole
  ) => {
    setEditRoleTarget(null);
  };

  const handleRemove = (userId: string) => {
    setRemoveTarget(null);
  };

  const handleInvite = () => {
    setInviteOpen(false);
  };

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
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-display tracking-tight">
              Tenant Members
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Manage who has access to your tenant and their roles.
            </p>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-warm text-white text-sm font-semibold shadow-order hover:opacity-90 active:scale-[0.98] transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </motion.div>

        {/* Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-card overflow-hidden"
        >
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members…"
                className="pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-300 dark:placeholder:text-neutral-600 bg-neutral-50 dark:bg-neutral-800 outline-none focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20 transition-all w-64"
              />
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {filteredUsers.length} of {users.length} members
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider hidden md:table-cell">
                    Joined
                  </th>
                  <th className="px-5 py-3 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                <AnimatePresence initial={false}>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                            <Users className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                              No members found
                            </p>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                              Try adjusting your search query.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, idx) => (
                      <motion.tr
                        key={user.userId}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                      >
                        {/* Member */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name} />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              ROLE_STYLES[user.role]
                            }`}
                          >
                            {ROLE_ICONS[user.role]}
                            {ROLES.find((r) => r.value === user.role)?.label ??
                              user.role}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className="text-xs text-neutral-400 dark:text-neutral-500">
                            {new Date(user.joinedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <div className="relative flex justify-end">
                            {user.role !== "STORE_MANAGER" && (
                              <button
                                onClick={(e) => {
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  if (openMenuId === user.userId) {
                                    setOpenMenuId(null);
                                    setMenuAnchorRect(null);
                                  } else {
                                    setOpenMenuId(user.userId);
                                    setMenuAnchorRect(rect);
                                  }
                                }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            )}
                            <AnimatePresence>
                              {openMenuId === user.userId && menuAnchorRect && (
                                <>
                                  <div
                                    className="fixed inset-0 z-[9998]"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setMenuAnchorRect(null);
                                    }}
                                  />
                                  <RowActionMenu
                                    user={user}
                                    anchorRect={menuAnchorRect}
                                    onEditRole={() => setEditRoleTarget(user)}
                                    onRemove={() => setRemoveTarget(user)}
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

          {/* Table Footer */}
          {filteredUsers.length > 0 && (
            <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Showing{" "}
                <span className="font-medium text-neutral-600 dark:text-neutral-400">
                  {filteredUsers.length}
                </span>{" "}
                member{filteredUsers.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Edit Role Modal ── */}
      <AnimatePresence>
        {editRoleTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 mt-0 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setEditRoleTarget(null)
            }
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-950/40 dark:bg-neutral-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-modal border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <Avatar name={editRoleTarget.name} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-display">
                      {editRoleTarget.name}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                      {editRoleTarget.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditRoleTarget(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Role List */}
              <div className="p-3">
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider px-2 mb-2">
                  Select Role
                </p>
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    onClick={() =>
                      handleRoleChange(
                        editRoleTarget.userId,
                        editRoleTarget.tenantId,
                        editRoleTarget.role,
                        role.value
                      )
                    }
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors mb-1
                      ${
                        editRoleTarget.role === role.value
                          ? "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400"
                          : "hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      }
                    `}
                  >
                    <span
                      className={`p-1.5 rounded-lg ${
                        editRoleTarget.role === role.value
                          ? "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
                          : "bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {role.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {role.label}
                        </span>
                        {editRoleTarget.role === role.value && (
                          <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                        {role.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <AnimatePresence>
        {inviteOpen && (
          <InviteModal
            onClose={() => setInviteOpen(false)}
            onInvite={handleInvite}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {removeTarget && (
          <RemoveModal
            user={removeTarget}
            onClose={() => setRemoveTarget(null)}
            onConfirm={() => handleRemove(removeTarget.userId)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default TenantUsers;
