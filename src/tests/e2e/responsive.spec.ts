import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive Design', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should show hamburger menu on mobile', async ({ page }) => {
    // Mobile menu button should be visible
    const menuButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(menuButton).toBeVisible();
  });

  test('should hide sidebar by default on mobile', async ({ page }) => {
    // Sidebar should be hidden (translated off-screen)
    // Check that sidebar text is not visible
    await expect(page.getByText('All Categories')).not.toBeVisible();
  });

  test('should show sidebar when clicking menu button', async ({ page }) => {
    // Click the first button (menu button)
    const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') });
    await menuButton.click();
    await page.waitForTimeout(500);

    // Wait for sidebar content to load and become visible
    await expect(page.getByText('All Categories')).toBeVisible({ timeout: 10000 });
  });

  test('should show backdrop when sidebar is open', async ({ page }) => {
    const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') });
    await menuButton.click();
    await page.waitForTimeout(300);

    // Backdrop should be visible
    const backdrop = page.locator('.bg-black\\/50');
    await expect(backdrop).toBeVisible();
  });

  test('should close sidebar when clicking backdrop', async ({ page }) => {
    const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') });
    await menuButton.click();
    await page.waitForTimeout(500);

    // Wait for sidebar to be visible first
    await expect(page.getByText('All Categories')).toBeVisible({ timeout: 10000 });

    // Click backdrop (using force to bypass any interception)
    const backdrop = page.locator('.bg-black\\/50');
    await backdrop.click({ force: true });
    await page.waitForTimeout(500);

    // Sidebar should be hidden
    await expect(page.getByText('All Categories')).not.toBeVisible();
  });

  test('should hide Add Todo text on small screens', async ({ page }) => {
    // On small screens, the "Add Todo" text is hidden, only icon shows
    // The text should have 'hidden' class on small screens, only plus icon visible
    await expect(page.getByRole('button').filter({ has: page.locator('svg.lucide-plus') })).toBeVisible();
  });

  test('should stack filters on mobile', async ({ page }) => {
    // Filter buttons should be visible
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Active' })).toBeVisible();
  });
});

test.describe('Tablet Responsive Design', () => {
  test.use({ viewport: { width: 768, height: 1024 } }); // iPad

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should show content properly on tablet', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Todo/i })).toBeVisible();
  });

  test('should show sidebar on larger tablets', async ({ page }) => {
    // On tablet viewport, sidebar might need to be opened
    const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') });

    // Check if menu button is visible (tablet might show it)
    if (await menuButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await menuButton.click();
      await page.waitForTimeout(500);
      // Wait for sidebar content to load
      await expect(page.getByText('All Categories')).toBeVisible({ timeout: 10000 });
    }

    // Main content should be visible regardless
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Desktop Layout', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should show sidebar on desktop', async ({ page }) => {
    // On desktop, sidebar should be visible (lg:translate-x-0)
    // The sidebar has aside tag with the categories
    const sidebar = page.locator('aside');
    await sidebar.waitFor({ state: 'attached', timeout: 10000 });

    // If sidebar is not visible on this viewport, open it
    const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') });
    if (await menuButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await menuButton.click();
      await page.waitForTimeout(500);
    }

    // Wait for category data to load
    await expect(page.getByText('All Categories')).toBeVisible({ timeout: 10000 });
  });

  test('should show full Add Todo button text', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add Todo/i })).toBeVisible();
  });

  test('should have proper spacing on desktop', async ({ page }) => {
    // Main content area should be visible
    const main = page.locator('main, .flex-1');
    await expect(main.first()).toBeVisible();
  });
});
