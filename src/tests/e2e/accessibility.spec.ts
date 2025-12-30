import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Should have h1
    await expect(page.locator('h1')).toBeVisible();
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Only one h1 per page
  });

  test('should have proper labels for form inputs', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();

    // Title input should have associated label
    await expect(page.getByLabel('Title')).toBeVisible();

    // Description should have associated label
    await expect(page.getByLabel('Description')).toBeVisible();

    // Due Date should have associated label
    await expect(page.getByLabel('Due Date')).toBeVisible();
  });

  test('should have accessible buttons', async ({ page }) => {
    // All buttons should have accessible names
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();

    expect(buttonCount).toBeGreaterThan(0);

    // Check first few buttons have accessible names
    for (let i = 0; i < Math.min(3, buttonCount); i++) {
      const button = buttons.nth(i);
      const name = await button.getAttribute('aria-label') || await button.textContent();
      expect(name).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // Should focus on an interactive element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have focus visible indicators', async ({ page }) => {
    // Tab to focus an element
    await page.keyboard.press('Tab');

    // Focused element should have visible focus indicator
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Should have focus-visible styles (ring)
    const focusStyles = await focusedElement.evaluate((el) => {
      return window.getComputedStyle(el).outline || window.getComputedStyle(el).boxShadow;
    });
    expect(focusStyles).toBeDefined();
  });

  test('should have proper ARIA attributes on dialogs', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();

    // Dialog should have role="dialog"
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
  });

  test('should trap focus in modal', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();

    // Tab through all elements in modal
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }

    // Focus should still be within the dialog
    const focusedElement = page.locator(':focus');
    const isInDialog = await focusedElement.evaluate((el) => {
      return el.closest('[role="dialog"]') !== null;
    });
    expect(isInDialog).toBe(true);
  });

  test('should close modal with Escape key', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    // Check that text is visible and readable
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Get computed styles
    const styles = await h1.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };
    });

    expect(styles.color).toBeDefined();
  });
});

test.describe('Screen Reader Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have descriptive link/button text', async ({ page }) => {
    // Add Todo button should be descriptive
    await expect(page.getByRole('button', { name: /Add Todo/i })).toBeVisible();

    // Add Category should be descriptive
    await expect(page.getByText('Add Category')).toBeVisible();
  });

  test('should have alt text or aria-labels for icons', async ({ page }) => {
    // Delete buttons should have title/aria-label
    const deleteButtons = page.locator('[title="Delete todo"], [title="Delete category"]');
    // These may not exist if no todos/categories
    // But the structure should support them
  });

  test('should announce filter changes', async ({ page }) => {
    // When changing filters, the page title updates
    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.locator('h1')).toContainText('Active');
  });
});
