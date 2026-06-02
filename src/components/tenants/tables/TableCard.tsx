import { motion } from "framer-motion";
import { QrCode, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Table } from "@/types/table";

interface TableCardProps {
  table: Table;
  index: number;
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
  onToggleActive: (table: Table) => void;
  onShowQR: (table: Table) => void;
}

const TableCard = ({
  table,
  index,
  onEdit,
  onDelete,
  onToggleActive,
  onShowQR,
}: TableCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className={`
        bg-white dark:bg-neutral-900
        border rounded-2xl shadow-card p-4
        transition-colors duration-200
        ${
          table.isActive
            ? "border-neutral-200 dark:border-neutral-700"
            : "border-neutral-100 dark:border-neutral-800 opacity-60"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-lg
              ${
                table.isActive
                  ? "bg-gradient-warm text-white shadow-order"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600"
              }
            `}
          >
            {table.number}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
              Table {table.number}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`
                  inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
                  ${
                    table.isActive
                      ? "bg-success-light dark:bg-success-dark/20 text-success-dark dark:text-success"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                  }
                `}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    table.isActive ? "bg-success" : "bg-neutral-400"
                  }`}
                />
                {table.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* QR */}
          <button
            onClick={() => onShowQR(table)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40 dark:hover:text-primary-400 transition-all duration-150"
            title="Show QR Code"
          >
            <QrCode size={15} />
          </button>

          {/* Toggle */}
          <button
            onClick={() => onToggleActive(table)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 dark:hover:text-amber-400 transition-all duration-150"
            title={table.isActive ? "Deactivate" : "Activate"}
          >
            {table.isActive ? (
              <ToggleRight size={15} />
            ) : (
              <ToggleLeft size={15} />
            )}
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(table)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40 dark:hover:text-primary-400 transition-all duration-150"
            title="Edit"
          >
            <Pencil size={14} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(table)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-all duration-150"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TableCard;
