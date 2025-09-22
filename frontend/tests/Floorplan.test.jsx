import { render, screen } from '@testing-library/react';
import Floorplan from '../src/Floorplan';
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
    render(<Floorplan />);

    const room = document.querySelector('[data-room-id="A346"]')
    expect(room).toBeInTheDocument();
  });

  test('correct amount of rooms is rendered', () => {
    render(<Floorplan />);

    const rooms = document.querySelectorAll('g[data-room-id]');
    expect(rooms.length).toBe(3);
  })

  test('zoom buttons exist', () => {
    render(<Floorplan />);

    expect(screen.getByText(/Zoom In/i)).toBeInTheDocument();
    expect(screen.getByText(/Zoom Out/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
  })

  test('clicking room is possible', async () => {
    const user = userEvent.setup();

    render(<Floorplan />)

    const room = document.querySelector('[data-room-id="A346"]');
    await user.click(room)

    expect(clickMock).toHaveBeenCalled();
  })
});
