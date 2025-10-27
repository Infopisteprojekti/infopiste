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

describe('BulletinBoard', () => {
  const mockForms = [
    {
      _id: '1',
      title: 'Form 1',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      fileUrl: '/form1.pdf',
    },
    {
      _id: '2',
      title: 'Form 2',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      fileUrl: '/form2.pdf',
    },
  ];

  let fetchSpy;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockForms,
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  test('qr code to upload files appears', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <BulletinBoard />
      </MemoryRouter>
    );

    const addFileButton = await screen.findByText('Add file');
    await user.click(addFileButton);

    const popup = document.getElementById('popup');
    expect(popup.classList.contains('open-popup')).toBe(true);
  });

  test('qr code can be closed', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <BulletinBoard />
      </MemoryRouter>
    );

    const addFileButton = await screen.findByText('Add file');
    await user.click(addFileButton);

    const closeButton = await screen.findByText('Close');
    await user.click(closeButton);

    const popup = document.getElementById('popup');
    expect(popup.classList.contains('open-popup')).toBe(false);
  });

  test('navigation between forms works', async () => {
    render(<BulletinBoard />);
    await waitFor(() => screen.getByText('Form 1'));

    const nextButton = screen.getByText('← Previous');
    const prevButton = screen.getByText('Next →');

    userEvent.click(nextButton);
    await waitFor(() => screen.getByText('Form 2'));
    expect(screen.getByText('Form 2')).toBeInTheDocument();

    userEvent.click(prevButton);
    await waitFor(() => screen.getByText('Form 1'));
    expect(screen.getByText('Form 1')).toBeInTheDocument();
  });
});
