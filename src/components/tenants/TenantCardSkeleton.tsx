const TenantCardSkeleton = () => (
  <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-card p-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full w-32" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full w-14" />
        </div>
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full w-48" />
      </div>
    </div>
  </div>
);

export default TenantCardSkeleton;
