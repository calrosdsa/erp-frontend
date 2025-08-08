# Testing Requirements

Based on your Vitest + React Testing Library setup, here are the testing patterns for your Remix ERP application:

### Component Test Template

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { CustomerForm } from '@/components/custom/customer-form'
import type { Customer } from '~/sdk/types'

// Mock dependencies
vi.mock('~/apiclient', () => ({
  customerService: {
    createCustomer: vi.fn(),
    updateCustomer: vi.fn(),
  },
}))

vi.mock('@remix-run/react', () => ({
  useNavigate: () => vi.fn(),
  useNavigation: () => ({ state: 'idle' }),
}))

// Test utilities
const mockCustomer: Customer = {
  id: '1',
  name: 'Test Customer',
  email: 'test@example.com',
  phone: '+1234567890',
  address: '123 Main St',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

describe('CustomerForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Create mode', () => {
    it('renders form fields correctly', () => {
      render(<CustomerForm mode="create" />)
      
      expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create customer/i })).toBeInTheDocument()
    })

    it('validates required fields', async () => {
      const user = userEvent.setup()
      render(<CustomerForm mode="create" />)
      
      const submitButton = screen.getByRole('button', { name: /create customer/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/customer name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      })
    })

    it('validates email format', async () => {
      const user = userEvent.setup()
      render(<CustomerForm mode="create" />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'invalid-email')
      
      const submitButton = screen.getByRole('button', { name: /create customer/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
      })
    })

    it('submits form with valid data', async () => {
      const user = userEvent.setup()
      const mockCreate = vi.mocked(customerService.createCustomer)
      mockCreate.mockResolvedValue(mockCustomer)
      
      render(<CustomerForm mode="create" />)
      
      await user.type(screen.getByLabelText(/customer name/i), 'Test Customer')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/phone/i), '+1234567890')
      await user.type(screen.getByLabelText(/address/i), '123 Main St')
      
      const submitButton = screen.getByRole('button', { name: /create customer/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith({
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '+1234567890',
          address: '123 Main St',
        })
      })
    })
  })

  describe('Edit mode', () => {
    it('populates form with existing data', () => {
      render(<CustomerForm mode="edit" customer={mockCustomer} />)
      
      expect(screen.getByDisplayValue('Test Customer')).toBeInTheDocument()
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument()
      expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument()
    })

    it('submits updated data', async () => {
      const user = userEvent.setup()
      const mockUpdate = vi.mocked(customerService.updateCustomer)
      mockUpdate.mockResolvedValue({ ...mockCustomer, name: 'Updated Customer' })
      
      render(<CustomerForm mode="edit" customer={mockCustomer} />)
      
      const nameInput = screen.getByDisplayValue('Test Customer')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Customer')
      
      const submitButton = screen.getByRole('button', { name: /update customer/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith('1', {
          name: 'Updated Customer',
          email: 'test@example.com',
          phone: '+1234567890',
          address: '123 Main St',
        })
      })
    })
  })

  describe('Loading states', () => {
    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      const mockCreate = vi.mocked(customerService.createCustomer)
      mockCreate.mockImplementation(() => new Promise(() => {})) // Never resolves
      
      render(<CustomerForm mode="create" />)
      
      await user.type(screen.getByLabelText(/customer name/i), 'Test Customer')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      
      const submitButton = screen.getByRole('button', { name: /create customer/i })
      await user.click(submitButton)
      
      expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
    })
  })

  describe('Error handling', () => {
    it('displays error message on API failure', async () => {
      const user = userEvent.setup()
      const mockCreate = vi.mocked(customerService.createCustomer)
      mockCreate.mockRejectedValue(new Error('Failed to create customer'))
      
      render(<CustomerForm mode="create" />)
      
      await user.type(screen.getByLabelText(/customer name/i), 'Test Customer')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      
      const submitButton = screen.getByRole('button', { name: /create customer/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/failed to create customer/i)).toBeInTheDocument()
      })
    })
  })
})
```

### Testing Best Practices

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test critical user flows (using Cypress/Playwright)
4. **Coverage Goals**: Aim for 80% code coverage
5. **Test Structure**: Arrange-Act-Assert pattern
6. **Mock External Dependencies**: API calls, routing, state management
