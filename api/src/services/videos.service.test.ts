import * as repo from '../repositories/videos.repo';
import { listVideosService, createVideoService } from './videos.service';

jest.mock('../repositories/videos.repo');

describe('videos.service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('computes pagination window around current page', async () => {
    (repo.countVideos as any).mockResolvedValue(42);
    (repo.listVideos as any).mockResolvedValue(Array.from({ length: 6 }).map((_, i) => ({ id: String(i), title: 't', thumbnail_url: 'u', created_at: new Date().toISOString(), duration: 0, views: 0, tags: [] })));

    const result = await listVideosService({ q: undefined, tag: undefined, sort: 'desc', page: 6, perPage: 6 });

    expect(result.total).toBe(42);
    expect(result.page).toBe(6);
    expect(result.totalPages).toBe(Math.ceil(42 / 6));
    expect(result.pages.length).toBeLessThanOrEqual(5);
    expect(result.hasPrev).toBe(true);
    expect(result.hasNext).toBe(true);
  });

  test('create delegates to repository', async () => {
    (repo.createVideo as any).mockResolvedValue({ id: 'id', title: 'x', thumbnail_url: 'u', created_at: new Date().toISOString(), duration: 1, views: 2, tags: [] });
    const created = await createVideoService({ title: 'x' });
    expect(created.id).toBe('id');
    expect(repo.createVideo).toHaveBeenCalledWith({ title: 'x' });
  });
}); 