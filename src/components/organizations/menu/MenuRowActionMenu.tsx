import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

interface MenuRowActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  anchorRect: DOMRect;
}

const MenuRowActionMenu = ({
  onEdit,
  onDelete,
  onClose,
  anchorRect,
}: MenuRowActionMenuProps) => {
  const menuWidth = 160;
  const left = anchorRect.right - menuWidth;
  const top = anchorRect.bottom + 6;

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
        <button
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
        >
          <Pencil className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
          Edit
        </button>
        <div className="h-px bg-neutral-100 dark:bg-neutral-800 mx-1" />
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-error dark:text-red-400 hover:bg-error-light dark:hover:bg-red-950/40 transition-colors text-left"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </motion.div>,
    document.body
  );
};

export default MenuRowActionMenu;
