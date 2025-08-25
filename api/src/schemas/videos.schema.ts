import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const ListQuerySchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(12),
});

export const VideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail_url: z.string().url(),
  created_at: z.string(),
  duration: z.number().int(),
  views: z.number().int(),
  tags: z.array(z.string()),
});

export const ListResponseSchema = z.object({
  items: z.array(VideoSchema),
  total: z.number().int(),
  page: z.number().int(),
  perPage: z.number().int(),
  totalPages: z.number().int(),
  pages: z.array(z.number().int()),
  hasPrev: z.boolean(),
  hasNext: z.boolean(),
  prevPage: z.number().int().optional(),
  nextPage: z.number().int().optional(),
});

export const CreateBodySchema = z.object({
  title: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  thumbnail_url: z.string().url().optional(),
  duration: z.coerce.number().int().min(0).optional(),
  views: z.coerce.number().int().min(0).optional(),
});

export const CreateResponseSchema = VideoSchema;

export const jsonSchemas = {
  ListQuery: zodToJsonSchema(ListQuerySchema, 'ListQuery'),
  ListResponse: zodToJsonSchema(ListResponseSchema, 'ListResponse'),
  CreateBody: zodToJsonSchema(CreateBodySchema, 'CreateBody'),
  CreateResponse: zodToJsonSchema(CreateResponseSchema, 'CreateResponse'),
}; 