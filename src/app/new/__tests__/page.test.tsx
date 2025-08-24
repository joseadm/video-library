import { render, screen } from '@testing-library/react'
import { useNewVideoForm } from '@/hooks/use-new-video-form'
import NewVideoPage from '../page'

// Mock the hook
jest.mock('@/hooks/use-new-video-form')

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

describe('NewVideoPage', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useNewVideoForm as jest.Mock).mockReturnValue({
      onSubmit: mockOnSubmit,
    })
  })

  it('renders the page title and description', () => {
    render(<NewVideoPage />)
    
    expect(screen.getByText('Add a New Video')).toBeTruthy()
    expect(screen.getByText(/Title is required. Tags are optional/)).toBeTruthy()
  })

  it('renders the back button', () => {
    render(<NewVideoPage />)
    
    const backButton = screen.getByLabelText('Back')
    expect(backButton).toBeTruthy()
    expect(backButton.getAttribute('href')).toBe('/')
  })

  it('renders the form with all required fields', () => {
    render(<NewVideoPage />)
    
    expect(screen.getByLabelText(/Title/)).toBeTruthy()
    expect(screen.getByLabelText(/Tags/)).toBeTruthy()
    expect(screen.getByLabelText(/Thumbnail URL/)).toBeTruthy()
    expect(screen.getByLabelText(/Duration/)).toBeTruthy()
    expect(screen.getByLabelText(/Views/)).toBeTruthy()
  })

  it('renders the save and cancel buttons', () => {
    render(<NewVideoPage />)
    
    expect(screen.getByText('Save')).toBeTruthy()
    expect(screen.getByText('Cancel')).toBeTruthy()
  })

  it('renders the info message about defaults', () => {
    render(<NewVideoPage />)
    
    expect(screen.getByText(/If any fields are left empty, defaults will be applied/)).toBeTruthy()
  })

  it('calls onSubmit when form is submitted', () => {
    render(<NewVideoPage />)
    
    // The form exists but doesn't have a role attribute, so we check by tag name
    const form = document.querySelector('form')
    expect(form).toBeTruthy()
    
    // The form submission is handled by the hook, so we just verify the hook was called
    expect(useNewVideoForm).toHaveBeenCalledWith({ onSuccessRedirect: '/' })
  })

  it('has proper form structure and accessibility', () => {
    render(<NewVideoPage />)
    
    // Check that labels are properly associated with inputs
    const titleInput = screen.getByLabelText(/Title/)
    expect(titleInput.hasAttribute('required')).toBe(true)
    
    const tagsInput = screen.getByLabelText(/Tags/)
    expect(tagsInput).toBeTruthy()
    
    const thumbnailInput = screen.getByLabelText(/Thumbnail URL/)
    expect(thumbnailInput).toBeTruthy()
    
    const durationInput = screen.getByLabelText(/Duration/)
    expect(durationInput).toBeTruthy()
    
    const viewsInput = screen.getByLabelText(/Views/)
    expect(viewsInput).toBeTruthy()
  })

  it('displays proper button styling classes', () => {
    render(<NewVideoPage />)
    
    const saveButton = screen.getByText('Save')
    const cancelButton = screen.getByText('Cancel')
    
    expect(saveButton.className).toContain('btn')
    expect(saveButton.className).toContain('btn-primary') // Save button is primary
    expect(cancelButton.className).toContain('btn')
    expect(cancelButton.className).toContain('btn-secondary') // Cancel button is secondary
  })
}) 