import { Suspense } from "react";
import { VideoLibraryClient } from "@/components/video-library-client";
import { fetchVideos } from "@/lib/api";
import Loading from "@/app/loading";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
  // Server-side data fetching
  const params = await searchParams;
  const initialData = await fetchVideos(params);

  return (
    <Suspense fallback={<Loading />}>
      <VideoLibraryClient 
        initialData={initialData}
      />
    </Suspense>
  );
}
