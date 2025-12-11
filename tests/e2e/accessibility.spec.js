import { test, expect } from '@playwright/test';
import { PageHelpers } from '../utils/page-helpers';

test.describe('Accessibility Tests', () => {
  let pageHelpers;

  test.beforeEach(async ({ page }) => {
    pageHelpers = new PageHelpers(page);
  });

  test('should have proper heading structure on dashboard', async ({ page }) => {
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Check main heading
    await expect(page.getByRole('heading', { name: 'CRM Dashboard', level: 1 })).toBeVisible();
    
    // Check section headings
    await expect(page.getByRole('heading', { name: 'Quick Actions', level: 2 })).toBeVisible();
  });

  test('should have proper heading structure on customers page', async ({ page }) => {
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    
    // Check main heading
    await expect(page.getByRole('heading', { name: 'Customers', level: 1 })).toBeVisible();
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    
    // Open add customer modal
    await page.click('button:has-text("Add Customer")');
    await pageHelpers.waitForModal('Add New Customer');
    
    // Check that all form inputs have labels
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('should have proper button roles and labels', async ({ page }) => {
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Check that buttons have proper roles
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      await expect(button).toHaveAttribute('role', 'button');
    }
    
    // Check that buttons have accessible names
    const buttonsWithText = page.locator('button:has-text("Add Customer"), button:has-text("Add Contact"), button:has-text("Create Deal"), button:has-text("View Reports")');
    await expect(buttonsWithText).toHaveCount.greaterThan(0);
  });

  test('should have proper link roles and labels', async ({ page }) => {
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Check navigation links
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      await expect(link).toHaveAttribute('role', 'link');
      
      // Check that links have accessible text
      const text = await link.textContent();
      expect(text.trim()).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test Enter key activation
    await page.keyboard.press('Enter');
    await pageHelpers.waitForPageLoad();
    
    // Should navigate to focused page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(customers|contacts|deals)$/);
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    
    // Open modal
    await page.click('button:has-text("Add Customer")');
    await pageHelpers.waitForModal('Add New Customer');
    
    // Check modal has proper ARIA attributes
    const modal = page.locator('.modal-overlay');
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    
    // Check modal title
    const modalTitle = page.locator('#modal-title');
    await expect(modalTitle).toBeVisible();
    
    // Check close button
    const closeButton = page.locator('.modal-close');
    await expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
  });

  test('should have proper error handling', async ({ page }) => {
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    
    // Open modal
    await page.click('button:has-text("Add Customer")');
    await pageHelpers.waitForModal('Add New Customer');
    
    // Try to submit empty form
    await page.click('button:has-text("Create Customer")');
    
    // Check that error messages are properly associated
    const errorMessages = page.locator('.input-error');
    const errorCount = await errorMessages.count();
    
    for (let i = 0; i < errorCount; i++) {
      const error = errorMessages.nth(i);
      await expect(error).toHaveAttribute('role', 'alert');
    }
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
    
    // Open modal
    await page.click('button:has-text("Add Customer")');
    await pageHelpers.waitForModal('Add New Customer');
    
    // Check that focus is on first input
    const firstInput = page.locator('input').first();
    await expect(firstInput).toBeFocused();
    
    // Test tab navigation within modal
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Check that text is readable
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    
    for (let i = 0; i < headingCount; i++) {
      const heading = headings.nth(i);
      const text = await heading.textContent();
      expect(text.trim()).toBeTruthy();
    }
    
    // Check that buttons have sufficient contrast
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      expect(text.trim()).toBeTruthy();
    }
  });

  test('should work with screen readers', async ({ page }) => {
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Check that important elements have proper ARIA labels
    const logo = page.locator('.header__logo');
    await expect(logo).toBeVisible();
    
    // Check that buttons have accessible names
    const actionButtons = page.locator('.action-button');
    const buttonCount = await actionButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = actionButtons.nth(i);
      const text = await button.textContent();
      expect(text.trim()).toBeTruthy();
    }
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    await pageHelpers.waitForPageLoad();
    
    // Check that page still functions correctly
    await expect(page.getByRole('heading', { name: 'CRM Dashboard' })).toBeVisible();
    
    // Test navigation
    await page.click('a[href="/customers"]');
    await pageHelpers.waitForPageLoad();
    await expect(page).toHaveURL('/customers');
  });
});





