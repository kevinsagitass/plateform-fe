interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  prefix?: string;
  suffix?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel = "vs last week",
  icon,
  iconBg = "bg-primary-50 dark:bg-primary-950/40",
  iconColor = "text-primary-600 dark:text-primary-400",
  prefix = "",
  suffix = "",
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-card p-5 hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="mt-2 text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
            {prefix}
            {value}
            {suffix}
          </p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={[
                  "inline-flex items-center gap-0.5 text-xs font-medium",
                  isPositive
                    ? "text-success-dark dark:text-success"
                    : "text-error-dark dark:text-red-400",
                ].join(" ")}
              >
                {isPositive ? (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {changeLabel}
              </span>
            </div>
          )}
        </div>

        <div
          className={[
            "w-12 h-12 rounded-xl flex items-center justify-center",
            iconBg,
            iconColor,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
