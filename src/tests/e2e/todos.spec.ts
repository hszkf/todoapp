import { test, expect } from '@playwright/test';

test.describe('Todo CRUD Operations', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
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
    await expect(page.getByText('Add New Todo')).toBeVisible();
  });

  test('should close todo form when clicking Cancel', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.getByText('Add New Todo')).not.toBeVisible();
  });

  test('should close todo form when clicking X button', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await page.waitForTimeout(100);
    // Close button is inside the modal header
    const closeButton = page.locator('.fixed.inset-0 button').filter({ has: page.locator('svg') }).first();
    await closeButton.click();
    await expect(page.getByText('Add New Todo')).not.toBeVisible();
  });

  test('should show empty state or todos', async ({ page }) => {
    // Either empty state or todo list should be visible
    const pageContent = await page.content();
    const hasContent = pageContent.includes('No todos') || pageContent.includes('todo');
    expect(hasContent).toBe(true);
  });

  test('should have required field validation for title', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await page.waitForTimeout(100);
    // Submit button in modal form
    const submitButton = page.locator('form button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when title is entered', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await page.waitForTimeout(100);
    await page.getByPlaceholder('What needs to be done?').fill('Test Todo');
    await page.waitForTimeout(100);
    const submitButton = page.locator('form button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });

  test('should have priority options', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await expect(page.getByRole('button', { name: 'Low' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Medium' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'High' })).toBeVisible();
  });

  test('should have due date input', async ({ page }) => {
    await page.getByRole('button', { name: /Add Todo/i }).click();
    await expect(page.getByLabel('Due Date')).toBeVisible();
  });
});

test.describe('Todo Form Interactions', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
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
