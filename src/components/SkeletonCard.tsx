/**
 * components/SkeletonCard.tsx
 *
 * Purpose: Show animated placeholders while content is loading.
 * Without this, users see a blank area — bad UX.
 * With this, they see a smooth "loading pulse" that communicates progress.
 */

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 h-40 rounded-xl bg-slate-200" />
      <div className="h-4 w-3/4 rounded-full bg-slate-200" />
      <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-100" />
      <div className="mt-6 h-8 w-full rounded-xl bg-slate-100" />
    </div>
  );
}

export function SkeletonText({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-full bg-slate-200 ${className}`} />
  );
}

export function SkeletonDashboard() {
  return (
    <div className="animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="h-4 w-24 rounded-full bg-slate-200" />
          <div className="mt-3 h-10 w-80 rounded-full bg-slate-200" />
          <div className="mt-3 h-4 w-64 rounded-full bg-slate-100" />
        </div>
        <div className="mb-8 h-40 w-full rounded-[2rem] bg-slate-200" />
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 h-5 w-32 rounded-full bg-slate-200" />
              <div className="space-y-3">
                <div className="h-3 w-full rounded-full bg-slate-100" />
                <div className="h-3 w-5/6 rounded-full bg-slate-100" />
                <div className="h-3 w-4/6 rounded-full bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
