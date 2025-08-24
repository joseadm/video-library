import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import sensible from '@fastify/sensible';
import videosRoutes from './routes/videos.routes';

const app = Fastify({ logger: true });
const db = new PrismaClient();

app.setErrorHandler((err, req, reply) => {
  app.log.error({ err }, 'unhandled-error');
  if ((err as any).issues && (err as any).name === 'ZodError') {
    return reply.code(400).send({ error: 'Invalid request', details: (err as any).issues });
  }
  const status = (err as any).statusCode && typeof (err as any).statusCode === 'number' ? (err as any).statusCode : 500;
  return reply.code(status).send({ error: status === 500 ? 'Internal Server Error' : err.message });
});

app.register(cors, { origin: true });
app.register(sensible);
app.register(swagger, {
  swagger: {
    info: { title: 'Video API', version: '1.0.0' },
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});
app.register(swaggerUI, { routePrefix: '/docs', uiConfig: { docExpansion: 'list' }, staticCSP: true });

app.get('/health', async () => ({ status: 'ok', service: 'video-api' }));
app.get('/ready', async (req, reply) => {
  try {
    await db.$queryRaw`SELECT 1`;
    return reply.send({ ready: true });
  } catch {
    return reply.code(503).send({ ready: false });
  }
});

app.register(videosRoutes, { prefix: '/videos' });

const port = Number(process.env.PORT || 4000);
app.listen({ port, host: '0.0.0.0' }); 