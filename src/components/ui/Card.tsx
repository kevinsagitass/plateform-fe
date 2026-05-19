import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
  onClick,
  padding = "md",
}) => {
  return (
    <div
      onClick={onClick}
      className={[
        "bg-surface rounded-xl border border-neutral-100 shadow-card",
        hover
          ? "hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          : "",
        paddingStyles[padding],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  icon,
}) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-display font-semibold text-neutral-900 text-base">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};