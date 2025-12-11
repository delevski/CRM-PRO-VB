# Playwright E2E Tests

This directory contains comprehensive end-to-end tests for the CRM application using Playwright.

## Test Structure

```
tests/
├── e2e/                    # End-to-end test files
│   ├── dashboard.spec.js   # Dashboard functionality tests
│   ├── customers.spec.js   # Customer management tests
│   ├── navigation.spec.js  # Navigation and routing tests
│   ├── accessibility.spec.js # Accessibility tests
│   └── performance.spec.js # Performance tests
├── fixtures/               # Test data fixtures
│   └── test-data.js        # Sample data for tests
├── utils/                  # Test utilities
│   └── page-helpers.js     # Helper functions for tests
└── README.md              # This file
```

## Running Tests

### Basic Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests step by step
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Specific Test Suites

```bash
# Run only dashboard tests
npx playwright test dashboard

# Run only customer tests
npx playwright test customers

# Run only accessibility tests
npx playwright test accessibility

# Run only performance tests
npx playwright test performance
```

### Browser-Specific Tests

```bash
# Run tests on specific browsers
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests on mobile devices
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Test Categories

### 1. Dashboard Tests (`dashboard.spec.js`)
- ✅ Page load and title verification
- ✅ Statistics display
- ✅ Quick actions functionality
- ✅ Responsive design
- ✅ Performance metrics
- ✅ Navigation integration

### 2. Customer Management Tests (`customers.spec.js`)
- ✅ Customer list display
- ✅ Add customer functionality
- ✅ Edit customer functionality
- ✅ Delete customer functionality
- ✅ Search functionality
- ✅ Form validation
- ✅ Modal interactions
- ✅ Keyboard navigation
- ✅ Accessibility compliance

### 3. Navigation Tests (`navigation.spec.js`)
- ✅ Page routing
- ✅ Active state management
- ✅ Browser back/forward navigation
- ✅ Direct URL navigation
- ✅ Mobile responsiveness
- ✅ Keyboard navigation

### 4. Accessibility Tests (`accessibility.spec.js`)
- ✅ Heading structure
- ✅ Form labels
- ✅ Button roles and labels
- ✅ Link roles and labels
- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Error handling
- ✅ Focus management
- ✅ Color contrast
- ✅ Screen reader compatibility
- ✅ Reduced motion preferences

### 5. Performance Tests (`performance.spec.js`)
- ✅ Page load times
- ✅ Core Web Vitals
- ✅ Large dataset handling
- ✅ Modal operations
- ✅ Form submissions
- ✅ Navigation performance
- ✅ Search performance
- ✅ Responsive design performance
- ✅ Memory efficiency
- ✅ Concurrent operations

## Test Data

The `fixtures/test-data.js` file contains:
- Sample customer data
- Sample contact data
- Sample deal data
- Invalid data for validation testing

## Page Helpers

The `utils/page-helpers.js` file provides utility functions:
- Page load waiting
- Screenshot capture
- Form field filling
- Button clicking
- Modal handling
- Loading state management
- Accessibility checking
- Performance metrics collection

## Configuration

The `playwright.config.js` file configures:
- Test directory
- Parallel execution
- Retry logic
- Reporters (HTML, JSON, JUnit)
- Browser projects
- Base URL
- Trace collection
- Screenshot and video capture
- Development server integration

## Best Practices Implemented

### 1. Test Organization
- ✅ Clear test structure and naming
- ✅ Separation of concerns
- ✅ Reusable test utilities
- ✅ Consistent test data

### 2. Test Reliability
- ✅ Proper waiting strategies
- ✅ Retry mechanisms
- ✅ Cross-browser testing
- ✅ Mobile device testing

### 3. Test Maintainability
- ✅ Page Object Model pattern
- ✅ Helper functions
- ✅ Test data fixtures
- ✅ Clear test descriptions

### 4. Test Coverage
- ✅ Functional testing
- ✅ UI testing
- ✅ Accessibility testing
- ✅ Performance testing
- ✅ Cross-browser testing
- ✅ Mobile testing

### 5. Test Reporting
- ✅ HTML reports
- ✅ JSON results
- ✅ JUnit XML
- ✅ Screenshots on failure
- ✅ Video recording on failure
- ✅ Trace collection

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```bash
# CI-specific commands
npx playwright test --reporter=github
npx playwright test --reporter=junit
npx playwright test --reporter=json
```

## Debugging Tests

### 1. Debug Mode
```bash
npm run test:e2e:debug
```

### 2. Headed Mode
```bash
npm run test:e2e:headed
```

### 3. UI Mode
```bash
npm run test:e2e:ui
```

### 4. Screenshots
Screenshots are automatically captured on test failures and saved to `test-results/screenshots/`.

### 5. Videos
Videos are recorded for failed tests and saved to `test-results/`.

### 6. Traces
Traces are collected for failed tests and can be viewed with:
```bash
npx playwright show-trace test-results/trace.zip
```

## Performance Budgets

The tests enforce the following performance budgets:
- Page load time: < 3 seconds
- DOM Content Loaded: < 2 seconds
- First Contentful Paint: < 2.5 seconds
- Modal open/close: < 500ms
- Form submission: < 2 seconds
- Navigation: < 2 seconds
- Search: < 500ms

## Accessibility Standards

Tests verify compliance with:
- WCAG 2.1 AA standards
- Proper heading structure
- Form label associations
- Button and link roles
- Keyboard navigation
- ARIA attributes
- Focus management
- Color contrast
- Screen reader compatibility

## Browser Support

Tests run on:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Test Results

After running tests, you can view results at:
- HTML Report: `test-results/index.html`
- JSON Results: `test-results/results.json`
- JUnit XML: `test-results/results.xml`
- Screenshots: `test-results/screenshots/`
- Videos: `test-results/`

## Troubleshooting

### Common Issues

1. **Tests failing due to timing**
   - Use proper waiting strategies
   - Check for loading states
   - Verify element visibility

2. **Cross-browser differences**
   - Test on multiple browsers
   - Use browser-specific selectors when needed
   - Check for browser-specific behaviors

3. **Mobile test failures**
   - Verify responsive design
   - Check touch interactions
   - Test different viewport sizes

4. **Performance test failures**
   - Check network conditions
   - Verify test environment
   - Consider CI/CD performance variations

### Getting Help

- Check Playwright documentation: https://playwright.dev/
- Review test logs and screenshots
- Use debug mode for step-by-step debugging
- Check browser developer tools for issues





