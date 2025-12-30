import { test, expect } from '@playwright/test';

test.describe('Category Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display All Categories option', async ({ page }) => {
    await expect(page.getByText('All Categories')).toBeVisible();
  });

  test('should display Add Category button', async ({ page }) => {
    await expect(page.getByText('Add Category')).toBeVisible();
  });

  test('should open category form when clicking Add Category', async ({ page }) => {
    await page.getByText('Add Category').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add Category' })).toBeVisible();
  });

  test('should close category form when clicking Cancel', async ({ page }) => {
    await page.getByText('Add Category').click();
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should have name input in category form', async ({ page }) => {
    await page.getByText('Add Category').click();
    await expect(page.getByPlaceholder('Category name')).toBeVisible();
  });

  test('should have color picker in category form', async ({ page }) => {
    await page.getByText('Add Category').click();
    await expect(page.getByText('Color')).toBeVisible();
    // Should have color buttons
    const colorButtons = page.locator('[role="dialog"] button.rounded-full');
    await expect(colorButtons.first()).toBeVisible();
  });

  test('should have preview section in category form', async ({ page }) => {
    await page.getByText('Add Category').click();
    await expect(page.getByText('Preview')).toBeVisible();
  });

  test('should update preview when typing category name', async ({ page }) => {
    await page.getByText('Add Category').click();
    await page.getByPlaceholder('Category name').fill('Work');
    // Preview should show the entered name
    const previewSection = page.locator('[role="dialog"]').getByText('Work');
    await expect(previewSection).toBeVisible();
  });

  test('should disable submit button when name is empty', async ({ page }) => {
    await page.getByText('Add Category').click();
    const submitButton = page.getByRole('button', { name: /Add Category$/i });
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when name is entered', async ({ page }) => {
    await page.getByText('Add Category').click();
    await page.getByPlaceholder('Category name').fill('Work');
    const submitButton = page.getByRole('button', { name: /Add Category$/i });
    await expect(submitButton).not.toBeDisabled();
  });

  test('should highlight All Categories when selected', async ({ page }) => {
    const allCategoriesButton = page.getByText('All Categories').locator('..');
    await expect(allCategoriesButton).toHaveClass(/bg-accent/);
  });
});

test.describe('Category Color Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Add Category').click();
  });

  test('should have multiple color options', async ({ page }) => {
    const colorButtons = page.locator('[role="dialog"] button.rounded-full');
    await expect(colorButtons).toHaveCount(9); // 9 colors in colorOptions
  });

  test('should select a different color', async ({ page }) => {
    const colorButtons = page.locator('[role="dialog"] button.rounded-full');
    await colorButtons.nth(2).click();
    // Selected color should have ring style
    await expect(colorButtons.nth(2)).toHaveClass(/ring-2/);
  });
});
