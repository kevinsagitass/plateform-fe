import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import ModalWrapper from "./ModalWrapper";

interface DeleteConfirmModalProps {
  title: string;
  description: React.ReactNode;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteConfirmModal = ({
  title,
  description,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose} maxWidth="max-w-sm">
      <div className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-error-light dark:bg-red-950/50 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-error dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 font-display">
              {title}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
              {description}
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
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl bg-error dark:bg-red-700 text-white text-sm font-medium hover:bg-error-dark dark:hover:bg-red-800 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
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
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeleteConfirmModal;
