import { test, expect } from '@playwright/test';

test.describe('Todo Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display filter buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Active' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();
  });

  test('should have All filter selected by default', async ({ page }) => {
    const allButton = page.getByRole('button', { name: 'All' });
    await expect(allButton).toHaveClass(/bg-primary/);
  });

  test('should switch to Active filter', async ({ page }) => {
    await page.getByRole('button', { name: 'Active' }).click();
    const activeButton = page.getByRole('button', { name: 'Active' });
    await expect(activeButton).toHaveClass(/bg-primary/);
  });

  test('should switch to Completed filter', async ({ page }) => {
    await page.getByRole('button', { name: 'Completed' }).click();
    const completedButton = page.getByRole('button', { name: 'Completed' });
    await expect(completedButton).toHaveClass(/bg-primary/);
  });

  test('should update page title based on filter', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('All Todos');

    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.locator('h1')).toContainText('Active Todos');

    await page.getByRole('button', { name: 'Completed' }).click();
    await expect(page.locator('h1')).toContainText('Completed Todos');
  });

  test('should display priority dropdown', async ({ page }) => {
    await expect(page.locator('select')).toBeVisible();
  });

  test('should have All Priorities as default', async ({ page }) => {
    await expect(page.locator('select')).toHaveValue('all');
  });

  test('should show clear filters button when filters applied', async ({ page }) => {
    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.getByText('Clear filters')).toBeVisible();
  });

  test('should clear filters when clicking clear', async ({ page }) => {
    await page.getByRole('button', { name: 'Active' }).click();
    await page.getByText('Clear filters').click();

    const allButton = page.getByRole('button', { name: 'All' });
    await expect(allButton).toHaveClass(/bg-primary/);
  });
});

test.describe('Priority Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have priority options in dropdown', async ({ page }) => {
    // Native select element - check options exist via value selection
    const select = page.locator('select');
    await expect(select).toBeVisible();

    // Verify options by checking the select has expected values
    const options = await select.locator('option').allTextContents();
    expect(options).toContain('All Priorities');
    expect(options).toContain('High');
    expect(options).toContain('Medium');
    expect(options).toContain('Low');
  });

  test('should select high priority', async ({ page }) => {
    await page.locator('select').selectOption('high');
    await expect(page.locator('select')).toHaveValue('high');
  });

  test('should show clear filters after priority selection', async ({ page }) => {
    await page.locator('select').selectOption('high');
    await expect(page.getByText('Clear filters')).toBeVisible();
  });
});
