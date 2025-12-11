import { test, expect } from '@playwright/test';
import { PageHelpers } from '../utils/page-helpers';
import { testCustomers, invalidCustomerData } from '../fixtures/test-data';

test.describe('Customer Management', () => {
  let pageHelpers;

  test.beforeEach(async ({ page }) => {
    pageHelpers = new PageHelpers(page);
    await page.goto('/customers');
    await pageHelpers.waitForPageLoad();
  });

  test('should display customers page with correct elements', async ({ page }) => {
    // Check page title and heading
    await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
    
    // Check search input
    await expect(page.getByPlaceholder('Search customers...')).toBeVisible();
    
    // Check add customer button
    await expect(page.getByRole('button', { name: 'Add Customer' })).toBeVisible();
  });

  test('should display existing customers', async ({ page }) => {
    // Wait for customers to load
    await pageHelpers.waitForLoadingToComplete();
    
    // Check that customer cards are displayed
    const customerCards = page.locator('.customer-card');
    await expect(customerCards).toHaveCount.greaterThan(0);
    
    // Check customer information is displayed
    await expect(page.getByText('Acme Corporation')).toBeVisible();
    await expect(page.getByText('contact@acme.com')).toBeVisible();
  });

  test('should open add customer modal', async ({ page }) => {
    // Click add customer button
    await pageHelpers.clickButtonByText('Add Customer');
    
    // Wait for modal to appear
    await pageHelpers.waitForModal('Add New Customer');
    
    // Check modal elements
    await expect(page.getByText('Add New Customer')).toBeVisible();
    await expect(page.getByLabel('Company Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Phone')).toBeVisible();
    await expect(page.getByLabel('Industry')).toBeVisible();
  });

  test('should create a new customer successfully', async ({ page }) => {
    const customerData = testCustomers[0];
    
    // Open add customer modal
    await pageHelpers.clickButtonByText('Add Customer');
    await pageHelpers.waitForModal('Add New Customer');
    
    // Fill customer form
    await pageHelpers.fillFieldByLabel('Company Name', customerData.name);
    await pageHelpers.fillFieldByLabel('Email', customerData.email);
    await pageHelpers.fillFieldByLabel('Phone', customerData.phone);
    await pageHelpers.fillFieldByLabel('Industry', customerData.industry);
    
    // Fill address information
    await pageHelpers.fillFieldByLabel('Street Address', customerData.address.street);
    await pageHelpers.fillFieldByLabel('City', customerData.address.city);
    await pageHelpers.fillFieldByLabel('State', customerData.address.state);
    await pageHelpers.fillFieldByLabel('ZIP Code', customerData.address.zipCode);
    await pageHelpers.fillFieldByLabel('Country', customerData.address.country);
    
    // Submit form
    await pageHelpers.clickButtonByText('Create Customer');
    
    // Wait for modal to close
    await page.waitForSelector('.modal-overlay', { state: 'hidden' });
    
    // Check that customer was added
    await expect(page.getByText(customerData.name)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Open add customer modal
    await pageHelpers.clickButtonByText('Add Customer');
    await pageHelpers.waitForModal('Add New Customer');
    
    // Try to submit empty form
    await pageHelpers.clickButtonByText('Create Customer');
    
    // Check validation errors
    await expect(page.getByText('Company name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Phone number is required')).toBeVisible();
    await expect(page.getByText('Industry is required')).toBeVisible();
    await expect(page.getByText('City is required')).toBeVisible();
    await expect(page.getByText('State is required')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // Open add customer modal
    await pageHelpers.clickButtonByText('Add Customer');
    await pageHelpers.waitForModal('Add New Customer');
    
    // Fill form with invalid email
    await pageHelpers.fillFieldByLabel('Company Name', 'Test Company');
    await pageHelpers.fillFieldByLabel('Email', 'invalid-email');
    await pageHelpers.fillFieldByLabel('Phone', '+1-555-0123');
    await pageHelpers.fillFieldByLabel('Industry', 'Technology');
    await pageHelpers.fillFieldByLabel('City', 'Test City');
    await pageHelpers.fillFieldByLabel('State', 'CA');
    
    // Submit form
    await pageHelpers.clickButtonByText('Create Customer');
    
    // Check email validation error
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });

  test('should search customers', async ({ page }) => {
    // Wait for customers to load
    await pageHelpers.waitForLoadingToComplete();
    
    // Search for specific customer
    await page.fill('input[placeholder="Search customers..."]', 'Acme');
    
    // Check that only matching customers are shown
    await expect(page.getByText('Acme Corporation')).toBeVisible();
    
    // Clear search
    await page.fill('input[placeholder="Search customers..."]', '');
    
    // All customers should be visible again
    await expect(page.getByText('Acme Corporation')).toBeVisible();
    await expect(page.getByText('Global Industries')).toBeVisible();
  });

  test('should edit customer', async ({ page }) => {
    // Wait for customers to load
    await pageHelpers.waitForLoadingToComplete();
    
    // Find and click edit button for first customer
    const editButton = page.locator('.customer-card').first().getByRole('button', { name: 'Edit' });
    await editButton.click();
    
    // Wait for modal to appear
    await pageHelpers.waitForModal('Edit Customer');
    
    // Check that form is pre-filled
    const nameField = page.getByLabel('Company Name');
    await expect(nameField).toHaveValue('Acme Corporation');
    
    // Update customer name
    await nameField.clear();
    await nameField.fill('Updated Company Name');
    
    // Submit form
    await pageHelpers.clickButtonByText('Update Customer');
    
    // Wait for modal to close
    await page.waitForSelector('.modal-overlay', { state: 'hidden' });
    
    // Check that customer was updated
    await expect(page.getByText('Updated Company Name')).toBeVisible();
  });

  test('should delete customer with confirmation', async ({ page }) => {
    // Wait for customers to load
    await pageHelpers.waitForLoadingToComplete();
    
    // Get initial customer count
    const initialCount = await page.locator('.customer-card').count();
    
    // Find and click delete button for first customer
    const deleteButton = page.locator('.customer-card').first().getByRole('button', { name: 'Delete' });
    
    // Set up dialog handler
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Are you sure');
      await dialog.accept();
    });
    
    await deleteButton.click();
    
    // Wait for customer to be removed
    await page.waitForTimeout(500);
    
    // Check that customer count decreased
    const newCount = await page.locator('.customer-card').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('should cancel customer deletion', async ({ page }) => {
    // Wait for customers to load
    await pageHelpers.waitForLoadingToComplete();
    
    // Get initial customer count
    const initialCount = await page.locator('.customer-card').count();
    
    // Find and click delete button for first customer
    const deleteButton = page.locator('.customer-card').first().getByRole('button', { name: 'Delete' });
    
    // Set up dialog handler to cancel
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Are you sure');
      await dialog.dismiss();
    });
    
    await deleteButton.click();
    
    // Wait a bit
    await page.waitForTimeout(500);
    
    // Check that customer count remains the same
    const newCount = await page.locator('.customer-card').count();
    expect(newCount).toBe(initialCount);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Test Enter key on focused element
    await page.keyboard.press('Enter');
    
    // Modal should open
    await pageHelpers.waitForModal('Add New Customer');
    
    // Close modal with Escape key
    await page.keyboard.press('Escape');
    await page.waitForSelector('.modal-overlay', { state: 'hidden' });
  });

  test('should be accessible', async ({ page }) => {
    const accessibility = await pageHelpers.checkAccessibility();
    
    // Check that all form inputs have labels
    expect(accessibility.allInputsHaveLabels).toBe(true);
    
    // Check that buttons have proper roles
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check that customer cards have proper structure
    const customerCards = page.locator('.customer-card');
    await expect(customerCards.first()).toBeVisible();
  });
});





