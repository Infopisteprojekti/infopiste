import { test, expect } from '@playwright/test';

test.describe('Infopiste', () => {
  test('home page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // There is no proper home page yet - no title or headings.
    // Once those are added, this should be changed to something more accurate.
    await expect(page.getByText('A348')).toBeVisible();
  });

  test('zoom buttons exist', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await expect(page.getByText('Zoom In')).toBeVisible();
    await expect(page.getByText('Zoom Out')).toBeVisible();
    await expect(page.getByText('Reset')).toBeVisible();
  });

  test('zoom buttons are clickable', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await page.getByText('Zoom In').click();
    await page.getByText('Zoom Out').click();
    await page.getByText('Reset').click();
  });
});
