import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  Plus,
  Pencil,
  UtensilsCrossed,
  DollarSign,
  Upload,
  ImageIcon,
  AlignLeft,
  ChevronDown,
  Tag,
  Layers,
  XCircle,
} from "lucide-react";
import {
  MenuCategory,
  MenuItem,
  CreateMenuItemPayload,
} from "@/types/organizationMenu";
import ModalWrapper from "./ModalWrapper";
import AddonGroupsPanel from "./AddonGroupsPanel";

interface MenuItemModalProps {
  mode: "add" | "edit";
  item?: MenuItem;
  categories: MenuCategory[];
  onClose: () => void;
  onSubmit: (payload: CreateMenuItemPayload) => Promise<void>;
}

type Tab = "details" | "addons";

const MenuItemModal = ({
  mode,
  item,
  categories,
  onClose,
  onSubmit,
}: MenuItemModalProps) => {
  const isEdit = mode === "edit";

  // ── Tab state ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("details");

  // ── Form state ────────────────────────────────────────────────
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState<number>(item?.price ?? 0);
  const [discount, setDiscount] = useState<number>(item?.discount ?? 0);
  const [categoryId, setCategoryId] = useState<string | null>(
    item?.category.id ?? null
  );
  const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Image state ───────────────────────────────────────────────
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    item?.imagePath
      ? `${import.meta.env.VITE_BASE_URL}/${item.imagePath}`
      : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Image handlers ────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, image: "Please select a valid image file." }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, image: "Image must be less than 5MB." }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.image) setErrors((p) => ({ ...p, image: "" }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!description.trim()) e.description = "Description is required.";
    if (!e.description && description.trim().length < 5)
      e.description = "Description Length is Minimum 5";
    if (!selectedCategory) e.category = "Category is required.";
    if (price < 0) e.price = "Price must be 0 or greater.";
    if (discount < 0 || discount > 100)
      e.discount = "Discount must be between 0 and 100.";
    // Image required only on add mode
    if (!isEdit && !imageFile) e.image = "Image is required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        image: imageFile,
        price,
        discount,
        organizationCategoryId: categoryId,
        isAvailable,
        isActive,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  // ── Style helpers ─────────────────────────────────────────────
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

  const Toggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: () => void;
  }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        value ? "bg-primary-500" : "bg-neutral-200 dark:bg-neutral-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <ModalWrapper
      onClose={onClose}
      maxWidth={isEdit ? "max-w-2xl" : "max-w-lg"}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
            {isEdit ? (
              <Pencil className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            ) : (
              <UtensilsCrossed className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            )}
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 font-display">
              {isEdit ? "Edit Menu Item" : "Add Menu Item"}
            </h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              {isEdit
                ? "Update item details or manage addon groups"
                : "Add a new item to your menu"}
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

      {/* ── Tabs (edit mode only) ───────────────────────────────── */}
      {isEdit && (
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "details"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("addons")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "addons"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Addon Groups
          </button>
        </div>
      )}

      {/* ── Body ───────────────────────────────────────────────── */}
      <AnimatePresence mode="wait" initial={false}>
        {activeTab === "details" && (
          <motion.form
            key="details"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleSubmit}
            className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
          >
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Item Name <span className="text-accent-500">*</span>
              </label>
              <div className="relative">
                <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                  }}
                  placeholder="e.g. Grilled Salmon"
                  className={`${inputBase} pl-9 ${
                    errors.name ? inputError : inputNormal
                  }`}
                />
              </div>
              <FieldError field="name" />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Description <span className="text-accent-500">*</span>
              </label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description)
                      setErrors((p) => ({ ...p, description: "" }));
                  }}
                  placeholder="Describe the menu item…"
                  rows={3}
                  className={`${inputBase} pl-9 resize-none ${
                    errors.description ? inputError : inputNormal
                  }`}
                />
              </div>
              <FieldError field="description" />
            </div>

            {/* Image Upload */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Image {!isEdit && <span className="text-accent-500">*</span>}
                {isEdit && (
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 font-normal ml-1">
                    (leave empty to keep current)
                  </span>
                )}
              </label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview ? (
                /* Preview */
                <div className="relative group rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-neutral-800 text-xs font-medium hover:bg-white transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-medium hover:bg-red-500 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                  {/* File name badge */}
                  {imageFile && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
                        <ImageIcon className="w-3 h-3 text-white/80 flex-shrink-0" />
                        <span className="text-xs text-white/90 truncate">
                          {imageFile.name}
                        </span>
                        <span className="text-xs text-white/60 flex-shrink-0">
                          ({(imageFile.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Drop zone */
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed transition-colors ${
                    errors.image
                      ? "border-error dark:border-red-700 bg-red-50 dark:bg-red-950/20"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 bg-neutral-50 dark:bg-neutral-800/50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      errors.image
                        ? "bg-red-100 dark:bg-red-950/40"
                        : "bg-neutral-100 dark:bg-neutral-700"
                    }`}
                  >
                    <Upload
                      className={`w-5 h-5 ${
                        errors.image
                          ? "text-error dark:text-red-400"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-sm font-medium ${
                        errors.image
                          ? "text-error dark:text-red-400"
                          : "text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      Click to upload image
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                </button>
              )}
              <FieldError field="image" />
            </div>

            {/* Price & Discount */}
            <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={discount}
                  onChange={(e) => {
                    setDiscount(Number(e.target.value));
                    if (errors.discount)
                      setErrors((p) => ({ ...p, discount: "" }));
                  }}
                  className={`${inputBase} ${
                    errors.discount ? inputError : inputNormal
                  }`}
                />
                <FieldError field="discount" />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Category <span className="text-accent-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 mb-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors text-sm text-neutral-800 dark:text-neutral-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                    <span
                      className={
                        selectedCategory
                          ? ""
                          : "text-neutral-400 dark:text-neutral-500"
                      }
                    >
                      {selectedCategory
                        ? selectedCategory.categoryName
                        : "Select a category"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      categoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <FieldError field="category" />

                <AnimatePresence>
                  {categoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-neutral-900 rounded-xl shadow-menu border border-neutral-200 dark:border-neutral-700 z-50 overflow-hidden"
                    >
                      <div className="p-1.5 max-h-48 overflow-y-auto">
                        {categories
                          .filter((c) => c.isActive)
                          .map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setCategoryId(cat.id);
                                setCategoryDropdownOpen(false);
                                if (errors.category)
                                  setErrors((p) => ({ ...p, category: "" }));
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                                categoryId === cat.id
                                  ? "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400"
                                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              {cat.categoryName}
                            </button>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Available
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                    Item can be ordered by customers
                  </p>
                </div>
                <Toggle
                  value={isAvailable}
                  onChange={() => setIsAvailable((v) => !v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Active
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                    Inactive items are hidden from the menu
                  </p>
                </div>
                <Toggle
                  value={isActive}
                  onChange={() => setIsActive((v) => !v)}
                />
              </div>
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
                    Add Item
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {/* ── Addons tab ── */}
        {activeTab === "addons" && item && (
          <motion.div
            key="addons"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            className="p-6 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 mb-4">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.imagePath ? (
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/${item.imagePath}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <UtensilsCrossed className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  Managing addon groups for this item
                </p>
              </div>
            </div>

            <AddonGroupsPanel menuItemId={item.id} menuItemName={item.name} />

            <div className="pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalWrapper>
  );
};

export default MenuItemModal;
