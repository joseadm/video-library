"use client";

import Link from "next/link";
import { VideoCard } from "@/components/video-card";
import { VideoRecord, VideoData } from "@/types";
import { SearchForm } from "@/components/search-form";
import { Pagination } from "@/components/pagination";
import { SortSelect } from "@/components/sort-select";
import { RetryNotice } from "@/components/retry-notice";
import { useVideoPage } from "@/hooks/use-video-page";
import { useSearchParams } from "next/navigation";


interface VideoLibraryClientProps {
  initialData: VideoData;
}

export function VideoLibraryClient({ initialData }: VideoLibraryClientProps) {
  // Get current URL params instead of using the old searchParams prop
  const currentSearchParams = useSearchParams();
  
  // Convert current URL params to the format expected by the hook
  const currentParams = {
    sort: currentSearchParams.get('sort') || 'desc',
    q: currentSearchParams.get('q') || '',
    tag: currentSearchParams.get('tag') || '',
    from: currentSearchParams.get('from') || '',
    to: currentSearchParams.get('to') || '',
    page: currentSearchParams.get('page') || '1',
    perPage: currentSearchParams.get('perPage') || '6',
  };

  const {
    data,
    error,
    sort,
    q,
    tag,
    from,
    to,
    perPage,
    totalPages,
    currentPage,
    buildPageQuery,
  } = useVideoPage(currentParams, initialData);

  if (error) {
    return <RetryNotice message="Failed to load videos" />;
  }

  const displayData = data || initialData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">My Library</h1>
        <p className="text-sm text-gray-600">Manage your video collection</p>
      </div>
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex h-10 w-32 px-3 whitespace-nowrap items-center btn btn-secondary"
            >
              All Videos
            </Link>
            <SortSelect defaultValue={sort} />
          </div>
          <div className="flex items-center gap-3">
            <SearchForm q={q} tag={tag} from={from} to={to} perPage={perPage} />
          </div>
        </div>
        
        {!displayData?.items ? (
          <RetryNotice message="The list is not available right now. Please try again." />
        ) : displayData.items.length === 0 ? (
          <div className="text-gray-600">No videos found.</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayData.items.map((video: VideoRecord) => (
              <VideoCard
                key={video.id}
                title={video.title}
                thumbnail_url={video.thumbnail_url}
                created_at={video.created_at}
                tags={video.tags}
              />
            ))}
          </ul>
        )}

        <Pagination
          totalPages={totalPages}
          pages={displayData?.pages ?? []}
          currentPage={currentPage}
          prevPage={displayData?.prevPage ?? undefined}
          nextPage={displayData?.nextPage ?? undefined}
          hasPrev={!!displayData?.hasPrev}
          hasNext={!!displayData?.hasNext}
          buildQuery={buildPageQuery}
        />
      </section>
    </div>
  );
} 