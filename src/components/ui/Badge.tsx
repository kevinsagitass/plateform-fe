type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled"
  | "paid";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary-100 text-primary-700",
  secondary: "bg-secondary-100 text-secondary-700",
  success: "bg-success-light text-success-dark",
  warning: "bg-warning-light text-warning-dark",
  error: "bg-error-light text-error-dark",
  info: "bg-info-light text-info-dark",
  neutral: "bg-neutral-100 text-neutral-700",
  pending: "bg-amber-100 text-amber-700",
  preparing: "bg-blue-100 text-blue-700",
  ready: "bg-green-100 text-green-700",
  served: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
  paid: "bg-emerald-100 text-emerald-700",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-primary-500",
  secondary: "bg-secondary-500",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
  neutral: "bg-neutral-500",
  pending: "bg-amber-500",
  preparing: "bg-blue-500",
  ready: "bg-green-500",
  served: "bg-purple-500",
  cancelled: "bg-red-500",
  paid: "bg-emerald-500",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
  dot = false,
  className = "",
}) => {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className,
      ].join(" ")}
    >
      {dot && (
        <span
          className={["w-1.5 h-1.5 rounded-full", dotColors[variant]].join(
            " "
          )}
        />
      )}
      {children}
    </span>
  );
};