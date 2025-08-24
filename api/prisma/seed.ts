import { PrismaClient } from '@prisma/client';
import fs from 'node:fs/promises';
import path from 'node:path';

const db = new PrismaClient();

interface VideoJSON {
  id: string;
  title: string;
  thumbnail_url: string;
  created_at: string;
  duration: number;
  views: number;
  tags: string[];
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..'); // .../video-library/api
  const file = path.join(projectRoot, 'videos.json'); // .../video-library/api/videos.json
  const raw = await fs.readFile(file, 'utf8');
  const data = JSON.parse(raw);
  const videos: VideoJSON[] = Array.isArray(data) ? data : data.videos;

  for (const v of videos) {
    await db.video.upsert({
      where: { id: v.id },
      update: {},
      create: {
        id: v.id,
        title: v.title,
        thumbnailUrl: v.thumbnail_url,
        createdAt: new Date(v.created_at),
        duration: v.duration,
        views: v.views,
        tags: {
          create: v.tags.map((name) => ({
            tag: { connectOrCreate: { where: { name }, create: { name } } },
          })),
        },
      },
    });
  }
}

main().finally(() => db.$disconnect()); 