import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RoomPopup from '@/components/RoomPopup';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
  }),
}));

describe('RoomPopup', () => {
  const mockRoom = {
    displayName: 'Room A255',
    displayId: 'A255',
    status: 'reserved',
    capacity: 10,
    floorNumber: 3,
    isWheelChairAccessible: true,
    currentReservation: {
      start: '2025-11-13T10:00:00Z',
      end: '2025-11-13T11:00:00Z',
    },
  };

  const mockPosition = { x: 100, y: 100 };
  const mockOnClose = vi.fn();

  it('renders room information correctly', () => {
    render(<RoomPopup room={mockRoom} position={mockPosition} onClose={mockOnClose} />);

    expect(screen.getByText('Room A255')).toBeInTheDocument();
    expect(screen.getByText('room-status.reserved')).toBeInTheDocument();

    expect(screen.getByText('12:00 - 13:00')).toBeInTheDocument();

    expect(screen.getByText(/10 persons/)).toBeInTheDocument();
    expect(screen.getByText(/floor 3/i)).toBeInTheDocument();
    expect(screen.getByText('yes')).toBeInTheDocument();
  });

  it('displays correctly when room data is missing', () => {
    const incompleteRoom = {
      displayName: 'A255',
      status: 'unavailable',
      capacity: null,
      floorNumber: null,
      isWheelChairAccessible: null,
      currentReservation: {},
    };

    render(
      <RoomPopup room={incompleteRoom} position={mockPosition} onClose={mockOnClose} />
    );

    // capacity
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);

    // accessibility defaults to "no"
    expect(screen.getByText('no')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<RoomPopup room={mockRoom} position={mockPosition} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking outside the popup', () => {
    render(<RoomPopup room={mockRoom} position={mockPosition} onClose={mockOnClose} />);

    fireEvent.pointerDown(document.body);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the popup', () => {
    render(<RoomPopup room={mockRoom} position={mockPosition} onClose={mockOnClose} />);

    fireEvent.pointerDown(screen.getByText('Room A255'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});