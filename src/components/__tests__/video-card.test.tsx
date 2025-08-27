// Mock dependencies before imports
jest.mock('next/image', () => ({
  __esModule: true,
  default: jest.fn(({ src, alt, onLoad, onError, fill, sizes, ...props }) => (
    <img
      src={src}
      alt={alt}
      onLoad={onLoad}
      onError={onError}
      {...props}
      data-testid="next-image"
    />
  ))
}));

jest.mock('@/lib/constants', () => ({
  PLACEHOLDER_URL: 'https://example.com/placeholder.jpg'
}));

// Import after mocking
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { VideoCard } from '../video-card'

describe('VideoCard', () => {
  const defaultProps = {
    title: 'Test Video Title',
    thumbnail_url: 'https://example.com/thumbnail.jpg',
    created_at: '2023-01-15T10:30:00Z',
    tags: ['tutorial', 'react']
  }

  describe('Critical Functionality', () => {
    it('should render video information correctly', () => {
      render(<VideoCard {...defaultProps} />)
      
      expect(screen.getByText('Test Video Title')).toBeInTheDocument()
      expect(screen.getByText('Created: 2023-01-15')).toBeInTheDocument()
      expect(screen.getByText('tutorial')).toBeInTheDocument()
      expect(screen.getByText('react')).toBeInTheDocument()
      expect(screen.getByTestId('next-image')).toHaveAttribute('src', 'https://example.com/thumbnail.jpg')
    })

    it('should handle image load events', () => {
      render(<VideoCard {...defaultProps} />)
      
      const image = screen.getByTestId('next-image')
      fireEvent.load(image)
      
      // The image should be visible after loading
      expect(image).toHaveClass('opacity-100')
    })
  })

  describe('Edge Cases', () => {
    it('should handle image error gracefully', () => {
      render(<VideoCard {...defaultProps} />)
      
      const image = screen.getByTestId('next-image')
      fireEvent.error(image)
      
      // Should fallback to placeholder URL
      expect(image).toHaveAttribute('src', 'https://example.com/placeholder.jpg')
    })

    it('should handle empty tags array', () => {
      render(<VideoCard {...defaultProps} tags={[]} />)
      
      expect(screen.queryByText('tutorial')).not.toBeInTheDocument()
      expect(screen.queryByText('react')).not.toBeInTheDocument()
    })

    it('should handle undefined tags gracefully', () => {
      render(<VideoCard {...defaultProps} tags={undefined as string[] | undefined} />)
      
      expect(screen.queryByText('tutorial')).not.toBeInTheDocument()
      expect(screen.queryByText('react')).not.toBeInTheDocument()
    })
  })
})
