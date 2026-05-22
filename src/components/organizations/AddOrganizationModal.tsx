import { useState, useEffect, useRef } from "react";
import { X, Building2, Loader2 } from "lucide-react";

interface AddOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

const AddOrganizationModal = ({
  isOpen,
  onClose,
  onSubmit,
}: AddOrganizationModalProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setName("");
      setError("");
    }
  }, [isOpen]);

  const validate = () => {
    if (!name.trim()) {
      setError("Organization name is required");
      return false;
    }
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      return false;
    }
    if (name.trim().length > 50) {
      setError("Name must be less than 50 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit(name.trim());
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isLoading) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-modal border border-neutral-200 dark:border-neutral-700 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order shrink-0">
              <Building2 size={17} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-neutral-900 dark:text-neutral-100">
                New Organization
              </h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Create a new workspace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <label
              htmlFor="org-name"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Organization Name
              <span className="text-red-400 ml-0.5">*</span>
            </label>

            <input
              ref={inputRef}
              id="org-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Acme Corporation"
              disabled={isLoading}
              className={`
                w-full px-4 py-2.5 text-sm rounded-xl border
                bg-white dark:bg-neutral-800
                text-neutral-900 dark:text-neutral-100
                placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                focus:outline-none focus:ring-2
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200
                ${
                  error
                    ? "border-red-300 dark:border-red-700 focus:ring-red-200 dark:focus:ring-red-900/50 focus:border-red-400 dark:focus:border-red-600"
                    : "border-neutral-200 dark:border-neutral-700 focus:ring-primary-300 dark:focus:ring-primary-500/40 focus:border-primary-400 dark:focus:border-primary-500"
                }
              `}
            />

            {/* Error */}
            <div
              className={`overflow-hidden transition-all duration-200 ${
                error ? "max-h-8 mt-1.5" : "max-h-0"
              }`}
            >
              <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
            </div>

            {/* Character count */}
            <p
              className={`text-xs mt-1.5 text-right transition-colors duration-200 ${
                name.length > 50
                  ? "text-red-400 dark:text-red-500"
                  : "text-neutral-400 dark:text-neutral-500"
              }`}
            >
              {name.length}/50
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-5 pb-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-warm text-white rounded-xl shadow-order hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Building2 size={15} />
                  Create
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrganizationModal;
