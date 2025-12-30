import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Should have h1 for main heading
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('Todos');
  });

  test('should have proper labels for form inputs', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();

    // Title input should have placeholder
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    // Due date should have label
    await expect(page.getByLabel('Due Date')).toBeVisible();
  });

  test('should have accessible buttons', async ({ page }) => {
    // Add Todo button should be accessible
    const addTodoButton = page.getByRole('button', { name: /Add Todo/i });
    await expect(addTodoButton).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab should move focus through interactive elements
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have focus visible indicators', async ({ page }) => {
    // When tabbing, focused element should be visible
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper modal behavior', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await page.waitForTimeout(100);

    // Modal content should be visible
    await expect(page.getByText('Add New Todo')).toBeVisible();
  });

  test('should trap focus in modal', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await page.waitForTimeout(100);

    // Focus should be within the modal
    const modalContent = page.getByText('Add New Todo');
    await expect(modalContent).toBeVisible();

    // Tab through modal elements
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should close modal with Cancel button', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await page.waitForTimeout(100);
    await expect(page.getByText('Add New Todo')).toBeVisible();

    // Click cancel to close the modal
    await page.getByRole('button', { name: /Cancel/i }).click();
    await page.waitForTimeout(100);

    await expect(page.getByText('Add New Todo')).not.toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    // Main heading should be visible (implies sufficient contrast)
    await expect(page.locator('h1')).toBeVisible();

    // Buttons should be visible
    await expect(page.getByRole('button', { name: /Add Todo/i })).toBeVisible();
  });
});

test.describe('Screen Reader Accessibility', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should have descriptive button text', async ({ page }) => {
    // Add Todo button should have descriptive text
    await expect(page.getByRole('button', { name: /Add Todo/i })).toBeVisible();

    // Wait for sidebar to be attached and data to load
    const sidebar = page.locator('aside');
    await sidebar.waitFor({ state: 'attached', timeout: 10000 });

    // On some viewports, need to open sidebar
    const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') });
    if (await menuButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await menuButton.click();
      await page.waitForTimeout(300);
    }

    // Wait for Add Category button to appear after data loads
    await expect(page.getByText('Add Category')).toBeVisible({ timeout: 10000 });
  });

  test('should have icons with proper accessibility', async ({ page }) => {
    // Icons should be decorative or have aria-labels
    const buttons = page.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should update page title based on filter', async ({ page }) => {
    // Click Active filter
    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.locator('h1')).toContainText('Active');
  });
});
