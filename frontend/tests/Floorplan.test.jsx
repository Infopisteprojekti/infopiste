import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Floorplan from '../src/components/Floorplan';
import App from '../src/App'
import '../src/css/Floorplan.css';
import { describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// Mock ResizeObserver
class ResizeObserver {
  constructor(callback) { }
  observe() { }
  unobserve() { }
  disconnect() { }
}

global.ResizeObserver = ResizeObserver;

// Mock svg asset in tests, click event for A346
const clickMock = vi.fn()

vi.mock('../src/assets/exactum-3.svg?react', () => ({
  default: ({ ref }) => (
    <svg ref={ref}>
      <g data-room-id='A346' _status='available' onClick={clickMock}>
        <rect id='A346' />
      </g>
      <g data-room-id='A348' _status='reserved'>
        <rect id='A348' />
      </g>
      <g data-room-id='A311' _status='unavailable'>
        <rect id='A311' />
      </g>
    </svg>
  ),
}));

describe('Floorplan', () => {
  test('floorplan is rendered correctly', async () => {
    render(<MemoryRouter><Floorplan /></MemoryRouter>);

    const room = document.querySelector('[data-room-id="A346"]')
    expect(room).toBeInTheDocument();
  });

  test('correct amount of rooms is rendered', () => {
    render(<MemoryRouter><Floorplan /></MemoryRouter>);

    const rooms = document.querySelectorAll('g[data-room-id]');
    expect(rooms.length).toBe(3);
  })

  test('zoom buttons exist', () => {
    render(<MemoryRouter><Floorplan /></MemoryRouter>);

    expect(screen.getByText(/Zoom In/i)).toBeInTheDocument();
    expect(screen.getByText(/Zoom Out/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
  })

  test('clicking room is possible', async () => {
    const user = userEvent.setup();

    render(<MemoryRouter><Floorplan /></MemoryRouter>);

    const room = document.querySelector('[data-room-id="A346"]');
    await user.click(room)

    expect(clickMock).toHaveBeenCalled();
  })

  test('url parameters work', async () => {
    render(<MemoryRouter initialEntries={['/?floor=2']}><Floorplan /></MemoryRouter>);

    const room = document.querySelector('[data-room-id="B233"]')
    expect(room).toBeInTheDocument();
  })

  test('bulletin board can be accessed', async () => {
    const user = userEvent.setup();

    render(<MemoryRouter><App /></MemoryRouter>);

    const bulletinBoardButton = await screen.findByText('Bulletin Board');
    await user.click(bulletinBoardButton);

    const addFileButton = await screen.findByText('Add file');
    expect(addFileButton).toBeInTheDocument();
  })

  test('qr code to upload files appears', async () => {
    const user = userEvent.setup();

    render(<MemoryRouter><App /></MemoryRouter>);

    const bulletinBoardButton = await screen.findByText('Bulletin Board');
    await user.click(bulletinBoardButton);

    const addFileButton = await screen.findByText('Add file');
    await user.click(addFileButton);

    const popup = document.getElementById('popup');
    expect(popup.classList.contains('open-popup')).toBe(true);
  })

  test('qr code can be closed', async () => {
    const user = userEvent.setup();

    render(<MemoryRouter><App /></MemoryRouter>);

    const bulletinBoardButton = await screen.findByText('Bulletin Board');
    await user.click(bulletinBoardButton);

    const addFileButton = await screen.findByText('Add file');
    await user.click(addFileButton);

    const closeButton = await screen.findByText('Close');
    await user.click(closeButton);

    const popup = document.getElementById('popup');
    expect(popup.classList.contains('open-popup')).toBe(false);
  })
});
