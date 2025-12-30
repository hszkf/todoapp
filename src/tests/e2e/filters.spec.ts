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
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('should have All Priorities as default', async ({ page }) => {
    await expect(page.getByRole('combobox')).toHaveValue('all');
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
    const select = page.getByRole('combobox');
    await select.click();

    await expect(page.getByRole('option', { name: 'All Priorities' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'High' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Medium' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Low' })).toBeVisible();
  });

  test('should select high priority', async ({ page }) => {
    await page.getByRole('combobox').selectOption('high');
    await expect(page.getByRole('combobox')).toHaveValue('high');
  });

  test('should show clear filters after priority selection', async ({ page }) => {
    await page.getByRole('combobox').selectOption('high');
    await expect(page.getByText('Clear filters')).toBeVisible();
  });
});
