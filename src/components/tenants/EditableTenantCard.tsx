import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TenantWorkHour } from "@/types/tenant";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Tenant {
  tenantId: string;
  tenantName: string;
  tenantLocation: string;
  isActive: boolean;
  tenantWorkHours?: TenantWorkHour[];
}

interface TenantCardProps {
  tenant: Tenant;
  index: number;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
  onToggleActive: (tenant: Tenant) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Work Hours Modal ─────────────────────────────────────────────────────────

const WorkHoursModal = ({
  tenant,
  onClose,
}: {
  tenant: Tenant;
  onClose: () => void;
}) => {
  const workHours = tenant.tenantWorkHours ?? [];
  const activeDays = workHours.filter((w) => w.isActive);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-modal border border-neutral-200 dark:border-neutral-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center shadow-order shrink-0">
                <Clock size={15} className="text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  Operating Hours
                </h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate max-w-[180px]">
                  {tenant.tenantName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            {workHours.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Clock
                    size={18}
                    className="text-neutral-300 dark:text-neutral-600"
                  />
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No operating hours set
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {DAY_NAMES.map((day, idx) => {
                  const wh = workHours.find((w) => w.dayOfMonth === idx);
                  const isActive = wh?.isActive ?? false;

                  return (
                    <div
                      key={day}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-neutral-50 dark:bg-neutral-800/60"
                          : "opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5 w-14">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            isActive
                              ? "bg-primary-500"
                              : "bg-neutral-300 dark:bg-neutral-600"
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isActive
                              ? "text-neutral-800 dark:text-neutral-200"
                              : "text-neutral-400 dark:text-neutral-600"
                          )}
                        >
                          {day}
                        </span>
                      </div>

                      {isActive && wh ? (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                          <span className="font-mono bg-neutral-100 dark:bg-neutral-700 px-2 py-0.5 rounded-md">
                            {wh.openHour.slice(0, 5)}
                          </span>
                          <span className="text-neutral-300 dark:text-neutral-600">
                            —
                          </span>
                          <span className="font-mono bg-neutral-100 dark:bg-neutral-700 px-2 py-0.5 rounded-md">
                            {wh.closeHour.slice(0, 5)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400 dark:text-neutral-600 italic">
                          Closed
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {activeDays.length > 0 && (
            <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Open{" "}
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {activeDays.length}
                </span>{" "}
                day{activeDays.length !== 1 ? "s" : ""} a week
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

// ─── Main Card ────────────────────────────────────────────────────────────────

const EditableTenantCard = ({
  tenant,
  index,
  onEdit,
  onDelete,
  onToggleActive,
}: TenantCardProps) => {
  const [showWorkHours, setShowWorkHours] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{
          delay: index * 0.05,
          type: "spring",
          stiffness: 300,
          damping: 28,
        }}
        className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 p-4"
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order shrink-0">
              <Store size={18} className="text-white" />
            </div>

            {/* Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                  {tenant.tenantName}
                </h3>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold shrink-0
                    ${
                      tenant.isActive
                        ? "bg-success-light dark:bg-success-dark/20 text-success-dark dark:text-success"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      tenant.isActive
                        ? "bg-success"
                        : "bg-neutral-400 dark:bg-neutral-600"
                    }`}
                  />
                  {tenant.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin
                  size={12}
                  className="text-neutral-400 dark:text-neutral-500 shrink-0"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {tenant.tenantLocation}
                </p>
              </div>

              {/* Work Hours Link */}
              <button
                type="button"
                onClick={() => setShowWorkHours(true)}
                className="inline-flex items-center gap-1 mt-1.5 text-2xs font-medium text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 hover:underline transition-colors"
              >
                <Clock size={10} />
                View hours
              </button>
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-xl shadow-menu border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            >
              <DropdownMenuItem
                onClick={() => onEdit(tenant)}
                className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <Pencil size={14} />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onToggleActive(tenant)}
                className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                {tenant.isActive ? (
                  <>
                    <XCircle size={14} />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    Activate
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800" />

              <DropdownMenuItem
                onClick={() => onDelete(tenant)}
                className="flex items-center gap-2 text-sm text-error dark:text-red-400 cursor-pointer rounded-lg focus:text-error dark:focus:text-red-400 focus:bg-error-light dark:focus:bg-red-950/40"
              >
                <Trash2 size={14} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {showWorkHours && (
        <WorkHoursModal
          tenant={tenant}
          onClose={() => setShowWorkHours(false)}
        />
      )}
    </>
  );
};

export default EditableTenantCard;
