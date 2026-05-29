import { useEffect, useState } from "react";
import { Building2, Search, Plus, ArrowRight, Loader2 } from "lucide-react";
import OrganizationCard from "@/components/organizations/OrganizationCard";
import AddOrganizationModal from "@/components/organizations/AddOrganizationModal";
import { useAppDispatch } from "@/store/hooks";
import { setValues } from "../../store/slices/roleSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrganization,
  getUserOrganizationRole,
  getUserOrganizations,
} from "@/services/OrganizationService";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

const OrganizationHome = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, subscriptionConfig } = useAuth();

  const { data: organizationData } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getUserOrganizations(),
  });

  const organizations = organizationData?.data || [];

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["organizations"] });
  }, []);

  const filtered = organizations.filter((org) =>
    org.organizationName.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOrg = organizations.find(
    (org) => org.organizationId === selectedId
  );

  const handleContinue = async () => {
    if (!selectedId) return;
    setIsLoading(true);

    try {
      const result = await getUserOrganizationRole(selectedId);
      dispatch(
        setValues({
          activeOrganizationId: selectedId,
          activeOrganizationName: organizations.find(
            (org) => org.organizationId === selectedId
          ).organizationName,
          activeRole: result.data,
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === "string") {
        toast.error(error);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrganization = async (name: string) => {
    try {
      await createOrganization({ name });
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(`"${name}" created successfully`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === "string") {
        toast.error(error);
      } else {
        toast.error("Failed to create organization");
      }
      throw error;
    }
  };

  return (
    <>
      <main className="min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order shrink-0">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100">
                  Select Organization
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Choose your workspace to continue
                </p>
              </div>
            </div>
          </div>

          {/* Search & Action */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search organization..."
                className="
                  w-full pl-10 pr-4 py-2.5 text-sm rounded-xl
                  bg-white dark:bg-neutral-800
                  border border-neutral-200 dark:border-neutral-700
                  text-neutral-900 dark:text-neutral-100
                  placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                  focus:outline-none focus:ring-2
                  focus:ring-primary-300 dark:focus:ring-primary-500/40
                  focus:border-primary-400 dark:focus:border-primary-500
                  transition-all duration-200
                "
              />
            </div>

            {/* Add Button */}
            {user?.subscription?.plan != "FREE" &&
              organizations?.length < subscriptionConfig?.maxOrganization && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="
                    flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                    bg-gradient-warm text-white rounded-xl shadow-order
                    hover:shadow-lg hover:-translate-y-0.5
                    transition-all duration-200 flex-shrink-0
                  "
                >
                  <Plus size={16} />
                  <span className="hidden sm:block">Add New</span>
                </button>
              )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {filtered.length}
              </span>{" "}
              organization found
            </p>
            {selectedOrg && (
              <div className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 animate-fade-in">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                <span className="font-medium">
                  {selectedOrg.organizationName}
                </span>{" "}
                selected
              </div>
            )}
          </div>

          {/* Organization Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 animate-fade-in">
              {filtered.map((org) => (
                <OrganizationCard
                  key={org.organizationId}
                  organization={org}
                  isSelected={selectedId === org.organizationId}
                  onClick={setSelectedId}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <Building2
                  size={28}
                  className="text-neutral-300 dark:text-neutral-600"
                />
              </div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                No organization found
              </p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500">
                Subscribe and Create One or Get Invited
              </p>
            </div>
          )}

          {/* Continue Button — sticky bottom */}
          <div
            className={`
              sticky bottom-4 transition-all duration-300
              ${
                selectedId
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }
            `}
          >
            <div
              className="
              bg-white dark:bg-neutral-900
              rounded-2xl shadow-modal
              border border-neutral-200 dark:border-neutral-700
              p-4 flex items-center justify-between gap-4
            "
            >
              {/* Selected Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-gradient-warm flex items-center justify-center shrink-0">
                  <Building2 size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Selected
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {selectedOrg?.organizationName}
                  </p>
                </div>
              </div>

              {/* Continue */}
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="
                  flex items-center gap-2 px-5 py-2.5 text-sm font-semibold
                  bg-gradient-warm text-white rounded-xl shadow-order
                  hover:shadow-lg hover:-translate-y-0.5
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                  transition-all duration-200 flex-shrink-0
                "
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Organization Modal */}
      <AddOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOrganization}
      />
    </>
  );
};

export default OrganizationHome;
