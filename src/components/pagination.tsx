import Link from "next/link";

export interface PaginationProps {
  totalPages: number;
  pages: number[];
  currentPage: number;
  prevPage?: number;
  nextPage?: number;
  hasPrev: boolean;
  hasNext: boolean;
  buildQuery: (page: number) => Record<string, string>;
}

export function Pagination({ totalPages, pages, currentPage, prevPage, nextPage, hasPrev, hasNext, buildQuery }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-2 flex items-center justify-center gap-4 text-sm">
      {hasPrev && prevPage && (
        <Link href={{ pathname: "/", query: buildQuery(prevPage) }} className="text-gray-700 hover:text-black text-lg" aria-label="Previous page">
          &lt;
        </Link>
      )}
      <div className="flex items-center gap-2">
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <Link
              key={p}
              href={{ pathname: "/", query: buildQuery(p) }}
              className={
                isActive
                  ? "w-7 h-7 inline-flex items-center justify-center rounded-full bg-[#ea2a33] text-white text-lg"
                  : "w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-lg"
              }
            >
              {p}
            </Link>
          );
        })}
      </div>
      {hasNext && nextPage && (
        <Link href={{ pathname: "/", query: buildQuery(nextPage) }} className="text-gray-700 hover:text-black text-lg" aria-label="Next page">
          &gt;
        </Link>
      )}
    </nav>
  );
} 