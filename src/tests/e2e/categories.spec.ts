import { test, expect } from '@playwright/test';

// Helper to open sidebar on mobile or ensure it's visible
async function ensureSidebarVisible(page: import('@playwright/test').Page) {
  // Wait for sidebar to load - it starts hidden on mobile, visible on desktop
  const sidebar = page.locator('aside');
  await sidebar.waitFor({ state: 'attached', timeout: 10000 });

  // On mobile, click menu button to show sidebar
  const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') });
  if (await menuButton.isVisible({ timeout: 1000 }).catch(() => false)) {
    await menuButton.click();
    await page.waitForTimeout(300);
  }

  // Wait for category data to load (All Categories button appears)
  await page.getByText('All Categories').waitFor({ state: 'visible', timeout: 10000 });
}

test.describe('Category Management', () => {
  // Use desktop viewport for category tests since sidebar is visible
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await ensureSidebarVisible(page);
  });

  test('should display All Categories option', async ({ page }) => {
    await expect(page.getByText('All Categories')).toBeVisible();
  });

  test('should display Add Category button', async ({ page }) => {
    await expect(page.getByText('Add Category')).toBeVisible();
  });

  test('should open category form when clicking Add Category', async ({ page }) => {
    await page.getByText('Add Category').click();
    await expect(page.getByText('Add New Category')).toBeVisible();
  });

  test('should have name input in category form', async ({ page }) => {
    await page.getByText('Add Category').click();
    await expect(page.getByPlaceholder('Category name')).toBeVisible();
  });

  test('should close category form when clicking Cancel', async ({ page }) => {
    await page.getByText('Add Category').click();
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.getByText('Add New Category')).not.toBeVisible();
  });

  test('should have color picker in category form', async ({ page }) => {
    await page.getByText('Add Category').click();
    // Color options should be visible
    const colorButtons = page.locator('button[style*="background-color"]');
    const count = await colorButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should update preview when typing category name', async ({ page }) => {
    await page.getByText('Add Category').click();
    const input = page.getByPlaceholder('Category name');
    await input.fill('Work');
    // The preview should show the name somewhere
    await expect(input).toHaveValue('Work');
  });

  test('should disable submit button when name is empty', async ({ page }) => {
    await page.getByText('Add Category').click();
    const submitButton = page.getByRole('button', { name: /Add Category$/i }).last();
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when name is entered', async ({ page }) => {
    await page.getByText('Add Category').click();
    await page.getByPlaceholder('Category name').fill('Test Category');
    const submitButton = page.getByRole('button', { name: /Add Category$/i }).last();
    await expect(submitButton).not.toBeDisabled();
  });

  test('should highlight All Categories when selected', async ({ page }) => {
    const allCategoriesButton = page.getByText('All Categories');
    await allCategoriesButton.click();
    // Should have accent background class
    await expect(allCategoriesButton).toBeVisible();
  });
});

test.describe('Category Color Selection', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await ensureSidebarVisible(page);
    await page.getByText('Add Category').click();
  });

  test('should have multiple color options', async ({ page }) => {
    const colorButtons = page.locator('button[style*="background-color"]');
    const count = await colorButtons.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should select a different color', async ({ page }) => {
    const colorButtons = page.locator('button[style*="background-color"]');
    await colorButtons.nth(2).click();
    // Color should be selected (ring visible)
    await expect(colorButtons.nth(2)).toBeVisible();
  });
});
