export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="h-7 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
      </div>

      <section className="flex flex-col gap-4">
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <div className="h-10 w-40 rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-48 rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse" />
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex flex-col gap-2">
              <div className="rounded-lg overflow-hidden bg-white">
                <div className="w-full aspect-video bg-gray-200 animate-pulse" />
              </div>
              <div className="px-1 flex flex-col gap-2">
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
} 