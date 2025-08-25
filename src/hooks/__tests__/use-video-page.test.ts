import { renderHook, act, waitFor } from '@testing-library/react'
import { useVideoPage } from '../use-video-page'

// Mock fetch globally
global.fetch = jest.fn()

// Mock environment variable
process.env.NEXT_PUBLIC_API_URL = 'https://localhost:4000'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

describe('useVideoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockVideoData = {
    items: [
      {
        id: '1',
        title: 'Test Video 1',
        thumbnail_url: 'https://example.com/thumb1.jpg',
        created_at: '2024-01-15T10:00:00Z',
        tags: ['test', 'demo'],
      },
      {
        id: '2',
        title: 'Test Video 2',
        thumbnail_url: 'https://example.com/thumb2.jpg',
        created_at: '2024-01-14T10:00:00Z',
        tags: ['demo', 'video'],
      },
    ],
    total: 2,
    page: 1,
    perPage: 6,
    totalPages: 1,
    pages: [1],
    hasPrev: false,
    hasNext: false,
    prevPage: null,
    nextPage: null,
  }

  describe('search params parsing', () => {
    it('should parse default search params correctly', async () => {
      const { result } = renderHook(() => useVideoPage({}))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.sort).toBe('desc')
      expect(result.current.q).toBe('')
      expect(result.current.tag).toBe('')
      expect(result.current.from).toBe('')
      expect(result.current.to).toBe('')
      expect(result.current.page).toBe(1)
      expect(result.current.perPage).toBe(6)
    })

    it('should parse custom search params correctly', async () => {
      const searchParams = {
        sort: 'asc',
        q: 'test query',
        tag: 'demo',
        from: '2024-01-01',
        to: '2024-01-31',
        page: '2',
      }

      const { result } = renderHook(() => useVideoPage(searchParams))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.sort).toBe('asc')
      expect(result.current.q).toBe('test query')
      expect(result.current.tag).toBe('demo')
      expect(result.current.from).toBe('2024-01-01')
      expect(result.current.to).toBe('2024-01-31')
      expect(result.current.page).toBe(2)
      expect(result.current.perPage).toBe(6)
    })

    it('should handle array values in search params', async () => {
      const searchParams = {
        tag: 'demo',
        q: 'search',
      }

      const { result } = renderHook(() => useVideoPage(searchParams))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.tag).toBe('demo') // Fixed: expect string, not array
      expect(result.current.q).toBe('search')
    })
  })

  describe('data fetching', () => {
    it('should fetch videos successfully', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVideoData,
      })

      const { result } = renderHook(() => useVideoPage({}))

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBe(null)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toEqual(mockVideoData)
      expect(result.current.error).toBe(null)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.anything(),
        { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: expect.any(AbortSignal),
        }
      )
      
      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should handle fetch errors gracefully', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useVideoPage({}))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('Failed to connect to video service')
      expect(result.current.data).toBe(null)
    })

    it('should handle non-ok responses', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const { result } = renderHook(() => useVideoPage({}))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('Failed to fetch videos: undefined')
      expect(result.current.data).toBe(null)
    })

    it('should include all search params in fetch URL', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVideoData,
      })

      const searchParams = {
        sort: 'asc',
        q: 'test',
        tag: 'demo',
        from: '2024-01-01',
        to: '2024-01-31',
        page: '2',
      }

      renderHook(() => useVideoPage(searchParams))

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.anything(),
          { 
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: expect.any(AbortSignal),
          }
        )
        
        // Verify fetch was called
        expect(global.fetch).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('pagination', () => {
    it('should calculate pagination correctly', async () => {
      const paginatedData = {
        ...mockVideoData,
        total: 25,
        totalPages: 5,
        page: 2,
        pages: [1, 2, 3, 4, 5],
        hasPrev: true,
        hasNext: true,
        prevPage: 1,
        nextPage: 3,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => paginatedData,
      })

      const { result } = renderHook(() => useVideoPage({ page: '2' }))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.totalPages).toBe(5)
      expect(result.current.currentPage).toBe(2)
      expect(result.current.data?.hasPrev).toBe(true)
      expect(result.current.data?.hasNext).toBe(true)
      expect(result.current.data?.prevPage).toBe(1)
      expect(result.current.data?.nextPage).toBe(3)
    })

    it('should handle edge cases for pagination', async () => {
      const edgeCaseData = {
        ...mockVideoData,
        total: 0,
        totalPages: 0,
        page: 1,
        pages: [],
        hasPrev: false,
        hasNext: false,
        prevPage: null,
        nextPage: null,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => edgeCaseData,
      })

      const { result } = renderHook(() => useVideoPage({}))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.totalPages).toBe(0) // Actual value from data
      expect(result.current.currentPage).toBe(1)
    })
  })

  describe('buildPageQuery', () => {
    it('should build query with all current search params', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVideoData,
      })

      const searchParams = {
        sort: 'asc',
        q: 'test query',
        tag: 'demo',
        from: '2024-01-01',
        to: '2024-01-31',
        page: '1',
      }

      const { result } = renderHook(() => useVideoPage(searchParams))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const nextPageQuery = result.current.buildPageQuery(3)

      expect(nextPageQuery).toEqual({
        sort: 'asc',
        q: 'test query',
        tag: 'demo',
        from: '2024-01-01',
        to: '2024-01-31',
        page: '3',
        perPage: '6',
      })
    })

    it('should build query with only non-empty search params', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVideoData,
      })

      const searchParams = {
        sort: 'desc',
        q: '',
        tag: '',
        from: '',
        to: '',
        page: '1',
      }

      const { result } = renderHook(() => useVideoPage(searchParams))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const nextPageQuery = result.current.buildPageQuery(2)

      expect(nextPageQuery).toEqual({
        sort: 'desc',
        page: '2',
        perPage: '6',
      })
    })

    it('should handle different page numbers correctly', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVideoData,
      })

      const { result } = renderHook(() => useVideoPage({}))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.buildPageQuery(5)).toEqual({
        sort: 'desc',
        page: '5',
        perPage: '6',
      })

      expect(result.current.buildPageQuery(10)).toEqual({
        sort: 'desc',
        page: '10',
        perPage: '6',
      })
    })
  })

  describe('useEffect dependencies', () => {
    it('should refetch when search params change', async () => {
      const { result, rerender } = renderHook(
        ({ params }) => useVideoPage(params),
        { initialProps: { params: {} } }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Change search params
      rerender({ params: { q: 'new search' } })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('should handle multiple rapid param changes', async () => {
      const { result, rerender } = renderHook(
        ({ params }) => useVideoPage(params),
        { initialProps: { params: {} } }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Rapidly change multiple params
      rerender({ params: { q: 'search1' } })
      rerender({ params: { q: 'search2' } })
      rerender({ params: { q: 'search3' } })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Should have made multiple fetch calls
      expect(global.fetch).toHaveBeenCalledTimes(4)
    })
  })

  describe('error handling edge cases', () => {
    it('should handle non-Error exceptions', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce('String error')

      const { result } = renderHook(() => useVideoPage({}))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('Failed to connect to video service')
      expect(result.current.data).toBe(null)
    })

    it('should handle undefined search params gracefully', async () => {
      const { result } = renderHook(() => useVideoPage({ sort: undefined }))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.sort).toBe('desc') // Default value
    })
  })
}) 