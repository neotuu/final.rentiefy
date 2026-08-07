export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="h-48 shimmer" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 w-3/5 rounded shimmer" />
          <div className="h-4 w-1/5 rounded shimmer" />
        </div>
        <div className="mt-2 h-3 w-2/5 rounded shimmer" />
        <div className="mt-3 flex gap-1.5">
          <div className="h-5 w-16 rounded-full shimmer" />
          <div className="h-5 w-12 rounded-full shimmer" />
          <div className="h-5 w-14 rounded-full shimmer" />
        </div>
      </div>
    </div>
  )
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="h-5 w-32 rounded shimmer mb-4" />
      <div className="h-72 rounded-2xl shimmer mb-6" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-7 w-3/4 rounded shimmer" />
          <div className="h-4 w-1/2 rounded shimmer" />
          <div className="h-24 w-full rounded-xl shimmer" />
          <div className="h-4 w-full rounded shimmer" />
          <div className="h-4 w-5/6 rounded shimmer" />
        </div>
        <div className="space-y-4">
          <div className="h-40 w-full rounded-2xl shimmer" />
          <div className="h-10 w-full rounded-xl shimmer" />
        </div>
      </div>
    </div>
  )
}
