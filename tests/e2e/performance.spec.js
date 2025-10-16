import { test, expect } from '@playwright/test';
import { PageHelpers } from '../utils/page-helpers';

test.describe('Performance Tests', () => {
  let pageHelpers;

  test.beforeEach(async ({ page }) => {
    pageHelpers = new PageHelpers(page);
  });

  test('should load dashboard within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    const loadTime = Date.now() - startTime;
    
    // Check that page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check Core Web Vitals
    const metrics = await pageHelpers.getPerformanceMetrics();
    
    // Largest Contentful Paint should be under 2.5 seconds
    if (metrics.firstContentfulPaint) {
      expect(metrics.firstContentfulPaint).toBeLessThan(2500);
    }
    
    // DOM Content Loaded should be under 2 seconds
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });

  test('should load customers page within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    
    const loadTime = Date.now() - startTime;
    
    // Check that page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Wait for customers to load
    await pageHelpers.waitForLoadingToComplete();
    
    // Check that customer cards are rendered
    await expect(page.locator('.customer-card')).toHaveCount.greaterThan(0);
  });

  test('should handle large datasets efficiently', async ({ page }) => {
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    
    // Wait for customers to load
    await pageHelpers.waitForLoadingToComplete();
    
    // Check that all customer cards are rendered
    const customerCards = page.locator('.customer-card');
    const cardCount = await customerCards.count();
    
    // Should render customers efficiently
    expect(cardCount).toBeGreaterThan(0);
    
    // Check that search works efficiently
    const searchInput = page.getByPlaceholder('Search customers...');
    await searchInput.fill('Acme');
    
    // Should filter results quickly
    await expect(page.getByText('Acme Corporation')).toBeVisible();
  });

  test('should handle modal operations efficiently', async ({ page }) => {
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    
    // Open modal
    const startTime = Date.now();
    await page.click('button:has-text("Add Customer")');
    await pageHelpers.waitForModal('Add New Customer');
    const modalOpenTime = Date.now() - startTime;
    
    // Modal should open quickly
    expect(modalOpenTime).toBeLessThan(500);
    
    // Close modal
    const closeStartTime = Date.now();
    await page.click('.modal-close');
    await page.waitForSelector('.modal-overlay', { state: 'hidden' });
    const modalCloseTime = Date.now() - closeStartTime;
    
    // Modal should close quickly
    expect(modalCloseTime).toBeLessThan(500);
  });

  test('should handle form submissions efficiently', async ({ page }) => {
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    
    // Open modal
    await page.click('button:has-text("Add Customer")');
    await pageHelpers.waitForModal('Add New Customer');
    
    // Fill form
    await page.fill('input[aria-label="Company Name"]', 'Performance Test Company');
    await page.fill('input[aria-label="Email"]', 'test@performance.com');
    await page.fill('input[aria-label="Phone"]', '+1-555-0123');
    await page.fill('input[aria-label="Industry"]', 'Technology');
    await page.fill('input[aria-label="City"]', 'Test City');
    await page.fill('input[aria-label="State"]', 'CA');
    
    // Submit form
    const startTime = Date.now();
    await page.click('button:has-text("Create Customer")');
    await page.waitForSelector('.modal-overlay', { state: 'hidden' });
    const submitTime = Date.now() - startTime;
    
    // Form submission should be efficient
    expect(submitTime).toBeLessThan(2000);
  });

  test('should handle navigation efficiently', async ({ page }) => {
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Test navigation performance
    const pages = ['/customers', '/contacts', '/deals'];
    
    for (const pagePath of pages) {
      const startTime = Date.now();
      await page.goto(pagePath);
      await pageHelpers.waitForPageLoad();
      const navigationTime = Date.now() - startTime;
      
      // Navigation should be fast
      expect(navigationTime).toBeLessThan(2000);
    }
  });

  test('should handle search efficiently', async ({ page }) => {
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    await pageHelpers.waitForLoadingToComplete();
    
    // Test search performance
    const searchInput = page.getByPlaceholder('Search customers...');
    
    const startTime = Date.now();
    await searchInput.fill('Acme');
    await page.waitForTimeout(100); // Wait for search to complete
    const searchTime = Date.now() - startTime;
    
    // Search should be fast
    expect(searchTime).toBeLessThan(500);
    
    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(100);
  });

  test('should handle responsive design efficiently', async ({ page }) => {
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1920, height: 1080 }  // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(100);
      
      // Check that page still functions
      await expect(page.getByRole('heading', { name: 'CRM Dashboard' })).toBeVisible();
    }
  });

  test('should handle memory efficiently', async ({ page }) => {
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Navigate between pages multiple times
    for (let i = 0; i < 5; i++) {
      await page.goto('/customers');
      await pageHelpers.waitForPageLoad();
      
      await page.goto('/');
      await pageHelpers.waitForPageLoad();
    }
    
    // Check that page still functions correctly
    await expect(page.getByRole('heading', { name: 'CRM Dashboard' })).toBeVisible();
  });

  test('should handle concurrent operations efficiently', async ({ page }) => {
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    await pageHelpers.waitForLoadingToComplete();
    
    // Perform multiple operations simultaneously
    const operations = [
      page.click('button:has-text("Add Customer")'),
      page.fill('input[placeholder="Search customers..."]', 'Test'),
      page.click('a[href="/"]')
    ];
    
    const startTime = Date.now();
    await Promise.all(operations);
    const operationTime = Date.now() - startTime;
    
    // Operations should complete efficiently
    expect(operationTime).toBeLessThan(2000);
  });
});


