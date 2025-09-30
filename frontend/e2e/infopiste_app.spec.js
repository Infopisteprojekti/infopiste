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

    const svg = page.locator('[data-testid="floorplan-svg"]').first();
    await svg.waitFor({ state: 'attached' });
    await expect(svg).toBeVisible();

    const rooms = page.locator('svg g > .room');
    await rooms.first().waitFor({ state: 'visible' });

    const roomCount = await rooms.count();
    expect(roomCount).toBeGreaterThan(0);
  });

  test('zoom functionality works', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const svg = page.locator('[data-testid="floorplan-svg"]').first()

    const transformedElement = svg.locator('xpath=..'); 
    await expect(transformedElement).toBeVisible();

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
    await page.waitForTimeout(500); 

    const zoomedInTransform = await transformedElement.evaluate(elem => getComputedStyle(elem).transform);
    const zoomedInScale = getScaleFactor(zoomedInTransform);
    
    expect(zoomedInScale).toBeGreaterThan(defaultScale);

    await page.getByText('Reset').click();
    await page.waitForTimeout(500); 

    const resetTransform = await transformedElement.evaluate(elem => getComputedStyle(elem).transform);
    const resetScale = getScaleFactor(resetTransform);
    
    expect(resetScale).toBeCloseTo(defaultScale, 2); 

    await page.getByText('Zoom Out').click();
    await page.waitForTimeout(500); 
    
    const zoomedOutTransform = await transformedElement.evaluate(elem => getComputedStyle(elem).transform);
    const zoomedOutScale = getScaleFactor(zoomedOutTransform);
    
    expect(zoomedOutScale).toBeLessThan(defaultScale);
  });

  test('room statuses are correct', async ({ page }) => {
    await page.route('**/api/rooms', route => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'A344',
            type: 'meeting',
            reservations: []
          },
          {
            id: 'A345',
            type: 'meeting',
            reservations: [
              {
                id: 1,
                subject: 'Best Meeting',
                organizer: 'Some Person',
                start: { dateTime: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
                end: { dateTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() },
                location: 'A345'
              }
            ]
          },
          {
            id: 'A346',
            type: 'office',
            reservations: []
          }
        ])
      });
    });

    await page.goto('http://localhost:5173');

    const floorplan = page.getByTestId('floorplan-svg').first();
    await expect(floorplan).toBeVisible();

    const roomA344 = floorplan.locator('#A344');
    const roomA345 = floorplan.locator('#A345');
    const roomA346 = floorplan.locator('#A346');

    await expect(roomA344).toHaveClass(/available/);
    await expect(roomA345).toHaveClass(/reserved/);
    await expect(roomA346).toHaveClass(/unavailable/);
  });

  test('floor can be changed', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const floor3Room = page.locator('#A344');
    await expect(floor3Room).toBeVisible();

    await page.getByText('Floor 2').click();
    const floor2Room = page.locator('#A244');
    await expect(floor2Room).toBeVisible();

    await page.getByText('Floor 1').click();
    const floor1Room = page.locator('#A144');
    await expect(floor1Room).toBeVisible();

    await page.getByText('Floor 3').click();
    await expect(floor3Room).toBeVisible();
  });

  test('bulletin board view can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await page.getByText('Bulletin Board').click();
    await expect(page.getByText('Files')).toBeVisible();
  })
});
