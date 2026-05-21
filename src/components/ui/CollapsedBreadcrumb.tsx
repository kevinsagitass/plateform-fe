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
              dispatch(
                setValues({
                  activeRole: role.data,
                })
              );
            },
          },
        ]
      : []),
  ];

  const current = crumbs[crumbs.length - 1];
  const parents = crumbs.slice(0, -1);

  return (
    <div className="relative">
      {/* Collapsed — shows only current page with expand toggle */}
      <div className="flex items-center gap-1.5">
        {/* Back to direct parent */}
        {parents.length > 0 && (
          <button
            onClick={parents[parents.length - 1].onClick}
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-200 group"
          >
            <ChevronLeft
              size={15}
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            />
            <span className="max-w-[80px] truncate">
              {parents[parents.length - 1].label}
            </span>
          </button>
        )}

        <span className="text-neutral-300">/</span>

        {/* Current + expand button */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-sm font-semibold text-neutral-900"
        >
          <span className="max-w-[220px] truncate">{current.label}</span>
          {parents.length > 1 && (
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
            </motion.span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CollapsedBreadcrumb;
