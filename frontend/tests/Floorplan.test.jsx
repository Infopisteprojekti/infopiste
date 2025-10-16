import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { AppSettingsProvider } from '../src/context/AppSettingsContext.jsx';
import Floorplan from '../src/components/Floorplan';
import App from '../src/App';

import i18n from './testSetup.js';

// Mock ResizeObserver
class ResizeObserver {
  constructor(callback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

// Mock svg asset in tests, click event for A346
const clickMock = vi.fn();

vi.mock('../src/assets/exactum-3.svg?react', () => ({
  default: ({ ref }) => (
    <svg ref={ref}>
      <g data-room-id="A346" _status="available" onClick={clickMock}>
        <rect id="A346" />
      </g>
      <g data-room-id="A348" _status="reserved">
        <rect id="A348" />
      </g>
      <g data-room-id="A311" _status="unavailable">
        <rect id="A311" />
      </g>
    </svg>
  ),
}));

describe('Floorplan', () => {
  window.location = { ...window.location, search: '?lang=en' };

  test('floorplan is rendered correctly', async () => {
    render(
      <MemoryRouter>
        <AppSettingsProvider>
          <Floorplan />
        </AppSettingsProvider>
      </MemoryRouter>
    );

    const room = document.querySelector('[data-room-id="A346"]');
    expect(room).toBeInTheDocument();
  });

  test('correct amount of rooms is rendered', () => {
    window.location = { ...window.location, search: '?lang=en' };

    render(
      <MemoryRouter>
        <AppSettingsProvider>
          <Floorplan />
        </AppSettingsProvider>
      </MemoryRouter>
    );

    const rooms = document.querySelectorAll('g[data-room-id]');
    expect(rooms.length).toBe(3);
  });

  test('zoom buttons exist', () => {
    window.location = { ...window.location, search: '?lang=en' };

    render(
      <MemoryRouter>
        <AppSettingsProvider>
          <Floorplan />
        </AppSettingsProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Zoom In/i)).toBeInTheDocument();
    expect(screen.getByText(/Zoom Out/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
  });

  test('clicking room is possible', async () => {
    const user = userEvent.setup();

    window.location = { ...window.location, search: '?lang=en' };

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

  test('bulletin board can be accessed', async () => {
    const user = userEvent.setup();

    window.location = { ...window.location, search: '?lang=en' };

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const bulletinBoardButton = await screen.findByText('Bulletin Board');
    await user.click(bulletinBoardButton);

    const addFileButton = await screen.findByText('Add file');
    expect(addFileButton).toBeInTheDocument();
  });

  test('qr code to upload files appears', async () => {
    const user = userEvent.setup();

    window.location = { ...window.location, search: '?lang=en' };

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const bulletinBoardButton = await screen.findByText('Bulletin Board');
    await user.click(bulletinBoardButton);

    const addFileButton = await screen.findByText('Add file');
    await user.click(addFileButton);

    const popup = document.getElementById('popup');
    expect(popup.classList.contains('open-popup')).toBe(true);
  });

  test('qr code can be closed', async () => {
    const user = userEvent.setup();

    window.location = { ...window.location, search: '?lang=en' };

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const bulletinBoardButton = await screen.findByText('Bulletin Board');
    await user.click(bulletinBoardButton);

    const addFileButton = await screen.findByText('Add file');
    await user.click(addFileButton);

    const closeButton = await screen.findByText('Close');
    await user.click(closeButton);

    const popup = document.getElementById('popup');
    expect(popup.classList.contains('open-popup')).toBe(false);
  });

  test('Language can be changed from English to Finnish', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(i18n, 'changeLanguage');

    window.location = { ...window.location, search: '?lang=en' };

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
