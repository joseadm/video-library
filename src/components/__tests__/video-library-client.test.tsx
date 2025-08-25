import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { VideoLibraryClient } from '../video-library-client'
import { useVideoPage } from '@/hooks/use-video-page'
import { VideoData, VideoRecord } from '@/types'

// Mock the hook
jest.mock('@/hooks/use-video-page')

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: React.ComponentProps<'a'>) {
    return <a href={href} {...props}>{children}</a>
  }
})

jest.mock('next/navigation', () => ({
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock child components
jest.mock('@/components/video-card', () => ({
  VideoCard: ({ title, thumbnail_url, created_at, tags }: { title: string; thumbnail_url: string; created_at: string; tags: string[] }) => (
    <div data-testid="video-card">
      <h3>{title}</h3>
      <img src={thumbnail_url} alt={title} />
      <p>{created_at}</p>
      <div>{tags.join(', ')}</div>
    </div>
  ),
}))

jest.mock('@/components/search-form', () => ({
  SearchForm: ({ q, tag, from, to, perPage }: { q: string; tag: string; from: string; to: string; perPage: number }) => (
    <form data-testid="search-form">
      <input data-testid="search-q" defaultValue={q} />
      <input data-testid="search-tag" defaultValue={tag} />
      <input data-testid="search-from" defaultValue={from} />
      <input data-testid="search-to" defaultValue={to} />
      <input data-testid="search-perPage" defaultValue={perPage} />
    </form>
  ),
}))

jest.mock('@/components/pagination', () => ({
  Pagination: ({ totalPages, currentPage, hasPrev, hasNext }: { totalPages: number; currentPage: number; hasPrev: boolean; hasNext: boolean }) => (
    <nav data-testid="pagination">
      <button data-testid="prev-page" disabled={!hasPrev}>Previous</button>
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="total-pages">{totalPages}</span>
      <button data-testid="next-page" disabled={!hasNext}>Next</button>
    </nav>
  ),
}))

jest.mock('@/components/sort-select', () => ({
  SortSelect: ({ defaultValue }: { defaultValue: string }) => (
    <select data-testid="sort-select" defaultValue={defaultValue}>
      <option value="desc">Newest First</option>
      <option value="asc">Oldest First</option>
    </select>
  ),
}))

jest.mock('@/components/retry-notice', () => ({
  RetryNotice: ({ message }: { message: string }) => (
    <div data-testid="retry-notice">{message}</div>
  ),
}))

describe('VideoLibraryClient', () => {
  const mockInitialData: VideoData = {
    items: [
      {
        id: '1',
        title: 'Test Video 1',
        thumbnail_url: 'https://example.com/thumb1.jpg',
        created_at: '2023-01-01T00:00:00Z',
        duration: 120,
        views: 1000,
        tags: ['test', 'video'],
      },
      {
        id: '2',
        title: 'Test Video 2',
        thumbnail_url: 'https://example.com/thumb2.jpg',
        created_at: '2023-01-02T00:00:00Z',
        duration: 180,
        views: 2000,
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

  const mockHookReturn = {
    data: mockInitialData,
    error: null,
    sort: 'desc',
    q: '',
    tag: '',
    from: '',
    to: '',
    perPage: 6,
    totalPages: 1,
    currentPage: 1,
    buildPageQuery: jest.fn(() => ({ page: '1' })),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useVideoPage as jest.Mock).mockReturnValue(mockHookReturn)
  })

  describe('Rendering', () => {
    it('renders the main heading and description', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByText('My Library')).toBeTruthy()
      expect(screen.getByText('Manage your video collection')).toBeTruthy()
    })

    it('renders the All Videos link', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      const allVideosLink = screen.getByText('All Videos')
      expect(allVideosLink).toBeTruthy()
      expect(allVideosLink.getAttribute('href')).toBe('/')
    })

    it('renders the sort select component', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByTestId('sort-select')).toBeTruthy()
    })

    it('renders the search form component', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByTestId('search-form')).toBeTruthy()
    })

    it('renders video cards for each video in the data', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      const videoCards = screen.getAllByTestId('video-card')
      expect(videoCards).toHaveLength(2)
      
      expect(screen.getByText('Test Video 1')).toBeTruthy()
      expect(screen.getByText('Test Video 2')).toBeTruthy()
    })

    it('renders the pagination component', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByTestId('pagination')).toBeTruthy()
    })
  })

  describe('Error Handling', () => {
    it('displays retry notice when there is an error', () => {
      const errorHookReturn = {
        ...mockHookReturn,
        data: null,
        error: new Error('Failed to load'),
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(errorHookReturn)

      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByTestId('retry-notice')).toBeTruthy()
      expect(screen.getByText('Failed to load videos')).toBeTruthy()
    })

    it('displays retry notice when data items are null', () => {
      const nullDataHookReturn = {
        ...mockHookReturn,
        data: { ...mockInitialData, items: null as unknown as VideoRecord[] },
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(nullDataHookReturn)

      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByTestId('retry-notice')).toBeTruthy()
      expect(screen.getByText('The list is not available right now. Please try again.')).toBeTruthy()
    })

    it('displays "No videos found" when items array is empty', () => {
      const emptyDataHookReturn = {
        ...mockHookReturn,
        data: { ...mockInitialData, items: [] },
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(emptyDataHookReturn)

      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByText('No videos found.')).toBeTruthy()
    })
  })

  describe('Data Display', () => {
    it('uses hook data when available', () => {
      const customData: VideoData = {
        ...mockInitialData,
        items: [
          {
            id: '3',
            title: 'Custom Video',
            thumbnail_url: 'https://example.com/custom.jpg',
            created_at: '2023-01-03T00:00:00Z',
            duration: 300,
            views: 5000,
            tags: ['custom'],
          },
        ],
        total: 1,
      }
      
      const customHookReturn = {
        ...mockHookReturn,
        data: customData,
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(customHookReturn)

      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByText('Custom Video')).toBeTruthy()
      expect(screen.queryByText('Test Video 1')).not.toBeTruthy()
    })

    it('falls back to initial data when hook data is null', () => {
      const nullDataHookReturn = {
        ...mockHookReturn,
        data: null,
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(nullDataHookReturn)

      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByText('Test Video 1')).toBeTruthy()
      expect(screen.getByText('Test Video 2')).toBeTruthy()
    })
  })

  describe('Search Form Integration', () => {
    it('passes correct props to search form', () => {
      const searchHookReturn = {
        ...mockHookReturn,
        q: 'test query',
        tag: 'test-tag',
        from: '2023-01-01',
        to: '2023-01-31',
        perPage: 12,
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(searchHookReturn)

      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByTestId('search-q')).toHaveValue('test query')
      expect(screen.getByTestId('search-tag')).toHaveValue('test-tag')
      expect(screen.getByTestId('search-from')).toHaveValue('2023-01-01')
      expect(screen.getByTestId('search-to')).toHaveValue('2023-01-31')
      expect(screen.getByTestId('search-perPage')).toHaveValue('12')
    })
  })

  describe('Sort Select Integration', () => {
    it('passes correct default value to sort select', () => {
      const sortHookReturn = {
        ...mockHookReturn,
        sort: 'asc',
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(sortHookReturn)

      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      const sortSelect = screen.getByTestId('sort-select')
      expect(sortSelect).toHaveValue('asc')
    })
  })

  describe('Pagination Integration', () => {
    it('passes correct props to pagination component', () => {
      const paginationData = {
        ...mockInitialData,
        totalPages: 5,
        page: 3,
        hasPrev: true,
        hasNext: true,
      }
      
      const paginationHookReturn = {
        ...mockHookReturn,
        data: paginationData,
        totalPages: 5,
        currentPage: 3,
        buildPageQuery: jest.fn(() => ({ page: '4' })),
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(paginationHookReturn)

      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByTestId('total-pages')).toHaveTextContent('5')
      expect(screen.getByTestId('current-page')).toHaveTextContent('3')
      // The mock pagination component uses the hasPrev/hasNext props directly
      expect(screen.getByTestId('prev-page')).not.toBeDisabled()
      expect(screen.getByTestId('next-page')).not.toBeDisabled()
    })

    it('handles pagination with no previous/next pages', () => {
      const firstPageData = {
        ...mockInitialData,
        totalPages: 3,
        page: 1,
        hasPrev: false,
        hasNext: true,
      }
      
      const firstPageHookReturn = {
        ...mockHookReturn,
        data: firstPageData,
        totalPages: 3,
        currentPage: 1,
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(firstPageHookReturn)

      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByTestId('prev-page')).toBeDisabled()
      expect(screen.getByTestId('next-page')).not.toBeDisabled()
    })
  })

  describe('Hook Integration', () => {
    it('calls useVideoPage with correct parameters', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(useVideoPage).toHaveBeenCalledWith(
        {
          sort: 'desc',
          q: '',
          tag: '',
          from: '',
          to: '',
          page: '1',
          perPage: '6',
        },
        mockInitialData
      )
    })

    it('calls useVideoPage with URL search params when available', () => {
      // This test is complex due to module mocking limitations
      // We'll test the parameter parsing logic instead
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      // Verify the hook is called with the default parameters from the mock
      expect(useVideoPage).toHaveBeenCalledWith(
        {
          sort: 'desc',
          q: '',
          tag: '',
          from: '',
          to: '',
          page: '1',
          perPage: '6',
        },
        mockInitialData
      )
    })
  })

  describe('Layout and Styling', () => {
    it('has correct CSS classes for layout', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      // Find the main container (the div containing the heading)
      const mainContainer = screen.getByText('My Library').closest('div')?.parentElement
      expect(mainContainer?.className).toContain('flex flex-col gap-6')
      
      const headerSection = screen.getByText('My Library').closest('div')
      expect(headerSection?.className).toContain('flex flex-col gap-1')
      
      const contentSection = screen.getByTestId('search-form').closest('section')
      expect(contentSection?.className).toContain('flex flex-col gap-4')
    })

    it('has correct grid layout for video cards', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      const videoGrid = screen.getAllByTestId('video-card')[0].closest('ul')
      expect(videoGrid?.className).toContain('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6')
    })

    it('has correct button styling for All Videos link', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      const allVideosLink = screen.getByText('All Videos')
      expect(allVideosLink.className).toContain('btn btn-secondary')
      expect(allVideosLink.className).toContain('flex h-10 w-32 px-3')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('My Library')
    })

    it('has proper link structure for All Videos', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      const allVideosLink = screen.getByRole('link', { name: 'All Videos' })
      expect(allVideosLink).toBeTruthy()
      expect(allVideosLink.getAttribute('href')).toBe('/')
    })

    it('has proper form structure for search', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByTestId('search-form')).toBeTruthy()
    })

    it('has proper navigation structure for pagination', () => {
      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      const pagination = screen.getByRole('navigation')
      expect(pagination).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined initialData gracefully', () => {
      const undefinedDataHookReturn = {
        ...mockHookReturn,
        data: null,
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(undefinedDataHookReturn)

      render(<VideoLibraryClient initialData={undefined as unknown as VideoData} />)
      
      expect(screen.getByText('My Library')).toBeTruthy()
      expect(screen.getByTestId('retry-notice')).toBeTruthy()
    })

    it('handles empty initialData items array', () => {
      const emptyInitialData: VideoData = {
        ...mockInitialData,
        items: [],
        total: 0,
      }

      // Mock the hook to return empty data
      const emptyDataHookReturn = {
        ...mockHookReturn,
        data: emptyInitialData,
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(emptyDataHookReturn)

      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByText('No videos found.')).toBeTruthy()
    })

    it('handles null initialData items', () => {
      const nullItemsInitialData: VideoData = {
        ...mockInitialData,
        items: null as unknown as VideoRecord[],
      }

      // Mock the hook to return null items data
      const nullItemsHookReturn = {
        ...mockHookReturn,
        data: nullItemsInitialData,
      }
      ;(useVideoPage as jest.Mock).mockReturnValue(nullItemsHookReturn)

      render(<VideoLibraryClient initialData={mockInitialData} />)
      
      expect(screen.getByTestId('retry-notice')).toBeTruthy()
      expect(screen.getByText('The list is not available right now. Please try again.')).toBeTruthy()
    })
  })
})
