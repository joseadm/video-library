import { FastifyRequest, FastifyReply } from 'fastify';
import { ListQuerySchema, CreateBodySchema } from '../schemas/videos.schema';
import { listVideosService, createVideoService } from '../services/videos.service';

export async function listVideosController(req: FastifyRequest, reply: FastifyReply) {
  const q = ListQuerySchema.parse(req.query);  
  const result = await listVideosService({ 
    q: q.q, 
    tag: q.tag, 
    from: q.from, 
    to: q.to, 
    sort: q.sort, 
    page: q.page, 
    perPage: q.perPage 
  });  
  return reply.send(result);
}

export async function createVideoController(req: FastifyRequest, reply: FastifyReply) {
  const body = CreateBodySchema.parse(req.body);
  const created = await createVideoService(body);
  return reply.code(201).send(created);
} 