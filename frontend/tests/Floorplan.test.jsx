import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Floorplan from '../src/components/Floorplan';
import BulletinBoard from '../src/components/BulletinBoard.jsx';
import App from '../src/App';
import { describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

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

// Mock pdf
vi.mock('react-pdf', () => {
  return {
    Document: ({ children }) => <div data-testid="document">{children}</div>,
    Page: () => <div data-testid="page">PDF Page</div>,
    pdfjs: { GlobalWorkerOptions: { workerSrc: '' } },
  };
});

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
  test('floorplan is rendered correctly', async () => {
    render(
      <MemoryRouter>
        <Floorplan />
      </MemoryRouter>
    );

    const room = document.querySelector('[data-room-id="A346"]');
    expect(room).toBeInTheDocument();
  });

  test('correct amount of rooms is rendered', () => {
    render(
      <MemoryRouter>
        <Floorplan />
      </MemoryRouter>
    );

    const rooms = document.querySelectorAll('g[data-room-id]');
    expect(rooms.length).toBe(3);
  });

  test('zoom buttons exist', () => {
    render(
      <MemoryRouter>
        <Floorplan />
      </MemoryRouter>
    );

    expect(screen.getByText(/Zoom In/i)).toBeInTheDocument();
    expect(screen.getByText(/Zoom Out/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
  });

  test('clicking room is possible', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Floorplan />
      </MemoryRouter>
    );

    const room = document.querySelector('[data-room-id="A346"]');
    await user.click(room);

    expect(clickMock).toHaveBeenCalled();
  });

  test('url parameters work', async () => {
    render(
      <MemoryRouter initialEntries={['/?floor=2']}>
        <Floorplan />
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

  test('bulletin board can be accessed', async () => {
    render(
      <MemoryRouter>
        <BulletinBoard />
      </MemoryRouter>
    );

    const addFileButton = await screen.findByText('Add file');
    expect(addFileButton).toBeInTheDocument();
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

  test('renders loading', async () => {
    render(
      <MemoryRouter>
        <BulletinBoard />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading PDFs...')).toBeInTheDocument();
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