import '../setup/mockReactPdf.jsx';
import '../setup/mockResizeObserver.js';
import { clickMock } from '../setup/mockExactumSvg.jsx';

import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';

import { MemoryRouter } from 'react-router-dom';
import Floorplan from '../../src/components/Floorplan';
import { AppSettingsProvider } from '../../src/context/AppSettingsContext.jsx';

describe('Floorplan - Interactions', () => {
  test('room can be clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AppSettingsProvider>
          <Floorplan />
        </AppSettingsProvider>
      </MemoryRouter>
    );

    const room = document.querySelector('[data-room-id="A346"]');
    await user.click(room);

    expect(clickMock).toHaveBeenCalled();
  });
});
