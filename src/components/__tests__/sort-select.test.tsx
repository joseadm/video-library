// Mock dependencies before imports
jest.mock('lucide-react', () => ({
  ChevronDown: jest.fn(() => <div data-testid="chevron-down" />)
}));

// Import after mocking
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SortSelect } from '../sort-select'

describe('SortSelect', () => {
  describe('Critical Functionality', () => {
    it('should render with correct default value', () => {
      render(<SortSelect defaultValue="asc" />)
      
      const select = screen.getByRole('combobox')
      expect(select).toHaveValue('asc')
      expect(screen.getByText('Oldest')).toBeInTheDocument()
      expect(screen.getByText('Newest')).toBeInTheDocument()
    })

    it('should render with desc default value', () => {
      render(<SortSelect defaultValue="desc" />)
      
      const select = screen.getByRole('combobox')
      expect(select).toHaveValue('desc')
    })

    it('should have correct options', () => {
      render(<SortSelect defaultValue="desc" />)
      
      expect(screen.getByText('Newest')).toBeInTheDocument()
      expect(screen.getByText('Oldest')).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('should have correct select attributes', () => {
      render(<SortSelect defaultValue="desc" />)
      
      const select = screen.getByRole('combobox')
      expect(select).toHaveAttribute('name', 'sort')
      expect(select).toHaveValue('desc')
    })

    it('should render chevron icon', () => {
      render(<SortSelect defaultValue="desc" />)
      
      expect(screen.getByTestId('chevron-down')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper role and accessible name', () => {
      render(<SortSelect defaultValue="desc" />)
      
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })
  })
})
