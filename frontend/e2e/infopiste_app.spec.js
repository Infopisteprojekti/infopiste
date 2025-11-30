import { test, expect } from '@playwright/test';
import {
  mockFormsRoute,
  mockReservationsRoute,
  mockRoomsRoute,
} from '../e2e/testUtils';

test.describe('Infopiste app', () => {
  test.beforeEach(async ({ page }) => {
    await mockRoomsRoute(page);
    await mockFormsRoute(page);
    await mockReservationsRoute(page);
    await page.goto('?lang=en');
  });

  test('home page can be opened', async ({ page }) => {
    await expect(page.getByText('A335')).toBeVisible();

    const title = await page.title();
    expect(title).toBe('infonäyttö');
  });

  test('floorplan is rendered', async ({ page }) => {
    const floorplan = page.getByTestId('floorplan-svg');
    await expect(floorplan).toBeVisible();

    const rooms = floorplan.locator('.room');
    await expect(rooms.first()).toBeVisible();
  });

  test('zoom in button works', async ({ page }) => {
    const transformWrapper = page.locator('.react-transform-component');
    const initialTransform = await transformWrapper.getAttribute('style');
    await page.getByTestId('zoom-in-button').click();
    await expect(transformWrapper).not.toHaveAttribute(
      'style',
      initialTransform
    );
  });

  test('zoom out button works', async ({ page }) => {
    const transformWrapper = page.locator('.react-transform-component');
    const initialTransform = await transformWrapper.getAttribute('style');
    await page.getByTestId('zoom-out-button').click();
    await expect(transformWrapper).not.toHaveAttribute(
      'style',
      initialTransform
    );
  });

  test('floor can be changed', async ({ page }) => {
    await page.getByText('Floor 1').click();
    const floorplan = page.getByTestId('floorplan-svg');

    const floor1Room = floorplan.locator('#A120');
    await expect(floor1Room).toBeVisible();

    await page.getByText('Floor 2').click();
    const floor2Room = floorplan.locator('#A235');
    await expect(floor2Room).toBeVisible();

    await expect(floor1Room).not.toBeAttached();
  });

  test('reserved room is displayed as reserved', async ({ page }) => {
    const floorplan = page.getByTestId('floorplan-svg');
    await expect(floorplan).toBeVisible();

    const roomA335 = floorplan.locator('#A335');
    await expect(roomA335).toHaveClass(/reserved/);
  });

  test('bulletin board view can be opened', async ({ page }) => {
    await page.getByText('Bulletin Board').click();

    await expect(page.getByText('Available notices')).toBeVisible();
  });

  test('qr code can be opened and closed', async ({ page }) => {
    await page.getByText('Bulletin Board').click();

    await page.getByText('Add file').click();
    await expect(page.getByText('Scan QR code to add')).toBeVisible();

    await page.getByTestId('qr-button').click();
    await expect(page.getByText('Scan QR code to add')).not.toBeVisible();
  });

  test('grid view is rendered correctly', async ({ page }) => {
    await page.getByText('Bulletin Board').click();

    await expect(page.getByText('Form 1')).toBeVisible();
    await expect(page.getByText('Form 2')).toBeVisible();
  });

  test('pdfs can be switched', async ({ page }) => {
    await page.getByText('Bulletin Board').click();

    await page.getByText('Form 1').click();

    await page.getByText('Next').click();
    await expect(page.getByText('Form 2')).toBeVisible();
  });

  test('return to grid view works', async ({ page }) => {
    await page.getByText('Bulletin Board').click();

    await page.getByText('Form 1').click();

    await page.getByText('View all notices').click();
    await expect(page.getByText('Available notices')).toBeVisible();
  });
});
