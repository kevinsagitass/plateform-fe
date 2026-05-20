import {
  Building2,
  MapPin,
  Users,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrganizationUser } from "@/types/organization";
import { formatDateClient } from "@/helpers/dateFormatter";

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
          ? "border-primary-400 bg-primary-50 shadow-order"
          : "border-neutral-200 bg-surface hover:border-primary-200"
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
                : "bg-neutral-100 group-hover:bg-primary-100"
            )}
          >
            <Building2
              size={20}
              className={
                isSelected
                  ? "text-white"
                  : "text-neutral-500 group-hover:text-primary-500"
              }
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-base text-neutral-900 truncate">
                {organization.organizationName}
              </h3>
              {organization.isActive && (
                <span className="px-2 py-0.5 text-2xs font-semibold bg-success-light text-success-dark rounded-full flex-shrink-0">
                  Active
                </span>
              )}
            </div>

            <p className="text-xs text-accent-950 mt-0.5">
              Current Plan : {organization.plan}
            </p>

            <p className="text-xs text-accent-950 mt-0.5">
              Plan Active Until : {formatDateClient(organization.endDate)}
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
              className="text-neutral-300 group-hover:text-primary-400 transition-colors"
            />
          )}
        </div>
      </div>
    </button>
  );
};

export default OrganizationCard;
