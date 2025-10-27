import { clickMock } from './setup/mockExactumSvg.jsx';
import './setup/mockReactPdf.jsx';
import './setup/mockResizeObserver.js';
import i18n from './setup/i18nTest.js';

import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { MemoryRouter } from 'react-router-dom';
import Floorplan from '../src/components/Floorplan';
import BulletinBoard from '../src/components/BulletinBoard.jsx';
import { AppSettingsProvider } from '../src/context/AppSettingsContext.jsx';
import App from '../src/App';

describe('Floorplan', () => {
  test('url parameters work', async () => {
    window.location = { ...window.location, search: '?lang=en&floor=2' };

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const room = document.querySelector('[data-room-id="B233"]');
    expect(room).toBeInTheDocument();
  });

  test('Language can be changed from English to Finnish', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(i18n, 'changeLanguage');

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Floor Plan')).toBeInTheDocument();

    // Assumes default language to be English
    const langDropDown = await screen.findByText('EN');
    await user.click(langDropDown);

    const finnishOption = await screen.findByText('Suomi');
    await user.click(finnishOption);

    expect(spy).toHaveBeenCalledWith('fi');
    expect(await screen.findByText('Kartta')).toBeInTheDocument();
  });
});
