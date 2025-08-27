// Import directly since no external dependencies to mock
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RetryNotice } from '../retry-notice'

describe('RetryNotice', () => {
  describe('Critical Functionality', () => {
    it('should render error message and retry button', () => {
      render(<RetryNotice message="Failed to load videos" />)
      
      expect(screen.getByText('There was an error')).toBeInTheDocument()
      expect(screen.getByText('Failed to load videos')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    })

    it('should render with different error message', () => {
      render(<RetryNotice message="Network error" />)
      
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty message gracefully', () => {
      render(<RetryNotice message="" />)
      
      expect(screen.getByText('There was an error')).toBeInTheDocument()
      // Check that the message paragraph exists but has no text content
      const messageElement = screen.getByText('There was an error').closest('div')?.querySelector('p')
      expect(messageElement).toBeInTheDocument()
      expect(messageElement).toHaveTextContent('')
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    })

    it('should handle long error messages', () => {
      const longMessage = 'This is a very long error message that might contain a lot of technical details about what went wrong during the video loading process'
      render(<RetryNotice message={longMessage} />)
      
      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('should have correct button attributes', () => {
      render(<RetryNotice message="Test message" />)
      
      const button = screen.getByRole('button', { name: 'Retry' })
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveAttribute('aria-label', 'Retry')
    })

    it('should have proper heading structure', () => {
      render(<RetryNotice message="Test message" />)
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('There was an error')
    })
  })
})
