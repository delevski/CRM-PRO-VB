import { test, expect } from '@playwright/test';
import { PageHelpers } from '../utils/page-helpers';

test.describe('Navigation', () => {
  let pageHelpers;

  test.beforeEach(async ({ page }) => {
    pageHelpers = new PageHelpers(page);
  });

  test('should navigate between all pages', async ({ page }) => {
    // Start at dashboard
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Check dashboard is active
    await expect(page.getByRole('link', { name: 'Dashboard' })).toHaveClass(/header__nav-link--active/);
    
    // Navigate to customers
    await page.click('a[href="/customers"]');
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/customers');
    await expect(page.getByRole('link', { name: 'Customers' })).toHaveClass(/header__nav-link--active/);
    
    // Navigate to contacts
    await page.click('a[href="/contacts"]');
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/contacts');
    await expect(page.getByRole('link', { name: 'Contacts' })).toHaveClass(/header__nav-link--active/);
    
    // Navigate to deals
    await page.click('a[href="/deals"]');
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/deals');
    await expect(page.getByRole('link', { name: 'Deals' })).toHaveClass(/header__nav-link--active/);
    
    // Navigate back to dashboard
    await page.click('a[href="/"]');
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Dashboard' })).toHaveClass(/header__nav-link--active/);
  });

  test('should maintain header across all pages', async ({ page }) => {
    const pages = ['/', '/customers', '/contacts', '/deals'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await pageHelpers.waitForPageLoad();
      
      // Check header elements are present
      await expect(page.getByText('CRM Pro')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Contacts' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Deals' })).toBeVisible();
    }
  });

  test('should handle browser back and forward navigation', async ({ page }) => {
    // Start at dashboard
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Navigate to customers
    await page.click('a[href="/customers"]');
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/customers');
    
    // Navigate to contacts
    await page.click('a[href="/contacts"]');
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/contacts');
    
    // Go back
    await page.goBack();
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/customers');
    
    // Go back again
    await page.goBack();
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/');
    
    // Go forward
    await page.goForward();
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/customers');
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Navigate directly to customers page
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/customers');
    await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
    
    // Navigate directly to contacts page
    await page.goto('/contacts');
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/contacts');
    await expect(page.getByText('Coming soon...')).toBeVisible();
    
    // Navigate directly to deals page
    await page.goto('/deals');
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/deals');
    await expect(page.getByText('Coming soon...')).toBeVisible();
  });

  test('should handle invalid routes gracefully', async ({ page }) => {
    // Navigate to non-existent route
    await page.goto('/non-existent-route');
    await pageHelpers.waitForPageLoad();
    
    // Should show 404 or redirect to home
    // This depends on your routing setup
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(?:|customers|contacts|deals)$/);
  });

  test('should maintain active state correctly', async ({ page }) => {
    // Test each page's active state
    const routes = [
      { path: '/', activeLink: 'Dashboard' },
      { path: '/customers', activeLink: 'Customers' },
      { path: '/contacts', activeLink: 'Contacts' },
      { path: '/deals', activeLink: 'Deals' }
    ];
    
    for (const route of routes) {
      await page.goto(route.path);
      await pageHelpers.waitForPageLoad();
      
      // Check that the correct link is active
      const activeLink = page.getByRole('link', { name: route.activeLink });
      await expect(activeLink).toHaveClass(/header__nav-link--active/);
      
      // Check that other links are not active
      const otherLinks = routes
        .filter(r => r.activeLink !== route.activeLink)
        .map(r => page.getByRole('link', { name: r.activeLink }));
      
      for (const link of otherLinks) {
        await expect(link).not.toHaveClass(/header__nav-link--active/);
      }
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to dashboard
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Check that logo is visible (text might be hidden on mobile)
    await expect(page.getByText('📊')).toBeVisible();
    
    // Check that navigation works on mobile
    await page.click('a[href="/customers"]');
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/customers');
    
    // Take screenshot for visual regression
    await pageHelpers.takeScreenshot('navigation-mobile');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Tab through navigation links
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Press Enter on focused link
    await page.keyboard.press('Enter');
    await pageHelpers.waitForPageLoad();
    
    // Should navigate to the focused page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(customers|contacts|deals)$/);
  });
});





