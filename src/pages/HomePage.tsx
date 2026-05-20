import { useState } from "react";
import { Building2, Search, Plus, ArrowRight, Loader2 } from "lucide-react";
import OrganizationCard from "@/components/organizations/OrganizationCard";
import { Layout } from "@/layouts/Layout";
import { PageKey } from "@/layouts/Sidebar";
import { useAppDispatch } from "@/store/hooks";
import { setValues } from "../store/slices/roleSlice";
import { useQuery } from "@tanstack/react-query";
import { getUserOrganizations } from "@/services/OrganizationService";
import { formatDateClient } from "@/helpers/dateFormatter";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState<PageKey>("home");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: organizationData } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getUserOrganizations(),
  });

  const organizations = organizationData?.data || [];

  const filtered = organizations.filter(
    (org) =>
      org.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      org.plan.toLowerCase().includes(search.toLowerCase()) ||
      formatDateClient(org.endDate).toLowerCase().includes(search.toLowerCase())
  );

  const selectedOrg = organizations.find(
    (org) => org.organizationId === selectedId
  );

  const handleContinue = () => {
    if (!selectedId) return;
    setIsLoading(true);
    dispatch(setValues({ activeOrganizationId: selectedId }));

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <div className="min-h-screen bg-surface-secondary font-sans">
        {/* Main Content */}
        <main className="pt-16 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order">
                  <Building2 size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-2xl text-neutral-900">
                    Select Organization
                  </h1>
                  <p className="text-sm text-neutral-500">
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search organization..."
                  className="
                  w-full pl-10 pr-4 py-2.5 text-sm
                  bg-surface border border-neutral-200 rounded-xl
                  text-neutral-900 placeholder:text-neutral-400
                  focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400
                  transition-all duration-200
                "
                />
              </div>

              {/* Add Button */}
              <button
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
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4">
              <p className="text-sm text-neutral-500">
                <span className="font-semibold text-neutral-900">
                  {filtered.length}
                </span>{" "}
                organization found
              </p>
              {selectedOrg && (
                <div className="flex items-center gap-1.5 text-sm text-primary-600 animate-fade-in">
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
              // Empty State
              <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
                  <Building2 size={28} className="text-neutral-300" />
                </div>
                <p className="font-semibold text-neutral-700 mb-1">
                  No organization found
                </p>
                <p className="text-sm text-neutral-400">
                  Try different search keywords
                </p>
              </div>
            )}

            {/* Continue Button */}
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
              <div className="bg-surface rounded-2xl shadow-modal border border-neutral-200 p-4 flex items-center justify-between gap-4">
                {/* Selected Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-warm flex items-center justify-center flex-shrink-0">
                    <Building2 size={16} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500">Selected</p>
                    <p className="text-sm font-semibold text-neutral-900 truncate">
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
      </div>
    </Layout>
  );
};

export default HomePage;
