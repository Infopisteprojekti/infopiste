import '../setup/mockReactPdf.jsx';
import '../setup/mockResizeObserver.js';
import '../setup/mockExactumSvg.jsx';

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';

import { MemoryRouter } from 'react-router-dom';
import App from '../../src/App';

describe('App - Navigation and URL params', () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  };

  test('URL params load correct floor', async () => {
    window.location = { ...window.location, search: '?lang=en&floor=2' };

    setup();

    const room = document.querySelector('[data-room-id="B233"]');
    expect(room).toBeInTheDocument();
  });

  test('bulletin board can be accessed', async () => {
    const user = userEvent.setup();
    setup();

    const bulletinBoardButton = await screen.findByText('Bulletin Board');
    await user.click(bulletinBoardButton);

    expect(await screen.findByText('No PDFs were found')).toBeInTheDocument();
  });
});
