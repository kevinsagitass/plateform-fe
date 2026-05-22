import { Building2, ChevronRight, Home, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setValues } from "@/store/slices/roleSlice";
import { getUserOrganizationRole } from "@/services/OrganizationService";
import { getUserTenantRole } from "@/services/TenantService";
import { useNavigate } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ElementType;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav aria-label="breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center gap-1 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;

          return (
            <li key={index} className="flex items-center gap-1">
              {/* Separator */}
              {index > 0 && (
                <ChevronRight
                  size={14}
                  className="text-neutral-300 dark:text-neutral-600 flex-shrink-0"
                />
              )}

              {/* Item */}
              {isLast ? (
                // Active/Last item
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 truncate"
                  aria-current="page"
                >
                  {Icon && (
                    <Icon
                      size={13}
                      className="text-neutral-500 dark:text-neutral-400 flex-shrink-0"
                    />
                  )}
                  {item.label}
                </span>
              ) : item.href ? (
                // Link item
                <a
                  href={item.href}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-150 truncate max-w-[160px]"
                >
                  {Icon && <Icon size={13} className="flex-shrink-0" />}
                  {item.label}
                </a>
              ) : (
                // Button item
                <button
                  onClick={item.onClick}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-150 truncate max-w-[160px]"
                >
                  {Icon && <Icon size={13} className="flex-shrink-0" />}
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

const BreadcrumbNav = () => {
  const {
    activeOrganizationId,
    activeOrganizationName,
    activeTenantId,
    activeTenantName,
  } = useAppSelector((state) => state.role);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items: BreadcrumbItem[] = [
    {
      label: "Index",
      icon: Home,
      onClick: async () => {
        dispatch(
          setValues({
            activeOrganizationId: null,
            activeOrganizationName: null,
            activeTenantId: null,
            activeTenantName: null,
            activeRole: null,
          })
        );
        navigate("/home");
      },
    },
    ...(activeOrganizationName
      ? [
          {
            label: activeOrganizationName,
            icon: Building2,
            onClick: async () => {
              const role = await getUserOrganizationRole(activeOrganizationId);
              dispatch(
                setValues({
                  activeTenantId: null,
                  activeTenantName: null,
                  activeRole: role.data,
                })
              );
              navigate("/home");
            },
          },
        ]
      : []),
    ...(activeTenantName
      ? [
          {
            label: activeTenantName,
            icon: Store,
            onClick: async () => {
              const role = await getUserTenantRole(activeTenantId);
              dispatch(setValues({ activeRole: role.data }));
            },
          },
        ]
      : []),
  ];

  return <Breadcrumb items={items} />;
};

export default BreadcrumbNav;
