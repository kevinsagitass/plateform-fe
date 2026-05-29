import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Plus, Pencil, Tag, DollarSign } from "lucide-react";
import { Addon, CreateAddonPayload } from "@/types/organizationMenu";
import ModalWrapper from "./ModalWrapper";

interface AddonModalProps {
  mode: "add" | "edit";
  addon?: Addon;
  onClose: () => void;
  onSubmit: (payload: CreateAddonPayload) => Promise<void>;
}

const AddonModal = ({ mode, addon, onClose, onSubmit }: AddonModalProps) => {
  const [name, setName] = useState(addon?.name ?? "");
  const [price, setPrice] = useState(addon?.price ?? 0);
  const [isAvailable, setIsAvailable] = useState(addon?.isAvailable ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === "edit";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Addon name is required.";
    if (price < 0) e.price = "Price must be 0 or greater.";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), price, isAvailable });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-300 dark:placeholder:text-neutral-600 outline-none transition-all";
  const inputNormal =
    "border-neutral-200 dark:border-neutral-700 focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20";
  const inputError =
    "border-error dark:border-red-700 focus:border-error focus:ring-2 focus:ring-error/20";

  const FieldError = ({ field }: { field: string }) => (
    <AnimatePresence>
      {errors[field] && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-xs text-error dark:text-red-400 flex items-center gap-1"
        >
          <AlertTriangle className="w-3 h-3" />
          {errors[field]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <ModalWrapper onClose={onClose} maxWidth="max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
            {isEdit ? (
              <Pencil className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            ) : (
              <Tag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            )}
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 font-display">
              {isEdit ? "Edit Addon" : "Add Addon"}
            </h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              {isEdit
                ? "Update addon details"
                : "Add a new option to this group"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Addon Name <span className="text-accent-500">*</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: "" }));
              }}
              placeholder="e.g. Extra Cheese"
              className={`${inputBase} pl-9 ${
                errors.name ? inputError : inputNormal
              }`}
            />
          </div>
          <FieldError field="name" />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Price <span className="text-accent-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <input
              type="number"
              min={0}
              step={1000}
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value));
                if (errors.price) setErrors((p) => ({ ...p, price: "" }));
              }}
              className={`${inputBase} pl-9 ${
                errors.price ? inputError : inputNormal
              }`}
            />
          </div>
          <FieldError field="price" />
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Set to 0 for free addons
          </p>
        </div>

        {/* Is Available */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Available
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              Customers can select this addon
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAvailable((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isAvailable
                ? "bg-primary-500"
                : "bg-neutral-200 dark:bg-neutral-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isAvailable ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
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
                {isEdit ? "Saving…" : "Adding…"}
              </>
            ) : isEdit ? (
              <>
                <Pencil className="w-4 h-4" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Addon
              </>
            )}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddonModal;
