import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive Design', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should show hamburger menu on mobile', async ({ page }) => {
    await page.goto('/');
    // Mobile menu button should be visible
    const menuButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(menuButton).toBeVisible();
  });

  test('should hide sidebar by default on mobile', async ({ page }) => {
    await page.goto('/');
    // Sidebar should be hidden (translated off-screen)
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('should show sidebar when clicking menu button', async ({ page }) => {
    await page.goto('/');
    // Click hamburger menu
    await page.locator('main').locator('button').first().click();

    // Sidebar should be visible
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/translate-x-0/);
  });

  test('should show backdrop when sidebar is open', async ({ page }) => {
    await page.goto('/');
    await page.locator('main').locator('button').first().click();

    // Backdrop should be visible
    const backdrop = page.locator('.bg-black\\/50');
    await expect(backdrop).toBeVisible();
  });

  test('should close sidebar when clicking backdrop', async ({ page }) => {
    await page.goto('/');
    await page.locator('main').locator('button').first().click();

    // Click backdrop
    await page.locator('.bg-black\\/50').click();

    // Sidebar should be hidden
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('should hide Add Todo text on small screens', async ({ page }) => {
    await page.goto('/');
    // Should only show icon, not text
    const addButton = page.getByRole('button', { name: /Add Todo/i });
    const buttonText = addButton.locator('span');
    await expect(buttonText).toHaveClass(/hidden/);
  });
});

test.describe('Tablet Responsive Design', () => {
  test.use({ viewport: { width: 768, height: 1024 } }); // iPad

  test('should show sidebar on tablet', async ({ page }) => {
    await page.goto('/');
    const sidebar = page.locator('aside');
    // Should be visible on larger screens
    await expect(sidebar).toBeVisible();
  });
});

test.describe('Desktop Layout', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('should show sidebar without hamburger menu', async ({ page }) => {
    await page.goto('/');

    // Sidebar should be visible
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Menu button should be hidden
    const menuButton = page.locator('[class*="lg:hidden"]').first();
    await expect(menuButton).not.toBeVisible();
  });

  test('should show full Add Todo button text', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Add Todo')).toBeVisible();
  });

  test('should have proper layout structure', async ({ page }) => {
    await page.goto('/');

    // Should have header
    await expect(page.locator('header')).toBeVisible();

    // Should have sidebar
    await expect(page.locator('aside')).toBeVisible();

    // Should have main content area
    await expect(page.locator('h1')).toBeVisible();
  });
});
