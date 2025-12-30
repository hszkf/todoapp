import { test, expect } from '@playwright/test';

test.describe('Todo Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display search input', async ({ page }) => {
    await expect(page.getByPlaceholder('Search todos...')).toBeVisible();
  });

  test('should be able to type in search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search todos...');
    await searchInput.fill('test query');
    await expect(searchInput).toHaveValue('test query');
  });

  test('should show clear button when text is entered', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search todos...');
    await searchInput.fill('test');

    // Wait for debounce and UI update
    await page.waitForTimeout(400);

    // Should show clear button (X icon)
    const clearButton = page.locator('input[placeholder="Search todos..."]').locator('..').locator('button');
    await expect(clearButton).toBeVisible();
  });

  test('should clear search when clicking clear button', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search todos...');
    await searchInput.fill('test');

    await page.waitForTimeout(400);

    const clearButton = page.locator('input[placeholder="Search todos..."]').locator('..').locator('button');
    await clearButton.click();

    await expect(searchInput).toHaveValue('');
  });

  test('should have search icon', async ({ page }) => {
    // Search icon should be visible (SVG with search class)
    const searchContainer = page.locator('input[placeholder="Search todos..."]').locator('..');
    await expect(searchContainer.locator('svg').first()).toBeVisible();
  });
});

test.describe('Search Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show clear filters after search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search todos...');
    await searchInput.fill('search term');

    // Wait for debounce
    await page.waitForTimeout(400);

    await expect(page.getByText('Clear filters')).toBeVisible();
  });

  test('should clear search with clear filters button', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search todos...');
    await searchInput.fill('search term');

    await page.waitForTimeout(400);

    await page.getByText('Clear filters').click();

    await expect(searchInput).toHaveValue('');
  });
});
