import '../setup/mockReactPdf.jsx';
import '../setup/mockExactumSvg.jsx';
import '../setup/mockResizeObserver.js';

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { MemoryRouter } from 'react-router-dom';
import Floorplan from '../../src/components/Floorplan';
import { AppSettingsProvider } from '../../src/context/AppSettingsContext.jsx';

describe('Floorplan - Rendering', () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <AppSettingsProvider>
          <Floorplan />
        </AppSettingsProvider>
      </MemoryRouter>
    );
  };
  test('renders floorplan correctly', async () => {
    setup();
    const room = document.querySelector('[data-room-id="A346"]');
    expect(room).toBeInTheDocument();
  });

  test('renders correct amount of rooms', () => {
    setup();
    const rooms = document.querySelectorAll('g[data-room-id]');
    expect(rooms.length).toBe(3);
  });

  test('renders zoom buttons', () => {
    setup();
    expect(screen.getByText(/Zoom In/i)).toBeInTheDocument();
    expect(screen.getByText(/Zoom Out/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
  });
});
