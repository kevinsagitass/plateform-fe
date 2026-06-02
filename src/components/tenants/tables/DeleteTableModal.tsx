import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useState } from "react";

interface DeleteTableModalProps {
  isOpen: boolean;
  tableNumber: number | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteTableModal = ({
  isOpen,
  tableNumber,
  onClose,
  onConfirm,
}: DeleteTableModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-modal border border-neutral-200 dark:border-neutral-700 w-full max-w-sm p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
                  <Trash2 size={18} className="text-red-500" />
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Delete Table {tableNumber}?
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
                This action cannot be undone. The QR code for this table will
                also be invalidated.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-red-500 hover:bg-red-600 text-white disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteTableModal;
