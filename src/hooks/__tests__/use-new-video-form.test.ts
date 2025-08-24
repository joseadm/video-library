import { renderHook, act } from '@testing-library/react'
import { useNewVideoForm } from '../use-new-video-form'

// Mock fetch globally
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>

// Mock environment variable
process.env.NEXT_PUBLIC_API_URL = 'https://localhost:4000'

// Mock toast to avoid complexity
jest.doMock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    promise: jest.fn().mockImplementation((promise) => promise),
  },
}))

// Clear module cache to ensure mock is applied
jest.resetModules()

describe('useNewVideoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createMockForm = (data: Record<string, string>) => {
    const form = document.createElement('form')
    Object.entries(data).forEach(([name, value]) => {
      const input = document.createElement('input')
      input.name = name
      input.value = value
      form.appendChild(input)
    })
    
    const preventDefault = jest.fn()
    return {
      preventDefault,
      currentTarget: form,
    } as unknown as React.FormEvent<HTMLFormElement>
  }

  describe('form submission', () => {
    it('should handle successful video creation', async () => {
      const mockResponse = { id: '1', title: 'Test Video' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const { result } = renderHook(() => useNewVideoForm())

      const mockForm = createMockForm({
        title: 'Test Video',
        tags: 'test,demo',
        thumbnail_url: 'https://example.com/thumb.jpg',
        duration: '120',
        views: '0',
      })

      await act(async () => {
        await result.current.onSubmit(mockForm)
      })

      expect(mockForm.preventDefault).toHaveBeenCalled()
      expect(global.fetch).toHaveBeenCalledWith('https://localhost:4000/videos', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Video',
          tags: ['test', 'demo'],
          duration: 120,
          views: 0,
          thumbnail_url: 'https://example.com/thumb.jpg',
        }),
      })
    })

    it('should handle minimal video creation', async () => {
      const mockResponse = { id: '1', title: 'Minimal Video' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const { result } = renderHook(() => useNewVideoForm())

      const mockForm = createMockForm({
        title: 'Minimal Video',
        tags: '',
        thumbnail_url: '',
        duration: '',
        views: '',
      })

      await act(async () => {
        await result.current.onSubmit(mockForm)
      })

      expect(global.fetch).toHaveBeenCalledWith('https://localhost:4000/videos', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: 'Minimal Video',
          tags: [],
        }),
      })
    })
  })

  describe('input validation', () => {
    it('should show error for missing title', async () => {
      const { result } = renderHook(() => useNewVideoForm())

      const mockForm = createMockForm({
        title: '',
        tags: 'test,demo',
      })

      await act(async () => {
        await result.current.onSubmit(mockForm)
      })

      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should show error for invalid thumbnail URL', async () => {
      const { result } = renderHook(() => useNewVideoForm())

      const mockForm = createMockForm({
        title: 'Test Video',
        tags: 'test,demo',
        thumbnail_url: 'invalid-url',
      })

      await act(async () => {
        await result.current.onSubmit(mockForm)
      })

      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should show error for invalid duration', async () => {
      const { result } = renderHook(() => useNewVideoForm())

      const mockForm = createMockForm({
        title: 'Test Video',
        tags: 'test,demo',
        duration: '-5',
      })

      await act(async () => {
        await result.current.onSubmit(mockForm)
      })

      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should show error for invalid views', async () => {
      const { result } = renderHook(() => useNewVideoForm())

      const mockForm = createMockForm({
        title: 'Test Video',
        tags: 'test,demo',
        views: 'abc',
      })

      await act(async () => {
        await result.current.onSubmit(mockForm)
      })

      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  describe('tag processing', () => {
    it('should process comma-separated tags correctly', async () => {
      const mockResponse = { id: '1', title: 'Test Video' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const { result } = renderHook(() => useNewVideoForm())

      const mockForm = createMockForm({
        title: 'Test Video',
        tags: '  tag1 , tag2 , tag3  ',
        thumbnail_url: '',
        duration: '',
        views: '',
      })

      await act(async () => {
        await result.current.onSubmit(mockForm)
      })

      expect(global.fetch).toHaveBeenCalledWith('https://localhost:4000/videos', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Video',
          tags: ['tag1', 'tag2', 'tag3'],
        }),
      })
    })

    it('should filter out empty tags', async () => {
      const mockResponse = { id: '1', title: 'Test Video' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const { result } = renderHook(() => useNewVideoForm())

      const mockForm = createMockForm({
        title: 'Test Video',
        tags: 'tag1,,tag2, , tag3',
        thumbnail_url: '',
        duration: '',
        views: '',
      })

      await act(async () => {
        await result.current.onSubmit(mockForm)
      })

      expect(global.fetch).toHaveBeenCalledWith('https://localhost:4000/videos', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Video',
          tags: ['tag1', 'tag2', 'tag3'],
        }),
      })
    })
  })
}) 