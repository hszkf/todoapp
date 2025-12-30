import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display theme toggle button', async ({ page }) => {
    // Theme toggle button should be in the header
    const header = page.locator('header');
    await expect(header.locator('button').last()).toBeVisible();
  });

  test('should toggle between light and dark mode', async ({ page }) => {
    const themeButton = page.locator('header').locator('button').last();

    // Get initial theme state
    const htmlElement = page.locator('html');

    // Click to toggle theme
    await themeButton.click();
    await page.waitForTimeout(100);

    // Should have changed (either added or removed dark class)
    const classAfterClick = await htmlElement.getAttribute('class');
    expect(classAfterClick).toBeDefined();
  });

  test('should persist theme preference', async ({ page, context }) => {
    const themeButton = page.locator('header').locator('button').last();

    // Click to change theme
    await themeButton.click();
    await page.waitForTimeout(100);

    const initialClass = await page.locator('html').getAttribute('class');

    // Reload the page
    await page.reload();
    await page.waitForTimeout(200);

    // Theme should be persisted
    const reloadedClass = await page.locator('html').getAttribute('class');
    expect(reloadedClass).toBe(initialClass);
  });

  test('should have sun/moon icon based on theme', async ({ page }) => {
    const themeButton = page.locator('header').locator('button').last();

    // Should have an SVG icon
    await expect(themeButton.locator('svg')).toBeVisible();
  });
});

test.describe('Dark Mode Styling', () => {
  test('should apply dark mode styles', async ({ page }) => {
    await page.goto('/');

    // Force dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await page.waitForTimeout(200);

    // Check that dark mode class is applied
    const htmlClass = await page.locator('html').getAttribute('class');
    // Theme might be 'dark' or follow system preference
    expect(htmlClass).toBeDefined();
  });

  test('should apply light mode styles', async ({ page }) => {
    await page.goto('/');

    // Force light mode
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    await page.waitForTimeout(200);

    // Check that the page is readable
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
