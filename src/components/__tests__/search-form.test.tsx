// Mock dependencies before imports
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/components/sort-select', () => ({
  SortSelect: jest.fn(({ defaultValue }) => (
    <select data-testid="sort-select" defaultValue={defaultValue}>
      <option value="desc">Newest First</option>
      <option value="asc">Oldest First</option>
    </select>
  ))
}));

// Import after mocking
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SearchForm } from '../search-form'
import { useRouter } from 'next/navigation'

describe('SearchForm', () => {
  const mockPush = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  describe('Critical Functionality', () => {
    it('should render all form inputs with correct props', () => {
      render(<SearchForm perPage={6} q="test" tag="demo" from="2023-01-01" to="2023-01-31" sort="asc" />)
      
      expect(screen.getByTestId('sort-select')).toBeInTheDocument()
      expect(screen.getByDisplayValue('test')).toBeInTheDocument()
      expect(screen.getByDisplayValue('demo')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2023-01-31')).toBeInTheDocument()
      expect(screen.getByDisplayValue('6')).toBeInTheDocument()
    })

    it('should handle form submission with all values', () => {
      render(<SearchForm perPage={12} />)
      
      const form = screen.getByDisplayValue('12').closest('form')
      const titleInput = screen.getByPlaceholderText('Search by Title')
      const tagInput = screen.getByPlaceholderText('Tag')
      const fromInput = screen.getByLabelText('Start Date')
      const toInput = screen.getByLabelText('End Date')
      
      fireEvent.change(titleInput, { target: { value: 'test video' } })
      fireEvent.change(tagInput, { target: { value: 'tutorial' } })
      fireEvent.change(fromInput, { target: { value: '2023-01-01' } })
      fireEvent.change(toInput, { target: { value: '2023-01-31' } })
      fireEvent.submit(form!)
      
      expect(mockPush).toHaveBeenCalledWith('/?q=test+video&tag=tutorial&from=2023-01-01&to=2023-01-31&page=1&perPage=12')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty form submission gracefully', () => {
      render(<SearchForm perPage={6} />)
      
      const form = screen.getByDisplayValue('6').closest('form')
      fireEvent.submit(form!)
      
      expect(mockPush).toHaveBeenCalledWith('/?page=1&perPage=6')
    })

    it('should handle undefined props with defaults', () => {
      render(<SearchForm perPage={6} />)
      
      const sortSelect = screen.getByTestId('sort-select')
      expect(sortSelect).toHaveValue('desc')
      
      const titleInput = screen.getByPlaceholderText('Search by Title')
      expect(titleInput).toHaveValue('')
    })
  })

  describe('Form Behavior', () => {
    it('should reset page to 1 when submitting search', () => {
      render(<SearchForm perPage={6} />)
      
      const form = screen.getByDisplayValue('6').closest('form')
      const titleInput = screen.getByPlaceholderText('Search by Title')
      
      fireEvent.change(titleInput, { target: { value: 'test' } })
      fireEvent.submit(form!)
      
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=1'))
    })
  })
})
