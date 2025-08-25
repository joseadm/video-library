import { prisma } from '../db/client';
import crypto from 'node:crypto';

export interface ListParams {
  q?: string;
  tag?: string;
  from?: string;
  to?: string;
  sort: 'asc' | 'desc';
  page: number;
  perPage: number;
}

export async function countVideos(params: Omit<ListParams, 'page' | 'perPage' | 'sort'> & { sort?: 'asc' | 'desc' }) {
  console.log('🔍 countVideos params:', params);
  
  const where: any = {
    AND: [
      params.q ? { title: { contains: params.q } } : {},
      params.tag ? { tags: { some: { tag: { name: params.tag } } } } : {},
      params.from ? { createdAt: { gte: new Date(params.from) } } : {},
      params.to ? { createdAt: { lte: new Date(params.to) } } : {},
    ],
  };
  
  console.log('🔍 countVideos where clause:', JSON.stringify(where, null, 2));
  
  const count = await prisma.video.count({ where });
  console.log('🔍 countVideos result:', count);
  
  return count;
}

export async function listVideos(params: ListParams) {
  console.log('🔍 listVideos params:', params);
  
  const where: any = {
    AND: [
      params.q ? { title: { contains: params.q } } : {},
      params.tag ? { tags: { some: { tag: { name: params.tag } } } } : {},
      params.from ? { createdAt: { gte: new Date(params.from) } } : {},
      params.to ? { createdAt: { lte: new Date(params.to) } } : {},
    ],
  };
  
  console.log('🔍 listVideos where clause:', JSON.stringify(where, null, 2));
  
  const items = await prisma.video.findMany({
    where,
    orderBy: { createdAt: params.sort },
    include: { tags: { include: { tag: true } } },
    skip: (params.page - 1) * params.perPage,
    take: params.perPage,
  });
  
  console.log('🔍 listVideos found items:', items.length);
  console.log('🔍 listVideos first item date:', items[0]?.createdAt);
  
  return items.map((v) => ({
    id: v.id,
    title: v.title,
    thumbnail_url: v.thumbnailUrl,
    created_at: v.createdAt.toISOString(),
    duration: v.duration,
    views: v.views,
    tags: v.tags.map((t: { tag: { name: string } }) => t.tag.name),
  }));
}

export async function createVideo(data: { title: string; tags?: string[]; thumbnail_url?: string; duration?: number; views?: number; }) {
  const created = await prisma.video.create({
    data: {
      id: crypto.randomUUID(),
      title: data.title,
      thumbnailUrl: data.thumbnail_url ?? 'https://via.placeholder.com/320x180.webp?text=Video',
      duration: data.duration ?? 120,
      views: data.views ?? 0,
      tags: {
        create: (data.tags ?? []).map((name) => ({
          tag: { connectOrCreate: { where: { name }, create: { name } } },
        })),
      },
    },
    include: { tags: { include: { tag: true } } },
  });
  return {
    id: created.id,
    title: created.title,
    thumbnail_url: created.thumbnailUrl,
    created_at: created.createdAt.toISOString(),
    duration: created.duration,
    views: created.views,
    tags: created.tags.map((t: { tag: { name: string } }) => t.tag.name),
  };
} 