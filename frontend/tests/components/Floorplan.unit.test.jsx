import { AppSettingsProvider } from '@/context/AppSettingsContext.jsx';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';

import Floorplan from '@/components/Floorplan.jsx';
import { getZoomControls } from '../mocks/zoomPanPinch.mock.jsx';
import { MemoryRouter } from 'react-router-dom';

import LoadingContext from '@/context/LoadingContext.js';

vi.mock(
  '@/components/FloorDisplay',
  () => import('../mocks/floorDisplay.mock.jsx')
);
vi.mock('react-zoom-pan-pinch', () => import('../mocks/zoomPanPinch.mock.jsx'));

describe('Floorplan unit tests', () => {
  const setup = () => {
    const [loading, setLoading] = [false, () => undefined];

    render(
      <MemoryRouter>
        <AppSettingsProvider>
          <LoadingContext value={{ loading, setLoading }}>
            <Floorplan />
          </LoadingContext>
        </AppSettingsProvider>
      </MemoryRouter>
    );
  };

  test('toolbar and floor buttons are rendered', async () => {
    setup();

    expect(screen.getByRole('button', { name: 'Zoom In' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Zoom Out' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Floor 1' })).toBeInTheDocument();
  });

  test('zoom buttons work', async () => {
    setup();
    const user = userEvent.setup();
    const controls = getZoomControls();

    await user.click(screen.getByRole('button', { name: 'Zoom In' }));
    await user.click(screen.getByRole('button', { name: 'Zoom Out' }));
    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(controls.zoomIn).toHaveBeenCalled();
    expect(controls.zoomOut).toHaveBeenCalled();
    expect(controls.resetTransform).toHaveBeenCalled();
  });

  test('switching floors works', async () => {
    setup();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Floor 2' }));
    const props = await screen.findByTestId('floor-props');
    expect(props).toHaveAttribute('data-floor', '2');
  });
});
