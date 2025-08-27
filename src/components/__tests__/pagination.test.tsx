// Mock dependencies before imports
jest.mock('next/link', () => ({
  __esModule: true,
  default: jest.fn(({ children, href, ...props }) => (
    <a href={JSON.stringify(href)} {...props}>
      {children}
    </a>
  ))
}));

// Import after mocking
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Pagination } from '../pagination'

describe('Pagination', () => {
  const mockBuildQuery = jest.fn((page: number) => ({ page: page.toString() }))
  
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Critical Functionality', () => {
    it('should render pagination with multiple pages', () => {
      render(
        <Pagination
          totalPages={5}
          pages={[1, 2, 3, 4, 5]}
          currentPage={3}
          prevPage={2}
          nextPage={4}
          hasPrev={true}
          hasNext={true}
          buildQuery={mockBuildQuery}
        />
      )
      
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    })

    it('should highlight current page correctly', () => {
      render(
        <Pagination
          totalPages={3}
          pages={[1, 2, 3]}
          currentPage={2}
          prevPage={1}
          nextPage={3}
          hasPrev={true}
          hasNext={true}
          buildQuery={mockBuildQuery}
        />
      )
      
      const currentPage = screen.getByText('2')
      expect(currentPage).toHaveClass('bg-[#ea2a33]', 'text-white')
    })
  })

  describe('Edge Cases', () => {
    it('should not render when totalPages is 1 or less', () => {
      const { container } = render(
        <Pagination
          totalPages={1}
          pages={[1]}
          currentPage={1}
          hasPrev={false}
          hasNext={false}
          buildQuery={mockBuildQuery}
        />
      )
      
      expect(container.firstChild).toBeNull()
    })

    it('should handle missing prev/next pages gracefully', () => {
      render(
        <Pagination
          totalPages={3}
          pages={[1, 2, 3]}
          currentPage={1}
          hasPrev={false}
          hasNext={true}
          nextPage={2}
          buildQuery={mockBuildQuery}
        />
      )
      
      expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument()
      expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    })
  })

  describe('Navigation Behavior', () => {
    it('should call buildQuery with correct page numbers', () => {
      render(
        <Pagination
          totalPages={3}
          pages={[1, 2, 3]}
          currentPage={2}
          prevPage={1}
          nextPage={3}
          hasPrev={true}
          hasNext={true}
          buildQuery={mockBuildQuery}
        />
      )
      
      const prevLink = screen.getByLabelText('Previous page')
      const nextLink = screen.getByLabelText('Next page')
      
      expect(prevLink).toHaveAttribute('href', JSON.stringify({ pathname: '/', query: { page: '1' } }))
      expect(nextLink).toHaveAttribute('href', JSON.stringify({ pathname: '/', query: { page: '3' } }))
    })
  })
})
