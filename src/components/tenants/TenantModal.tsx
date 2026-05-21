import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Store, Loader2, MapPin } from "lucide-react";

interface TenantFormValues {
  tenantName: string;
  tenantLocation: string;
}

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TenantFormValues) => Promise<void>;
  defaultValues?: TenantFormValues;
  mode: "create" | "edit";
}

const TenantModal = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  mode,
}: TenantModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TenantFormValues>({ defaultValues });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues ?? { tenantName: "", tenantLocation: "" });
    }
  }, [isOpen, defaultValues]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSubmitting) onClose();
  };

  const submit = async (values: TenantFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdrop}
        >
          <motion.div
            className="w-full max-w-md bg-surface rounded-2xl shadow-modal border border-neutral-200"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order">
                  <Store size={17} className="text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-neutral-900">
                    {mode === "create" ? "New Tenant" : "Edit Tenant"}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {mode === "create"
                      ? "Add a new store location"
                      : "Update store details"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(submit)}>
              <div className="p-5 space-y-4">
                {/* Tenant Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Store Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Store
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      {...register("tenantName", {
                        required: "Store name is required",
                        minLength: {
                          value: 3,
                          message: "Must be at least 3 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "Must be less than 100 characters",
                        },
                      })}
                      placeholder="e.g. Downtown Branch"
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-surface
                        text-neutral-900 placeholder:text-neutral-400
                        focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400
                        disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200
                        ${
                          errors.tenantName
                            ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                            : "border-neutral-200"
                        }`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.tenantName && (
                      <motion.p
                        className="text-xs text-red-500 mt-1.5"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        {errors.tenantName.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      {...register("tenantLocation", {
                        required: "Location is required",
                        minLength: {
                          value: 3,
                          message: "Must be at least 3 characters",
                        },
                        maxLength: {
                          value: 255,
                          message: "Must be less than 255 characters",
                        },
                      })}
                      placeholder="e.g. 123 Main St, Downtown"
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-surface
                        text-neutral-900 placeholder:text-neutral-400
                        focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400
                        disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200
                        ${
                          errors.tenantLocation
                            ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                            : "border-neutral-200"
                        }`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.tenantLocation && (
                      <motion.p
                        className="text-xs text-red-500 mt-1.5"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        {errors.tenantLocation.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 px-5 pb-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-warm text-white rounded-xl shadow-order hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      {mode === "create" ? "Creating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Store size={15} />
                      {mode === "create" ? "Create" : "Save Changes"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TenantModal;
