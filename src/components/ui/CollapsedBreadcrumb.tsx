import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, Home, Building2, Store } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { setValues } from "@/store/slices/roleSlice";
import { getUserOrganizationRole } from "@/services/OrganizationService";
import { getUserTenantRole } from "@/services/TenantService";

const CollapsedBreadcrumb = () => {
  const [expanded, setExpanded] = useState(false);
  const {
    activeOrganizationId,
    activeOrganizationName,
    activeTenantId,
    activeTenantName,
  } = useAppSelector((state) => state.role);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const crumbs = [
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

  const current = crumbs[crumbs.length - 1];
  const parents = crumbs.slice(0, -1);

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5">
        {/* Back to direct parent */}
        {parents.length > 0 && (
          <button
            onClick={parents[parents.length - 1].onClick}
            className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200 group"
          >
            <ChevronLeft
              size={13}
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            />
            <span className="max-w-[80px] truncate">
              {parents[parents.length - 1].label}
            </span>
          </button>
        )}

        {/* Separator */}
        <span className="text-neutral-300 dark:text-neutral-600 text-xs">
          /
        </span>

        {/* Current + expand button */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-200"
        >
          <span className="max-w-[220px] truncate">{current.label}</span>
          {parents.length > 1 && (
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown
                size={12}
                className="text-neutral-400 dark:text-neutral-500"
              />
            </motion.span>
          )}
        </button>
      </div>

      {/* Expanded dropdown — semua crumbs */}
      <AnimatePresence>
        {expanded && parents.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-1.5 w-48 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-menu z-50 overflow-hidden py-1"
          >
            {crumbs.map((crumb, idx) => {
              const Icon = crumb.icon;
              const isLast = idx === crumbs.length - 1;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    crumb.onClick();
                    setExpanded(false);
                  }}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors
                    ${
                      isLast
                        ? "font-semibold text-neutral-800 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-800"
                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200"
                    }
                  `}
                >
                  <Icon
                    size={13}
                    className={
                      isLast
                        ? "text-primary-500"
                        : "text-neutral-400 dark:text-neutral-500"
                    }
                  />
                  <span className="truncate">{crumb.label}</span>
                  {isLast && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click away */}
      {expanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setExpanded(false)}
        />
      )}
    </div>
  );
};

export default CollapsedBreadcrumb;
