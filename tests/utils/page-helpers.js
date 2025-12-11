/**
 * Page helper utilities for Playwright tests
 */

export class PageHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('body');
  }

  /**
   * Take a screenshot with timestamp
   */
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Fill form field by label
   */
  async fillFieldByLabel(label, value) {
    const field = this.page.getByLabel(label);
    await field.clear();
    await field.fill(value);
  }

  /**
   * Click button by text
   */
  async clickButtonByText(text) {
    await this.page.getByRole('button', { name: text }).click();
  }

  /**
   * Wait for modal to appear
   */
  async waitForModal(title) {
    await this.page.waitForSelector('.modal-overlay');
    if (title) {
      await this.page.waitForSelector(`text=${title}`);
    }
  }

  /**
   * Close modal by clicking close button
   */
  async closeModal() {
    await this.page.click('.modal-close');
    await this.page.waitForSelector('.modal-overlay', { state: 'hidden' });
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingToComplete() {
    await this.page.waitForSelector('.loading-spinner', { state: 'hidden' });
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 1000 });
      return await this.page.isVisible(selector);
    } catch {
      return false;
    }
  }

  /**
   * Get text content of element
   */
  async getTextContent(selector) {
    const element = await this.page.waitForSelector(selector);
    return await element.textContent();
  }

  /**
   * Check for accessibility issues
   */
  async checkAccessibility() {
    // Check for proper heading structure
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels = await Promise.all(
      headings.map(heading => heading.evaluate(el => parseInt(el.tagName.substring(1))))
    );
    
    // Check for proper form labels
    const inputs = await this.page.locator('input, textarea, select').all();
    const inputsWithLabels = await Promise.all(
      inputs.map(input => input.evaluate(el => {
        const id = el.id;
        const label = document.querySelector(`label[for="${id}"]`);
        return !!label;
      }))
    );

    return {
      headings: headingLevels,
      inputsWithLabels: inputsWithLabels,
      allInputsHaveLabels: inputsWithLabels.every(hasLabel => hasLabel)
    };
  }

  /**
   * Check performance metrics
   */
  async getPerformanceMetrics() {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
      };
    });
    return metrics;
  }
}





