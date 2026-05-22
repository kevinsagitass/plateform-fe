import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteTenantModalProps {
  isOpen: boolean;
  tenantName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteTenantModal = ({
  isOpen,
  tenantName,
  onClose,
  onConfirm,
}: DeleteTenantModalProps) => {
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

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isDeleting) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdrop}
        >
          <motion.div
            className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-modal border border-neutral-200 dark:border-neutral-700"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="p-6">
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-error-light dark:bg-red-950/50 flex items-center justify-center mb-4">
                <AlertTriangle
                  size={22}
                  className="text-error dark:text-red-400"
                />
              </div>

              <h2 className="font-display font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-1">
                Delete Tenant
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {tenantName}
                </span>
                ? This action cannot be undone and will remove all associated
                data.
              </p>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none bg-error dark:bg-red-700 hover:bg-error-dark dark:hover:bg-red-800 hover:shadow-lg hover:-translate-y-0.5"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={15} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteTenantModal;
