"use client";

import { VideoCard } from "@/components/video-card";
import { VideoRecord, VideoData } from "@/types";
import { SearchForm } from "@/components/search-form";
import { Pagination } from "@/components/pagination";
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
        <h1 className="text-xl font-semibold">My Library</h1>
        <p className="text-sm text-gray-600">Manage your video collection</p>
      </div>
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 mb-5">
          {/* Search form with all filters */}
          <SearchForm q={q} tag={tag} from={from} to={to} perPage={perPage} sort={sort} />
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