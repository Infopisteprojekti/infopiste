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
    expect(screen.getByTestId('room-status')).toHaveTextContent('room-status.reserved');
    expect(screen.getByTestId('room-reservation')).toHaveTextContent('12:00');
    expect(screen.getByTestId('room-reservation')).toHaveTextContent('13:00');
    expect(screen.getByTestId('room-floor')).toHaveTextContent('3');
    expect(screen.getByTestId('room-capacity')).toHaveTextContent('10');
    expect(screen.getByTestId('room-accesible')).toHaveTextContent('yes');
  });

  it('displays unknown when room data is missing', () => {
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

    expect(screen.getByTestId('room-floor')).toHaveTextContent('unknown');
    expect(screen.getByTestId('room-capacity')).toHaveTextContent('unknown');
    expect(screen.getByTestId('room-accesible')).toHaveTextContent('unknown');  });

  it('calls onClose when close button is clicked', () => {
    render(<RoomPopup room={mockRoom} position={mockPosition} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('x'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking outside the popup', () => {
    const { container } = render(
      <RoomPopup room={mockRoom} position={mockPosition} onClose={mockOnClose} />
    );

    fireEvent.mouseDown(container);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the popup', () => {
    render(<RoomPopup room={mockRoom} position={mockPosition} onClose={mockOnClose} />);

    fireEvent.mouseDown(screen.getByText('Room A255'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});