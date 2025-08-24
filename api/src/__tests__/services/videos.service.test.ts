import { listVideosService, createVideoService } from '../../services/videos.service';
import * as videosRepo from '../../repositories/videos.repo';

// Mock the repository module
jest.mock('../../repositories/videos.repo');
const mockVideosRepo = videosRepo as jest.Mocked<typeof videosRepo>;

describe('VideosService', () => {
  const mockVideo = {
    id: '1',
    title: 'Test Video',
    thumbnail_url: 'https://example.com/thumb.jpg',
    created_at: '2024-01-01T00:00:00.000Z',
    duration: 120,
    views: 1000,
    tags: ['test', 'demo'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listVideosService', () => {
    it('should return videos with pagination', async () => {
      const mockVideos = [mockVideo];
      const mockTotal = 1;
      
      mockVideosRepo.countVideos.mockResolvedValue(mockTotal);
      mockVideosRepo.listVideos.mockResolvedValue(mockVideos);

      const result = await listVideosService({
        page: 1,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: '',
      });

      expect(result.items).toEqual(mockVideos);
      expect(result.total).toBe(mockTotal);
      expect(result.totalPages).toBe(1);
      expect(result.page).toBe(1);
      expect(result.hasPrev).toBe(false);
      expect(result.hasNext).toBe(false);
      expect(mockVideosRepo.countVideos).toHaveBeenCalledWith({
        q: '',
        tag: '',
        sort: 'desc',
      });
      expect(mockVideosRepo.listVideos).toHaveBeenCalledWith({
        page: 1,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: '',
      });
    });

    it('should handle empty results', async () => {
      mockVideosRepo.countVideos.mockResolvedValue(0);
      mockVideosRepo.listVideos.mockResolvedValue([]);

      const result = await listVideosService({
        page: 1,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: '',
      });

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(1);
      expect(result.pages).toEqual([1]);
    });

    it('should calculate pagination correctly for multiple pages', async () => {
      mockVideosRepo.countVideos.mockResolvedValue(25);
      mockVideosRepo.listVideos.mockResolvedValue([]);

      const result = await listVideosService({
        page: 2,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: '',
      });

      expect(result.totalPages).toBe(3); // 25 items / 10 per page = 3 pages
      expect(result.page).toBe(2);
      expect(result.hasPrev).toBe(true);
      expect(result.hasNext).toBe(true);
      expect(result.prevPage).toBe(1);
      expect(result.nextPage).toBe(3);
      expect(result.pages).toEqual([1, 2, 3]); // Window size of 5, but only 3 total pages
    });

    it('should handle edge case pagination at last page', async () => {
      mockVideosRepo.countVideos.mockResolvedValue(100);
      mockVideosRepo.listVideos.mockResolvedValue([]);

      const result = await listVideosService({
        page: 10,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: '',
      });

      expect(result.totalPages).toBe(10);
      expect(result.page).toBe(10);
      expect(result.hasPrev).toBe(true);
      expect(result.hasNext).toBe(false);
      expect(result.prevPage).toBe(9);
      expect(result.nextPage).toBeUndefined();
      expect(result.pages).toEqual([6, 7, 8, 9, 10]); // Last 5 pages
    });

    it('should apply search query correctly', async () => {
      mockVideosRepo.countVideos.mockResolvedValue(0);
      mockVideosRepo.listVideos.mockResolvedValue([]);

      await listVideosService({
        page: 1,
        perPage: 10,
        sort: 'desc',
        q: 'test query',
        tag: '',
      });

      expect(mockVideosRepo.countVideos).toHaveBeenCalledWith({
        q: 'test query',
        tag: '',
        sort: 'desc',
      });
      expect(mockVideosRepo.listVideos).toHaveBeenCalledWith({
        page: 1,
        perPage: 10,
        sort: 'desc',
        q: 'test query',
        tag: '',
      });
    });

    it('should apply tag filter correctly', async () => {
      mockVideosRepo.countVideos.mockResolvedValue(0);
      mockVideosRepo.listVideos.mockResolvedValue([]);

      await listVideosService({
        page: 1,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: 'music',
      });

      expect(mockVideosRepo.countVideos).toHaveBeenCalledWith({
        q: '',
        tag: 'music',
        sort: 'desc',
      });
      expect(mockVideosRepo.listVideos).toHaveBeenCalledWith({
        page: 1,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: 'music',
      });
    });

    it('should handle invalid page numbers gracefully', async () => {
      mockVideosRepo.countVideos.mockResolvedValue(100);
      mockVideosRepo.listVideos.mockResolvedValue([]);

      // Page 0 should be clamped to 1
      const result = await listVideosService({
        page: 0,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: '',
      });

      expect(result.page).toBe(1);
      expect(mockVideosRepo.listVideos).toHaveBeenCalledWith({
        page: 1,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: '',
      });
    });

    it('should handle page beyond total pages gracefully', async () => {
      mockVideosRepo.countVideos.mockResolvedValue(10);
      mockVideosRepo.listVideos.mockResolvedValue([]);

      // Page 5 when there's only 1 page should be clamped to 1
      const result = await listVideosService({
        page: 5,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: '',
      });

      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('createVideoService', () => {
    const createInput = {
      title: 'New Video',
      tags: ['new', 'video'],
      thumbnail_url: 'https://example.com/new.jpg',
      duration: 180,
      views: 0,
    };

    it('should create video successfully', async () => {
      const createdVideo = { ...mockVideo, ...createInput, id: '2' };
      mockVideosRepo.createVideo.mockResolvedValue(createdVideo);

      const result = await createVideoService(createInput);

      expect(result).toEqual(createdVideo);
      expect(mockVideosRepo.createVideo).toHaveBeenCalledWith(createInput);
    });

    it('should handle creation with minimal data', async () => {
      const minimalInput = { title: 'Minimal Video' };
      const createdVideo = { ...mockVideo, ...minimalInput, id: '3' };
      mockVideosRepo.createVideo.mockResolvedValue(createdVideo);

      const result = await createVideoService(minimalInput);

      expect(result.title).toBe('Minimal Video');
      expect(mockVideosRepo.createVideo).toHaveBeenCalledWith(minimalInput);
    });

    it('should handle creation errors', async () => {
      mockVideosRepo.createVideo.mockRejectedValue(new Error('Database error'));

      await expect(createVideoService(createInput)).rejects.toThrow('Database error');
    });
  });

  describe('error handling', () => {
    it('should handle repository errors gracefully', async () => {
      mockVideosRepo.countVideos.mockRejectedValue(new Error('Database connection failed'));

      await expect(listVideosService({
        page: 1,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: '',
      })).rejects.toThrow('Database connection failed');
    });

    it('should handle list videos errors gracefully', async () => {
      mockVideosRepo.countVideos.mockResolvedValue(10);
      mockVideosRepo.listVideos.mockRejectedValue(new Error('Query failed'));

      await expect(listVideosService({
        page: 1,
        perPage: 10,
        sort: 'desc',
        q: '',
        tag: '',
      })).rejects.toThrow('Query failed');
    });
  });
}); 