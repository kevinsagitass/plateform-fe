import { motion } from "framer-motion";
import {
  Store,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Tenant {
  tenantId: string;
  tenantName: string;
  tenantLocation: string;
  isActive: boolean;
}

interface TenantCardProps {
  tenant: Tenant;
  index: number;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
  onToggleActive: (tenant: Tenant) => void;
}

const EditableTenantCard = ({
  tenant,
  index,
  onEdit,
  onDelete,
  onToggleActive,
}: TenantCardProps) => {
  return (
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
      className="group bg-surface rounded-2xl border border-neutral-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left */}
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order flex-shrink-0">
            <Store size={18} className="text-white" />
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-sm text-neutral-900 truncate">
                {tenant.tenantName}
              </h3>
              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold flex-shrink-0
                  ${
                    tenant.isActive
                      ? "bg-success-light text-success-dark"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    tenant.isActive ? "bg-success" : "bg-neutral-400"
                  }`}
                />
                {tenant.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} className="text-neutral-400 flex-shrink-0" />
              <p className="text-xs text-neutral-500 truncate">
                {tenant.tenantLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 rounded-xl shadow-menu border-neutral-200"
          >
            <DropdownMenuItem
              onClick={() => onEdit(tenant)}
              className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer rounded-lg"
            >
              <Pencil size={14} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onToggleActive(tenant)}
              className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer rounded-lg"
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(tenant)}
              className="flex items-center gap-2 text-sm text-error cursor-pointer rounded-lg focus:text-error focus:bg-error-light"
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default EditableTenantCard;
