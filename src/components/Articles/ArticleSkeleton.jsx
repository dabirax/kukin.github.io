export const ArticleSkeleton = () => (
  <div className="overflow-hidden rounded-3xl bg-[#1E1E2F] ring-1 ring-white/10">
    <div className="h-48 animate-pulse bg-slate-700/40" />
    <div className="space-y-3 p-5">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-700/50" />
      <div className="h-6 w-4/5 animate-pulse rounded bg-slate-700/50" />
      <div className="h-4 w-full animate-pulse rounded bg-slate-700/40" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-700/40" />
      <div className="flex items-center gap-3 pt-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-slate-700/50" />
        <div className="h-4 w-32 animate-pulse rounded bg-slate-700/40" />
      </div>
    </div>
  </div>
);

export const ArticleSkeletonGrid = ({ count = 6 }) => (
  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <ArticleSkeleton key={index} />
    ))}
  </div>
);

export default ArticleSkeletonGrid;
