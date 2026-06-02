import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Table2 } from "lucide-react";

interface TableModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  defaultValues?: { number: number };
  onClose: () => void;
  onSubmit: (values: { number: number }) => Promise<void>;
}

const TableModal = ({
  isOpen,
  mode,
  defaultValues,
  onClose,
  onSubmit,
}: TableModalProps) => {
  const [number, setNumber] = useState<number | "">(
    defaultValues?.number ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNumber(defaultValues?.number ?? "");
      setError("");
    }
  }, [isOpen, defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number || number < 1) {
      setError("Table number must be at least 1");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ number: Number(number) });
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setIsSubmitting(false);
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
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-modal border border-neutral-200 dark:border-neutral-700 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order">
                    <Table2 size={18} className="text-white" />
                  </div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                    {mode === "create" ? "Add Table" : "Edit Table"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Table Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={number}
                    onChange={(e) => {
                      setNumber(e.target.value ? Number(e.target.value) : "");
                      setError("");
                    }}
                    placeholder="e.g. 1"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                  />
                  {error && (
                    <p className="text-xs text-red-500 mt-1.5">{error}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-warm text-white shadow-order hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : mode === "create"
                      ? "Add Table"
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TableModal;
