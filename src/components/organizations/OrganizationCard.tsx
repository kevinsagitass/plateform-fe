import {
  Building2,
  Users,
  ChevronRight,
  CheckCircle2,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrganizationUser } from "@/types/organization";

interface OrganizationCardProps {
  organization: OrganizationUser;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

const OrganizationCard = ({
  organization,
  isSelected,
  onClick,
}: OrganizationCardProps) => {
  return (
    <button
      onClick={() => onClick?.(organization.organizationId)}
      className={cn(
        "w-full text-left p-5 rounded-xl border-2 transition-all duration-200 group",
        "hover:shadow-card-hover hover:-translate-y-0.5",
        isSelected
          ? [
              "border-primary-400 shadow-order",
              "bg-primary-50 dark:bg-primary-950/30",
            ]
          : [
              "border-neutral-200 dark:border-neutral-700",
              "bg-white dark:bg-neutral-800/60",
              "hover:border-primary-200 dark:hover:border-primary-700",
            ]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icon & Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
              isSelected
                ? "bg-gradient-warm shadow-order"
                : "bg-neutral-100 dark:bg-neutral-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40"
            )}
          >
            <Building2
              size={20}
              className={cn(
                isSelected
                  ? "text-white"
                  : "text-neutral-500 dark:text-neutral-400 group-hover:text-primary-500"
              )}
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-neutral-100 truncate">
                {organization.organizationName}
              </h3>
              {organization.isActive && (
                <span className="px-2 py-0.5 text-2xs font-semibold bg-success-light dark:bg-success-dark/20 text-success-dark dark:text-success rounded-full flex-shrink-0">
                  Active
                </span>
              )}
            </div>

            <p className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              <Users size={10} />
              Total Staff {organization.totalStaff}
            </p>

            <p className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              <Store size={10} />
              Total Tenant {organization.totalTenant}
            </p>
          </div>
        </div>

        {/* Right Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {isSelected ? (
            <CheckCircle2 size={20} className="text-primary-500" />
          ) : (
            <ChevronRight
              size={18}
              className="text-neutral-300 dark:text-neutral-600 group-hover:text-primary-400 transition-colors"
            />
          )}
        </div>
      </div>
    </button>
  );
};

export default OrganizationCard;
