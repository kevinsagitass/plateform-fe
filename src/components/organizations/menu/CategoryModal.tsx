import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, AlertTriangle, Plus, Pencil } from "lucide-react";
import {
  MenuCategory,
  CreateMenuCategoryPayload,
} from "@/types/organizationMenu";
import ModalWrapper from "./ModalWrapper";

interface CategoryModalProps {
  mode: "add" | "edit";
  category?: MenuCategory;
  lastOrderNumber?: number;
  onClose: () => void;
  onSubmit: (payload: CreateMenuCategoryPayload) => Promise<void>;
}

const CategoryModal = ({
  mode,
  category,
  lastOrderNumber,
  onClose,
  onSubmit,
}: CategoryModalProps) => {
  const [categoryName, setCategoryName] = useState(
    category?.categoryName ?? ""
  );
  const [orderNumber, setOrderNumber] = useState<number>(
    category?.orderNumber ?? lastOrderNumber + 1
  );
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName);
      setOrderNumber(category.orderNumber);
      setIsActive(category.isActive);
    }
  }, [category]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!categoryName.trim())
      newErrors.categoryName = "Category name is required.";
    if (!orderNumber || orderNumber < 1)
      newErrors.orderNumber = "Order must be at least 1.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit({
        categoryName: categoryName.trim(),
        orderNumber,
        isActive,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = mode === "edit";

  return (
    <ModalWrapper onClose={onClose} maxWidth="max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
            {isEdit ? (
              <Pencil className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            ) : (
              <Plus className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            )}
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 font-display">
              {isEdit ? "Edit Category" : "Add Category"}
            </h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              {isEdit
                ? "Update the menu category details"
                : "Create a new menu category"}
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
        {/* Category Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Category Name <span className="text-accent-500">*</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                if (errors.categoryName)
                  setErrors((p) => ({ ...p, categoryName: "" }));
              }}
              placeholder="e.g. Appetizers"
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-300 dark:placeholder:text-neutral-600 outline-none transition-all ${
                errors.categoryName
                  ? "border-error dark:border-red-700 focus:border-error focus:ring-2 focus:ring-error/20"
                  : "border-neutral-200 dark:border-neutral-700 focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
              }`}
            />
          </div>
          <AnimatePresence>
            {errors.categoryName && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-xs text-error dark:text-red-400 flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                {errors.categoryName}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Order Number */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Display Order <span className="text-accent-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={orderNumber}
            onChange={(e) => {
              setOrderNumber(Number(e.target.value));
              if (errors.orderNumber)
                setErrors((p) => ({ ...p, orderNumber: "" }));
            }}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 outline-none transition-all ${
              errors.orderNumber
                ? "border-error dark:border-red-700 focus:border-error focus:ring-2 focus:ring-error/20"
                : "border-neutral-200 dark:border-neutral-700 focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
            }`}
          />
          <AnimatePresence>
            {errors.orderNumber && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-xs text-error dark:text-red-400 flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                {errors.orderNumber}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Is Active Toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Active
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              Inactive categories are hidden from the menu
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsActive((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isActive ? "bg-primary-500" : "bg-neutral-200 dark:bg-neutral-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
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
            disabled={isSubmitting}
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
                {isEdit ? "Saving…" : "Creating…"}
              </>
            ) : isEdit ? (
              <>
                <Pencil className="w-4 h-4" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Category
              </>
            )}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default CategoryModal;
