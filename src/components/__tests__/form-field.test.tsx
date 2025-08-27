// Import directly since no external dependencies to mock
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { FormField } from '../form-field'

describe('FormField', () => {
  describe('Critical Functionality', () => {
    it('should render form field with label and input', () => {
      render(
        <FormField>
          <FormField.Label>Email</FormField.Label>
          <FormField.Control type="email" placeholder="Enter email" />
        </FormField>
      )
      
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    })

    it('should render required field with asterisk', () => {
      render(
        <FormField>
          <FormField.Label required>Password</FormField.Label>
          <FormField.Control type="password" />
        </FormField>
      )
      
      expect(screen.getByText('Password')).toBeInTheDocument()
      expect(screen.getByText('*')).toHaveClass('text-red-500')
    })
  })

  describe('Edge Cases', () => {
    it('should handle textarea variant correctly', () => {
      render(
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control as="textarea" placeholder="Enter description" />
        </FormField>
      )
      
      const textarea = screen.getByRole('textbox')
      expect(textarea.tagName).toBe('TEXTAREA')
      expect(textarea).toHaveAttribute('placeholder', 'Enter description')
    })

    it('should handle optional message display', () => {
      const { rerender } = render(
        <FormField>
          <FormField.Label>Username</FormField.Label>
          <FormField.Control />
          <FormField.Message>Username must be at least 3 characters</FormField.Message>
        </FormField>
      )
      
      expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument()
      
      // Re-render without message
      rerender(
        <FormField>
          <FormField.Label>Username</FormField.Label>
          <FormField.Control />
        </FormField>
      )
      
      expect(screen.queryByText('Username must be at least 3 characters')).not.toBeInTheDocument()
    })
  })

  describe('Styling and Classes', () => {
    it('should apply custom className to root element', () => {
      render(
        <FormField className="custom-class">
          <FormField.Label>Test</FormField.Label>
          <FormField.Control />
        </FormField>
      )
      
      const label = screen.getByText('Test').closest('label')
      expect(label).toHaveClass('custom-class')
    })

    it('should apply custom className to control element', () => {
      render(
        <FormField>
          <FormField.Label>Test</FormField.Label>
          <FormField.Control className="custom-input-class" />
        </FormField>
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-input-class')
    })
  })
})
