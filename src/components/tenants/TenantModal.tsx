import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Store, Loader2, MapPin, Clock, Plus, Trash2 } from "lucide-react";
import { TenantWorkHour } from "@/types/tenant";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TenantFormValues {
  tenantName: string;
  tenantLocation: string;
  workHours: TenantWorkHour[];
}

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TenantFormValues) => Promise<void>;
  defaultValues?: TenantFormValues;
  mode: "create" | "edit";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DEFAULT_WORK_HOURS: TenantWorkHour[] = Array.from(
  { length: 7 },
  (_, i) => ({
    tenantWorkHourId: undefined,
    dayOfMonth: i,
    openHour: "08:00",
    closeHour: "22:00",
    isActive: true,
  })
);

// ─── Shared input class ───────────────────────────────────────────────────────

const inputBase = `
  w-full px-3 py-2 text-sm rounded-lg border
  bg-white dark:bg-neutral-800
  text-neutral-900 dark:text-neutral-100
  placeholder:text-neutral-400 dark:placeholder:text-neutral-500
  focus:outline-none focus:ring-2
  disabled:opacity-60 disabled:cursor-not-allowed
  transition-all duration-200
  border-neutral-200 dark:border-neutral-700
  focus:ring-primary-300 dark:focus:ring-primary-500/40
  focus:border-primary-400 dark:focus:border-primary-500
`;

const inputError = `
  border-red-300 dark:border-red-700
  focus:ring-red-200 dark:focus:ring-red-900/40
  focus:border-red-400 dark:focus:border-red-600
`;

const buildWorkHours = (incoming?: TenantWorkHour[]): TenantWorkHour[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const found = incoming?.find((w) => w.dayOfMonth === i);
    if (found) {
      return {
        tenantWorkHourId: found.tenantWorkHourId,
        dayOfMonth: i,
        openHour: found.openHour?.slice(0, 5) ?? "08:00",
        closeHour: found.closeHour?.slice(0, 5) ?? "22:00",
        isActive: found.isActive ?? true,
      };
    }
    return {
      tenantWorkHourId: undefined,
      dayOfMonth: i,
      openHour: "08:00",
      closeHour: "22:00",
      isActive: false,
    };
  });
};

// ─── Component ────────────────────────────────────────────────────────────────

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
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TenantFormValues>({
    defaultValues: {
      tenantName: "",
      tenantLocation: "",
      workHours: DEFAULT_WORK_HOURS,
    },
  });

  const { fields } = useFieldArray({ control, name: "workHours" });
  const workHours = watch("workHours");

  useEffect(() => {
    if (isOpen) {
      reset({
        tenantName: defaultValues?.tenantName ?? "",
        tenantLocation: defaultValues?.tenantLocation ?? "",
        workHours: defaultValues?.workHours
          ? buildWorkHours(defaultValues.workHours)
          : DEFAULT_WORK_HOURS,
      });
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdrop}
        >
          <motion.div
            className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-modal border border-neutral-200 dark:border-neutral-700 flex flex-col max-h-[90vh]"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order shrink-0">
                  <Store size={17} className="text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-neutral-900 dark:text-neutral-100">
                    {mode === "create" ? "New Tenant" : "Edit Tenant"}
                  </h2>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {mode === "create"
                      ? "Add a new store location"
                      : "Update store details"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <form
              onSubmit={handleSubmit(submit)}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* ── Store Name ─────────────────────────────────────────── */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Store Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Store
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
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
                      className={`pl-10 pr-4 py-2.5 ${inputBase} ${
                        errors.tenantName ? inputError : ""
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.tenantName && (
                      <motion.p
                        className="text-xs text-red-500 dark:text-red-400 mt-1.5"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        {errors.tenantName.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Location ───────────────────────────────────────────── */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
                    />
                    <input
                      {...register("tenantLocation", {
                        required: "Location is required",
                        minLength: {
                          value: 10,
                          message: "Must be at least 10 characters",
                        },
                        maxLength: {
                          value: 255,
                          message: "Must be less than 255 characters",
                        },
                      })}
                      placeholder="e.g. 123 Main St, Downtown"
                      disabled={isSubmitting}
                      className={`pl-10 pr-4 py-2.5 ${inputBase} ${
                        errors.tenantLocation ? inputError : ""
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.tenantLocation && (
                      <motion.p
                        className="text-xs text-red-500 dark:text-red-400 mt-1.5"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        {errors.tenantLocation.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Work Hours ─────────────────────────────────────────── */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock
                      size={15}
                      className="text-neutral-400 dark:text-neutral-500"
                    />
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Operating Hours
                    </label>
                  </div>

                  <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-[80px_1fr_1fr_44px] gap-0 bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 px-3 py-2">
                      <span className="text-2xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        Day
                      </span>
                      <span className="text-2xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        Open
                      </span>
                      <span className="text-2xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        Close
                      </span>
                      <span className="text-2xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-center">
                        On
                      </span>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {fields.map((field, idx) => {
                        const isActive = workHours?.[idx]?.isActive;

                        return (
                          <div
                            key={field.id}
                            className={`grid grid-cols-[80px_1fr_1fr_44px] gap-0 items-center px-3 py-2.5 transition-colors ${
                              isActive
                                ? "bg-white dark:bg-neutral-900"
                                : "bg-neutral-50/60 dark:bg-neutral-800/30"
                            }`}
                          >
                            <input
                              type="hidden"
                              {...register(`workHours.${idx}.tenantWorkHourId`)}
                            />

                            {/* Day name */}
                            <span
                              className={`text-sm font-medium transition-colors ${
                                isActive
                                  ? "text-neutral-800 dark:text-neutral-200"
                                  : "text-neutral-400 dark:text-neutral-600"
                              }`}
                            >
                              {DAY_NAMES[idx]}
                            </span>

                            {/* Open Hour */}
                            <div className="pr-2">
                              <input
                                type="time"
                                {...register(`workHours.${idx}.openHour`, {
                                  required: isActive ? "Required" : false,
                                })}
                                disabled={!isActive || isSubmitting}
                                className={`
                                  w-full px-2 py-1.5 text-xs rounded-lg border
                                  bg-white dark:bg-neutral-800
                                  text-neutral-900 dark:text-neutral-100
                                  border-neutral-200 dark:border-neutral-700
                                  focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500/40
                                  focus:border-primary-400 dark:focus:border-primary-500
                                  disabled:opacity-40 disabled:cursor-not-allowed
                                  transition-all duration-200
                                `}
                              />
                            </div>

                            {/* Close Hour */}
                            <div className="pr-2">
                              <input
                                type="time"
                                {...register(`workHours.${idx}.closeHour`, {
                                  required: isActive ? "Required" : false,
                                  validate: (val) => {
                                    if (!isActive) return true;
                                    const open = workHours?.[idx]?.openHour;
                                    if (open && val <= open)
                                      return "Must be after open";
                                    return true;
                                  },
                                })}
                                disabled={!isActive || isSubmitting}
                                className={`
                                  w-full px-2 py-1.5 text-xs rounded-lg border
                                  bg-white dark:bg-neutral-800
                                  text-neutral-900 dark:text-neutral-100
                                  border-neutral-200 dark:border-neutral-700
                                  focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500/40
                                  focus:border-primary-400 dark:focus:border-primary-500
                                  disabled:opacity-40 disabled:cursor-not-allowed
                                  transition-all duration-200
                                `}
                              />
                            </div>

                            {/* Toggle active */}
                            <div className="flex justify-center">
                              <Controller
                                control={control}
                                name={`workHours.${idx}.isActive`}
                                render={({ field: f }) => (
                                  <button
                                    type="button"
                                    onClick={() => f.onChange(!f.value)}
                                    disabled={isSubmitting}
                                    className={`
                                      relative w-9 h-5 rounded-full transition-all duration-200
                                      focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500/40
                                      disabled:opacity-50 disabled:cursor-not-allowed
                                      ${
                                        f.value
                                          ? "bg-primary-500"
                                          : "bg-neutral-200 dark:bg-neutral-700"
                                      }
                                    `}
                                    aria-label={`Toggle ${DAY_NAMES[idx]}`}
                                  >
                                    <span
                                      className={`
                                        absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm
                                        transition-transform duration-200
                                        ${
                                          f.value
                                            ? "translate-x-4"
                                            : "translate-x-0"
                                        }
                                      `}
                                    />
                                  </button>
                                )}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Validation errors for work hours */}
                  <AnimatePresence>
                    {errors.workHours && (
                      <motion.p
                        className="text-xs text-red-500 dark:text-red-400 mt-1.5"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        Please check operating hours — close time must be after
                        open time.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-neutral-100 dark:border-neutral-800 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
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
