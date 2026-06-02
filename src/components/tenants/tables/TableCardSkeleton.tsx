const TableCardSkeleton = () => (
  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-card p-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
        <div className="h-3 w-16 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800"
          />
        ))}
      </div>
    </div>
  </div>
);

export default TableCardSkeleton;
