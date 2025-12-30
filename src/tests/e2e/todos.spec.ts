import { test, expect } from '@playwright/test';

test.describe('Todo CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the todo app homepage', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Todos');
  });

  test('should show Add Todo button', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /Add Todo/i });
    await expect(addButton).toBeVisible();
  });

  test('should open todo form when clicking Add Todo', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Add New Todo')).toBeVisible();
  });

  test('should close todo form when clicking Cancel', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should close todo form when clicking X button', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    // Click the X button (first button in dialog header)
    await page.locator('[role="dialog"] button').first().click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should show empty state message', async ({ page }) => {
    await expect(page.getByText('No todos found')).toBeVisible();
  });

  test('should have required field validation for title', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    const submitButton = page.getByRole('button', { name: /Add Todo$/i });
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when title is entered', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await page.getByPlaceholder('What needs to be done?').fill('Test Todo');
    const submitButton = page.getByRole('button', { name: /Add Todo$/i });
    await expect(submitButton).not.toBeDisabled();
  });

  test('should have priority options', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await expect(page.getByText('Low')).toBeVisible();
    await expect(page.getByText('Medium')).toBeVisible();
    await expect(page.getByText('High')).toBeVisible();
  });

  test('should have due date input', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await expect(page.getByLabel('Due Date')).toBeVisible();
  });
});

test.describe('Todo Form Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Add Todo/i }).click();
  });

  test('should fill in todo title', async ({ page }) => {
    const titleInput = page.getByPlaceholder('What needs to be done?');
    await titleInput.fill('My New Todo');
    await expect(titleInput).toHaveValue('My New Todo');
  });

  test('should fill in description', async ({ page }) => {
    const descInput = page.getByPlaceholder('Add more details...');
    await descInput.fill('This is a description');
    await expect(descInput).toHaveValue('This is a description');
  });

  test('should select priority', async ({ page }) => {
    await page.getByRole('button', { name: 'High' }).click();
    await expect(page.getByRole('button', { name: 'High' })).toHaveClass(/bg-primary/);
  });

  test('should select due date', async ({ page }) => {
    const dateInput = page.getByLabel('Due Date');
    await dateInput.fill('2024-12-31');
    await expect(dateInput).toHaveValue('2024-12-31');
  });
});
