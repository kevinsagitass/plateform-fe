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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-modal border border-neutral-200 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order">
              <Building2 size={17} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-neutral-900">
                New Organization
              </h2>
              <p className="text-xs text-neutral-400">Create a new workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <label
              htmlFor="org-name"
              className="block text-sm font-medium text-neutral-700 mb-1.5"
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
                bg-surface text-neutral-900 placeholder:text-neutral-400
                focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200
                ${
                  error
                    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                    : "border-neutral-200"
                }
              `}
            />
            {/* Error */}
            <div
              className={`overflow-hidden transition-all duration-200 ${
                error ? "max-h-8 mt-1.5" : "max-h-0"
              }`}
            >
              <p className="text-xs text-red-500">{error}</p>
            </div>
            {/* Character count */}
            <p
              className={`text-xs mt-1.5 text-right transition-colors duration-200 ${
                name.length > 50 ? "text-red-400" : "text-neutral-400"
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
              className="px-4 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
