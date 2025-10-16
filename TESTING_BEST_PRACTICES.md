# Testing Best Practices

## Table of Contents
- [Testing Philosophy](#testing-philosophy)
- [Testing Pyramid](#testing-pyramid)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Test Organization](#test-organization)
- [Mocking and Stubbing](#mocking-and-stubbing)
- [Performance Testing](#performance-testing)
- [Accessibility Testing](#accessibility-testing)

## Testing Philosophy

### 1. Test-Driven Development (TDD)
```javascript
// ✅ Good: Write test first, then implementation
describe('calculateTotal', () => {
  it('should calculate total price including tax', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 1 }
    ];
    const taxRate = 0.1;
    
    const result = calculateTotal(items, taxRate);
    
    expect(result).toBe(27.5); // (10*2 + 5*1) * 1.1
  });
});

// Then implement the function
const calculateTotal = (items, taxRate) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return subtotal * (1 + taxRate);
};
```

### 2. Arrange-Act-Assert Pattern
```javascript
// ✅ Good: Clear test structure
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user data when user exists', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: userId, name: 'John Doe', email: 'john@example.com' };
      jest.spyOn(api, 'get').mockResolvedValue(expectedUser);
      
      // Act
      const result = await userService.getUserById(userId);
      
      // Assert
      expect(result).toEqual(expectedUser);
      expect(api.get).toHaveBeenCalledWith(`/users/${userId}`);
    });
  });
});
```

### 3. Test What Matters
```javascript
// ✅ Good: Test behavior, not implementation
describe('LoginForm', () => {
  it('should show error message when login fails', async () => {
    // Arrange
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    render(<LoginForm onLogin={mockLogin} />);
    
    // Act
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    // Assert
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});

// ❌ Bad: Testing implementation details
it('should call setState with error message', () => {
  const setStateSpy = jest.spyOn(React, 'useState');
  // Testing internal state changes instead of user-visible behavior
});
```

## Testing Pyramid

### 1. Unit Tests (70%)
```javascript
// ✅ Good: Unit test for utility function
describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
  
  it('should format negative numbers correctly', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });
  
  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
  
  it('should handle different currencies', () => {
    expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
  });
});
```

### 2. Integration Tests (20%)
```javascript
// ✅ Good: Integration test for component with API
describe('UserProfile Integration', () => {
  it('should load and display user data', async () => {
    // Mock API response
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg'
    };
    
    jest.spyOn(api, 'getUser').mockResolvedValue(mockUser);
    
    render(<UserProfile userId="123" />);
    
    // Wait for data to load
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByAltText("John Doe's avatar")).toHaveAttribute('src', mockUser.avatar);
  });
});
```

### 3. End-to-End Tests (10%)
```javascript
// ✅ Good: E2E test with Playwright
test('user can complete purchase flow', async ({ page }) => {
  // Navigate to product page
  await page.goto('/products/123');
  
  // Add to cart
  await page.click('[data-testid="add-to-cart"]');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  
  // Go to cart
  await page.click('[data-testid="cart-icon"]');
  await expect(page).toHaveURL('/cart');
  
  // Proceed to checkout
  await page.click('[data-testid="checkout-button"]');
  await expect(page).toHaveURL('/checkout');
  
  // Fill payment form
  await page.fill('[data-testid="card-number"]', '4111111111111111');
  await page.fill('[data-testid="expiry"]', '12/25');
  await page.fill('[data-testid="cvv"]', '123');
  
  // Complete purchase
  await page.click('[data-testid="place-order"]');
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

## Unit Testing

### 1. Component Testing with React Testing Library
```javascript
// ✅ Good: Testing user interactions
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();
    
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
  
  it('should show validation errors for invalid input', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={jest.fn()} />);
    
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

### 2. Custom Hook Testing
```javascript
// ✅ Good: Testing custom hooks
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });
  
  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    expect(result.current.count).toBe(10);
  });
  
  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });
});
```

### 3. Utility Function Testing
```javascript
// ✅ Good: Comprehensive utility testing
describe('validateEmail', () => {
  it('should return true for valid email addresses', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      '123@test.com'
    ];
    
    validEmails.forEach(email => {
      expect(validateEmail(email)).toBe(true);
    });
  });
  
  it('should return false for invalid email addresses', () => {
    const invalidEmails = [
      'invalid-email',
      '@example.com',
      'test@',
      'test..test@example.com',
      ''
    ];
    
    invalidEmails.forEach(email => {
      expect(validateEmail(email)).toBe(false);
    });
  });
  
  it('should handle edge cases', () => {
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
    expect(validateEmail(123)).toBe(false);
  });
});
```

## Integration Testing

### 1. API Integration Testing
```javascript
// ✅ Good: Testing API integration
describe('UserService Integration', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  it('should fetch user data from API', async () => {
    const mockUser = { id: '123', name: 'John Doe' };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser)
    });
    
    const userService = new UserService();
    const result = await userService.getUser('123');
    
    expect(result).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith('/api/users/123');
  });
  
  it('should handle API errors gracefully', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
    
    const userService = new UserService();
    
    await expect(userService.getUser('123')).rejects.toThrow('Network error');
  });
});
```

### 2. Component Integration Testing
```javascript
// ✅ Good: Testing component with context
describe('ThemeProvider Integration', () => {
  it('should provide theme context to children', () => {
    const TestComponent = () => {
      const { theme, toggleTheme } = useTheme();
      return (
        <div>
          <span data-testid="current-theme">{theme}</span>
          <button onClick={toggleTheme}>Toggle Theme</button>
        </div>
      );
    };
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });
});
```

## End-to-End Testing

### 1. Playwright E2E Tests
```javascript
// ✅ Good: E2E test with Playwright
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('should complete user registration successfully', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('[data-testid="first-name"]', 'John');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.fill('[data-testid="email"]', 'john.doe@example.com');
    await page.fill('[data-testid="password"]', 'SecurePassword123!');
    await page.fill('[data-testid="confirm-password"]', 'SecurePassword123!');
    
    // Submit form
    await page.click('[data-testid="register-button"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/register');
    
    // Submit empty form
    await page.click('[data-testid="register-button"]');
    
    // Verify validation errors
    await expect(page.locator('[data-testid="first-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
  });
});
```

### 2. Visual Regression Testing
```javascript
// ✅ Good: Visual regression test
test('should match visual snapshot', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Wait for content to load
  await page.waitForSelector('[data-testid="dashboard-content"]');
  
  // Take screenshot
  await expect(page).toHaveScreenshot('dashboard.png');
});
```

## Test Organization

### 1. File Structure
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.test.js
│   │   └── Button.stories.js
│   └── UserProfile/
│       ├── UserProfile.jsx
│       ├── UserProfile.test.js
│       └── UserProfile.stories.js
├── hooks/
│   ├── useCounter.js
│   └── useCounter.test.js
├── utils/
│   ├── helpers.js
│   └── helpers.test.js
└── __tests__/
    ├── setup.js
    ├── integration/
    │   └── user-flow.test.js
    └── e2e/
        └── checkout-flow.test.js
```

### 2. Test Setup and Configuration
```javascript
// ✅ Good: Jest setup file
// src/__tests__/setup.js
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
};
```

### 3. Test Utilities
```javascript
// ✅ Good: Custom test utilities
// src/__tests__/utils/test-utils.js
import { render } from '@testing-library/react';
import { ThemeProvider } from '../components/ThemeProvider';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## Mocking and Stubbing

### 1. API Mocking with MSW
```javascript
// ✅ Good: API mocking with MSW
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        id,
        name: 'John Doe',
        email: 'john@example.com'
      })
    );
  }),
  
  rest.post('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '123',
        ...req.body
      })
    );
  }),
  
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ])
    );
  })
);

export { server };
```

### 2. Component Mocking
```javascript
// ✅ Good: Mocking external components
jest.mock('../components/ExpensiveComponent', () => {
  return function MockExpensiveComponent({ children }) {
    return <div data-testid="mock-expensive">{children}</div>;
  };
});

jest.mock('../services/api', () => ({
  fetchUserData: jest.fn(),
  updateUserData: jest.fn()
}));
```

### 3. Browser API Mocking
```javascript
// ✅ Good: Mocking browser APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});
```

## Performance Testing

### 1. Component Performance Testing
```javascript
// ✅ Good: Testing component performance
import { render } from '@testing-library/react';
import { UserList } from '../UserList';

describe('UserList Performance', () => {
  it('should render large lists efficiently', () => {
    const largeUserList = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`
    }));
    
    const startTime = performance.now();
    render(<UserList users={largeUserList} />);
    const endTime = performance.now();
    
    // Should render within reasonable time (adjust threshold as needed)
    expect(endTime - startTime).toBeLessThan(100);
  });
});
```

### 2. Bundle Size Testing
```javascript
// ✅ Good: Bundle size testing
import { getBundleSize } from '../utils/bundle-analyzer';

describe('Bundle Size', () => {
  it('should not exceed size limits', async () => {
    const bundleSize = await getBundleSize();
    
    expect(bundleSize.main).toBeLessThan(500000); // 500KB
    expect(bundleSize.vendor).toBeLessThan(1000000); // 1MB
  });
});
```

## Accessibility Testing

### 1. Automated Accessibility Testing
```javascript
// ✅ Good: Accessibility testing with jest-axe
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LoginForm } from '../LoginForm';

expect.extend(toHaveNoViolations);

describe('LoginForm Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<LoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have proper form labels', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
  
  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    await user.tab();
    expect(screen.getByLabelText(/email/i)).toHaveFocus();
    
    await user.tab();
    expect(screen.getByLabelText(/password/i)).toHaveFocus();
    
    await user.tab();
    expect(screen.getByRole('button', { name: /login/i })).toHaveFocus();
  });
});
```

### 2. Manual Accessibility Testing Checklist
```markdown
## Accessibility Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements are reachable via keyboard
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are visible
- [ ] No keyboard traps

### Screen Reader Support
- [ ] All images have alt text
- [ ] Form labels are properly associated
- [ ] Headings are properly structured
- [ ] ARIA labels are used appropriately

### Visual Accessibility
- [ ] Color contrast meets WCAG standards
- [ ] Text is readable at 200% zoom
- [ ] No information conveyed by color alone
- [ ] Focus indicators are visible

### Content Accessibility
- [ ] Language is clear and simple
- [ ] Error messages are descriptive
- [ ] Instructions are provided for complex interactions
- [ ] Content is organized logically
```

## Testing Best Practices Summary

### 1. Write Tests Early and Often
- Start with failing tests (TDD)
- Test behavior, not implementation
- Keep tests simple and focused

### 2. Maintain Test Quality
- Use descriptive test names
- Follow AAA pattern (Arrange-Act-Assert)
- Keep tests independent and isolated
- Clean up after tests

### 3. Choose the Right Test Type
- Unit tests for individual functions/components
- Integration tests for component interactions
- E2E tests for critical user flows

### 4. Mock Appropriately
- Mock external dependencies
- Don't over-mock
- Use realistic test data

### 5. Maintain Test Coverage
- Aim for meaningful coverage, not just high percentages
- Focus on critical paths and edge cases
- Regularly review and update tests

This comprehensive testing guide will help you build reliable, maintainable React applications with confidence.
