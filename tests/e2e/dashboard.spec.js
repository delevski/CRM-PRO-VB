import { test, expect } from '@playwright/test';
import { PageHelpers } from '../utils/page-helpers';

test.describe('CRM Dashboard', () => {
  let pageHelpers;

  test.beforeEach(async ({ page }) => {
    pageHelpers = new PageHelpers(page);
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
  });

  test('should display dashboard with correct title and stats', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/CRM/);
    
    // Check main heading
    await expect(page.getByRole('heading', { name: 'CRM Dashboard' })).toBeVisible();
    
    // Check welcome message
    await expect(page.getByText('Welcome to your customer relationship management system')).toBeVisible();
    
    // Check stats cards are present
    await expect(page.getByText('Total Customers')).toBeVisible();
    await expect(page.getByText('Total Contacts')).toBeVisible();
    await expect(page.getByText('Active Deals')).toBeVisible();
    await expect(page.getByText('Deal Value')).toBeVisible();
  });

  test('should display conversion rate and pipeline health', async ({ page }) => {
    // Check conversion rate section
    await expect(page.getByText('Conversion Rate')).toBeVisible();
    
    // Check pipeline health section
    await expect(page.getByText('Pipeline Health')).toBeVisible();
    
    // Check pipeline stages
    await expect(page.getByText('Prospecting')).toBeVisible();
    await expect(page.getByText('Active')).toBeVisible();
    await expect(page.getByText('Won')).toBeVisible();
  });

  test('should display quick actions', async ({ page }) => {
    // Check quick actions section
    await expect(page.getByText('Quick Actions')).toBeVisible();
    
    // Check action buttons
    await expect(page.getByRole('button', { name: /Add Customer/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Contact/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Create Deal/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /View Reports/i })).toBeVisible();
  });

  test('should have proper accessibility features', async ({ page }) => {
    const accessibility = await pageHelpers.checkAccessibility();
    
    // Check that all inputs have labels
    expect(accessibility.allInputsHaveLabels).toBe(true);
    
    // Check heading structure
    expect(accessibility.headings.length).toBeGreaterThan(0);
  });

  test('should meet performance requirements', async ({ page }) => {
    const metrics = await pageHelpers.getPerformanceMetrics();
    
    // Check that page loads within acceptable time
    expect(metrics.loadTime).toBeLessThan(3000); // 3 seconds
    expect(metrics.domContentLoaded).toBeLessThan(2000); // 2 seconds
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that dashboard elements are still visible
    await expect(page.getByRole('heading', { name: 'CRM Dashboard' })).toBeVisible();
    await expect(page.getByText('Total Customers')).toBeVisible();
    
    // Take screenshot for visual regression testing
    await pageHelpers.takeScreenshot('dashboard-mobile');
  });

  test('should handle navigation correctly', async ({ page }) => {
    // Test navigation to customers page
    await page.click('a[href="/customers"]');
    await pageHelpers.waitForPageLoad();
    
    // Should be on customers page
    await expect(page).toHaveURL('/customers');
    await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
    
    // Navigate back to dashboard
    await page.click('a[href="/"]');
    await pageHelpers.waitForPageLoad();
    
    // Should be back on dashboard
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'CRM Dashboard' })).toBeVisible();
  });
});





