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

  test('floorplan is rendered', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const floorplanWrapper = page.getByTestId('floorplan-svg').first();
    await floorplanWrapper.waitFor({ state: 'attached' });

    const rooms = await page.locator('svg g').count();
    expect(rooms).toBeGreaterThan(0);
  });

  test('zoom functionality works', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const svg = page.getByTestId('floorplan-svg').first();

    const transformedElement = svg.locator('xpath=..'); 
    await transformedElement.waitFor({ state: 'visible' });

    const getScaleFactor = (transform) => {
        const match = transform.match(/matrix\(([^,]+),/);
        if (match) {
            return parseFloat(match[1]);
        }
        return 1; 
    };

    const initialTransform = await transformedElement.evaluate(elem => getComputedStyle(elem).transform);
    const defaultScale = getScaleFactor(initialTransform); 
    expect(defaultScale).toBe(1); 
    
    await page.getByText('Zoom In').click();
    await page.waitForTimeout(200); 

    const zoomedInTransform = await transformedElement.evaluate(elem => getComputedStyle(elem).transform);
    const zoomedInScale = getScaleFactor(zoomedInTransform);
    
    expect(zoomedInScale).toBeGreaterThan(defaultScale);

    await page.getByText('Reset').click();
    await page.waitForTimeout(200); 

    const resetTransform = await transformedElement.evaluate(elem => getComputedStyle(elem).transform);
    const resetScale = getScaleFactor(resetTransform);
    
    expect(resetScale).toBeCloseTo(defaultScale, 2); 

    await page.getByText('Zoom Out').click();
    await page.waitForTimeout(200); 
    
    const zoomedOutTransform = await transformedElement.evaluate(elem => getComputedStyle(elem).transform);
    const zoomedOutScale = getScaleFactor(zoomedOutTransform);
    
    expect(zoomedOutScale).toBeLessThan(defaultScale);
  });
});
