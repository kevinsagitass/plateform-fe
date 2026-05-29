import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  Tag,
  ChevronDown,
  DollarSign,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";
import {
  getAddonGroups,
  createAddonGroup,
  updateAddonGroup,
  deleteAddonGroup,
  createAddon,
  updateAddon,
  deleteAddon,
} from "@/services/OrganizationMenuService";
import {
  AddonGroup,
  Addon,
  CreateAddonGroupPayload,
  CreateAddonPayload,
} from "@/types/organizationMenu";
import AddonGroupModal from "./AddonGroupModal";
import AddonModal from "./AddonModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface AddonGroupsPanelProps {
  menuItemId: string;
  menuItemName: string;
}

const AddonGroupsPanel = ({ menuItemId }: AddonGroupsPanelProps) => {
  const { activeOrganizationId } = useAppSelector((s) => s.role);
  const queryClient = useQueryClient();

  // ── Data ──────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["addonGroups", activeOrganizationId, menuItemId],
    queryFn: () => getAddonGroups(activeOrganizationId, menuItemId),
    enabled: !!activeOrganizationId && !!menuItemId,
  });

  const groups: AddonGroup[] = data?.data ?? [];

  // ── Expanded state ────────────────────────────────────────────
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const toggleGroup = (id: string) =>
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // ── Group modals ──────────────────────────────────────────────
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<AddonGroup | null>(null);
  const [deleteGroup, setDeleteGroup] = useState<AddonGroup | null>(null);

  // ── Addon modals ──────────────────────────────────────────────
  const [addAddonGroupId, setAddAddonGroupId] = useState<string | null>(null);
  const [editAddon, setEditAddon] = useState<{
    addon: Addon;
    groupId: string;
  } | null>(null);
  const [deleteAddon_, setDeleteAddon] = useState<{
    addon: Addon;
    groupId: string;
  } | null>(null);

  // ── Invalidate helper ─────────────────────────────────────────
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["addonGroups", activeOrganizationId, menuItemId],
    });

  // ── Group handlers ────────────────────────────────────────────
  const handleCreateGroup = async (payload: CreateAddonGroupPayload) => {
    try {
      await createAddonGroup(activeOrganizationId, payload);
      toast.success("Addon group created");
      invalidate();
      setAddGroupOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create group");
      throw e;
    }
  };

  const handleUpdateGroup = async (payload: CreateAddonGroupPayload) => {
    if (!editGroup) return;
    try {
      await updateAddonGroup(activeOrganizationId, editGroup.id, payload);
      toast.success("Addon group updated");
      invalidate();
      setEditGroup(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update group");
      throw e;
    }
  };

  const handleDeleteGroup = async () => {
    if (!deleteGroup) return;
    try {
      await deleteAddonGroup(activeOrganizationId, deleteGroup.id);
      toast.success("Addon group deleted");
      invalidate();
      setDeleteGroup(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete group");
    }
  };

  // ── Addon handlers ────────────────────────────────────────────
  const handleCreateAddon = async (
    groupId: string,
    payload: CreateAddonPayload
  ) => {
    try {
      await createAddon(activeOrganizationId, groupId, payload);
      toast.success("Addon added");
      invalidate();
      setAddAddonGroupId(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add addon");
      throw e;
    }
  };

  const handleUpdateAddon = async (payload: CreateAddonPayload) => {
    if (!editAddon) return;
    try {
      await updateAddon(
        activeOrganizationId,
        editAddon.groupId,
        editAddon.addon.id,
        payload
      );
      toast.success("Addon updated");
      invalidate();
      setEditAddon(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update addon");
      throw e;
    }
  };

  const handleDeleteAddon = async () => {
    if (!deleteAddon_) return;
    try {
      await deleteAddon(
        activeOrganizationId,
        deleteAddon_.groupId,
        deleteAddon_.addon.id
      );
      toast.success("Addon deleted");
      invalidate();
      setDeleteAddon(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete addon");
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-3">
        {/* Panel header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Addon Groups
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              ({groups.length})
            </span>
          </div>
          <button
            onClick={() => setAddGroupOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 text-xs font-medium hover:bg-primary-100 dark:hover:bg-primary-950/60 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Group
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-neutral-200 dark:border-neutral-700 border-t-primary-500 rounded-full"
            />
          </div>
        )}

        {/* Empty */}
        {!isLoading && groups.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-700">
            <Layers className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm text-neutral-400 dark:text-neutral-500">
              No addon groups yet
            </p>
            <button
              onClick={() => setAddGroupOpen(true)}
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
            >
              Add your first group
            </button>
          </div>
        )}

        {/* Groups list */}
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {groups.map((group) => {
              const isExpanded = expandedGroups.has(group.id);
              const addons = group.addons ?? [];

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
                >
                  {/* Group header row */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60">
                    {/* Expand toggle */}
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="flex items-center gap-2 flex-1 min-w-0 text-left"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {group.name}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {group.isRequired && (
                          <span className="px-1.5 py-0.5 rounded-md text-2xs font-medium bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400">
                            Required
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded-md text-2xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400">
                          Max {group.maxSelection}
                        </span>
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">
                          {addons.length} addon{addons.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </button>

                    {/* Group actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setEditGroup(group)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteGroup(group)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-error dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Addons list (collapsible) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                          {addons.length === 0 ? (
                            <div className="px-4 py-4 text-center">
                              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                No addons in this group yet
                              </p>
                            </div>
                          ) : (
                            addons.map((addon) => (
                              <div
                                key={addon.id}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group/addon"
                              >
                                <Tag className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 flex-shrink-0" />
                                <span className="text-sm text-neutral-700 dark:text-neutral-300 flex-1 truncate">
                                  {addon.name}
                                </span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {/* Price */}
                                  <span className="flex items-center gap-0.5 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                    <DollarSign className="w-3 h-3" />
                                    {addon.price.toFixed(2)}
                                  </span>
                                  {/* Availability */}
                                  {addon.isAvailable ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-success dark:text-green-400" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
                                  )}
                                  {/* Addon actions */}
                                  <div className="flex items-center gap-0.5 opacity-0 group-hover/addon:opacity-100 transition-opacity">
                                    <button
                                      onClick={() =>
                                        setEditAddon({
                                          addon,
                                          groupId: group.id,
                                        })
                                      }
                                      className="w-6 h-6 rounded-md flex items-center justify-center text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteAddon({
                                          addon,
                                          groupId: group.id,
                                        })
                                      }
                                      className="w-6 h-6 rounded-md flex items-center justify-center text-neutral-400 hover:text-error dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}

                          {/* Add addon button */}
                          <div className="px-4 py-2">
                            <button
                              onClick={() => setAddAddonGroupId(group.id)}
                              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-700 text-xs text-neutral-400 dark:text-neutral-500 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add Addon
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {addGroupOpen && (
          <AddonGroupModal
            mode="add"
            organizationMenuId={menuItemId}
            onClose={() => setAddGroupOpen(false)}
            onSubmit={handleCreateGroup}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editGroup && (
          <AddonGroupModal
            mode="edit"
            group={editGroup}
            onClose={() => setEditGroup(null)}
            onSubmit={handleUpdateGroup}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteGroup && (
          <DeleteConfirmModal
            title="Delete Addon Group"
            description={
              <>
                Delete{" "}
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {deleteGroup.name}
                </span>
                ? All addons inside will also be deleted.
              </>
            }
            onClose={() => setDeleteGroup(null)}
            onConfirm={handleDeleteGroup}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addAddonGroupId && (
          <AddonModal
            mode="add"
            onClose={() => setAddAddonGroupId(null)}
            onSubmit={(payload) => handleCreateAddon(addAddonGroupId, payload)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editAddon && (
          <AddonModal
            mode="edit"
            addon={editAddon.addon}
            onClose={() => setEditAddon(null)}
            onSubmit={handleUpdateAddon}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteAddon_ && (
          <DeleteConfirmModal
            title="Delete Addon"
            description={
              <>
                Delete{" "}
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {deleteAddon_.addon.name}
                </span>
                ? This action cannot be undone.
              </>
            }
            onClose={() => setDeleteAddon(null)}
            onConfirm={handleDeleteAddon}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AddonGroupsPanel;
