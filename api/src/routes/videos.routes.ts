import { FastifyInstance } from 'fastify';
import { listVideosController, createVideoController } from '../controllers/videos.controller';

const VideoSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    thumbnail_url: { type: 'string' },
    created_at: { type: 'string' },
    duration: { type: 'number' },
    views: { type: 'number' },
    tags: { type: 'array', items: { type: 'string' } },
  },
  required: ['id', 'title', 'thumbnail_url', 'created_at', 'duration', 'views', 'tags'],
} as const;

const ListQuerySchema = {
  type: 'object',
  properties: {
    q: { type: 'string' },
    tag: { type: 'string' },
    sort: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
    page: { type: 'integer', minimum: 1, default: 1 },
    perPage: { type: 'integer', minimum: 1, maximum: 100, default: 12 },
  },
} as const;

const ListResponseSchema = {
  type: 'object',
  properties: {
    items: { type: 'array', items: VideoSchema },
    total: { type: 'number' },
    page: { type: 'number' },
    perPage: { type: 'number' },
    totalPages: { type: 'number' },
    pages: { type: 'array', items: { type: 'number' } },
    hasPrev: { type: 'boolean' },
    hasNext: { type: 'boolean' },
    prevPage: { type: 'number' },
    nextPage: { type: 'number' },
  },
  required: ['items', 'total', 'page', 'perPage', 'totalPages', 'pages', 'hasPrev', 'hasNext'],
} as const;

const CreateBodySchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    thumbnail_url: { type: 'string' },
    duration: { type: 'number' },
    views: { type: 'number' },
  },
  required: ['title'],
} as const;

export default async function videosRoutes(app: FastifyInstance) {
  app.get('/', {
    schema: {
      summary: 'List videos',
      tags: ['videos'],
      querystring: ListQuerySchema,
      response: { 200: ListResponseSchema },
    },
  }, listVideosController);

  app.post('/', {
    schema: {
      summary: 'Create video',
      tags: ['videos'],
      body: CreateBodySchema,
      response: { 201: VideoSchema },
    },
  }, createVideoController);
} 