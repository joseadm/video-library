import { countVideos, createVideo as repoCreate, listVideos as repoList, ListParams } from '../repositories/videos.repo';

export async function listVideosService(params: ListParams) {
  const total = await countVideos({ q: params.q, tag: params.tag, from: params.from, to: params.to, sort: params.sort });
  const totalPages = Math.max(1, Math.ceil(total / params.perPage));
  const current = Math.min(Math.max(1, params.page), totalPages);
  const items = await repoList({ ...params, page: current });

  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, current - half);
  let end = start + windowSize - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - windowSize + 1);
  }
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return {
    items,
    total,
    page: current,
    perPage: params.perPage,
    totalPages,
    pages,
    hasPrev: current > 1,
    hasNext: current < totalPages,
    prevPage: current > 1 ? current - 1 : undefined,
    nextPage: current < totalPages ? current + 1 : undefined,
  };
}

export async function createVideoService(data: { title: string; tags?: string[]; thumbnail_url?: string; duration?: number; views?: number }) {
  return repoCreate(data);
} 