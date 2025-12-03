import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import FloorDisplay from '@/components/FloorDisplay';
import STATUSES from '@/constants/roomStatus';

describe('FloorDisplay', () => {
  const mockRooms = [
    { id: 1, displayId: 'R101', displayName: 'Room 101', floorNumber: 3 },
    { id: 2, displayId: 'R102', displayName: 'Room 102', floorNumber: 3 },
  ];

  const mockReservations = [
    {
      id: 1,
      room: { displayId: 'R101' },
      start: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      end: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    },
  ];

  const mockOnRoomClick = vi.fn();

  const MockSVG = () => (
    <svg data-testid="mock-svg">
      <g id="overlay">
        <rect id="R101" data-testid="room-R101" />
        <rect id="R102" data-testid="room-R102" />
        <rect id="R103" data-testid="room-R103" />
      </g>
      {/* elements outside the overlay layer of the svg should not be modified */}
      <rect id="FloorplanPillar" data-testid="FloorplanPillar" />
    </svg>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders SVG component', () => {
    const { getByTestId } = render(
      <FloorDisplay
        floor={3}
        rooms={mockRooms}
        reservations={mockReservations}
        onRoomClick={mockOnRoomClick}
        svgComponent={MockSVG}
      />
    );

    expect(getByTestId('mock-svg')).toBeInTheDocument();
  });

  it('applies correct status classes to rooms', async () => {
    const { getByTestId } = render(
      <FloorDisplay
        floor={3}
        rooms={mockRooms}
        reservations={mockReservations}
        onRoomClick={mockOnRoomClick}
        svgComponent={MockSVG}
      />
    );

    await waitFor(() => {
      const reservedRoom = getByTestId('room-R101');
      expect(reservedRoom.classList.contains(STATUSES.RESERVED)).toBe(true);
      expect(reservedRoom.classList.contains('room')).toBe(true);

      const availableRoom = getByTestId('room-R102');
      expect(availableRoom.classList.contains(STATUSES.AVAILABLE)).toBe(true);

      const unavailableRoom = getByTestId('room-R103');
      expect(unavailableRoom.classList.contains(STATUSES.UNAVAILABLE)).toBe(true);
    });
  });

  it('does not modify elements outside #overlay', async () => {
    const { getByTestId } = render(
      <FloorDisplay
        floor={3}
        rooms={mockRooms}
        reservations={mockReservations}
        onRoomClick={mockOnRoomClick}
        svgComponent={MockSVG}
      />
    );

    await waitFor(() => {
      const floorplanPillar = getByTestId('FloorplanPillar');
      // should not have room class applied
      expect(floorplanPillar.classList.contains('room')).toBe(false);
    });
  });  

  it('calls onRoomClick with correct data when room is clicked', async () => {
    const { getByTestId } = render(
      <FloorDisplay
        floor={3}
        rooms={mockRooms}
        reservations={mockReservations}
        onRoomClick={mockOnRoomClick}
        svgComponent={MockSVG}
      />
    );

    await waitFor(() => {
      const room = getByTestId('room-R101');
      fireEvent.click(room);
    });

    expect(mockOnRoomClick).toHaveBeenCalledWith(
      expect.objectContaining({
        room: expect.objectContaining({
          displayId: 'R101',
          displayName: 'Room 101',
        }),
        status: STATUSES.RESERVED,
        currentReservation: expect.objectContaining({
          room: { displayId: 'R101' },
        }),
        position: expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
        }),
      })
    );
  });

  it('handles click on unknown room', async () => {
    const { getByTestId } = render(
      <FloorDisplay
        floor={3}
        rooms={mockRooms}
        reservations={mockReservations}
        onRoomClick={mockOnRoomClick}
        svgComponent={MockSVG}
      />
    );

    await waitFor(() => {
      const unknownRoom = getByTestId('room-R103');
      fireEvent.click(unknownRoom);
    });

    expect(mockOnRoomClick).toHaveBeenCalledWith(
      expect.objectContaining({
        room: expect.objectContaining({
          displayId: 'R103',
          displayName: 'R103',
        }),
        status: STATUSES.UNAVAILABLE,
      })
    );
  });

  it('updates room statuses when reservations change', async () => {
    const { getByTestId, rerender } = render(
      <FloorDisplay
        floor={3}
        rooms={mockRooms}
        reservations={[]}
        onRoomClick={mockOnRoomClick}
        svgComponent={MockSVG}
      />
    );

    await waitFor(() => {
      const room = getByTestId('room-R101');
      expect(room.classList.contains(STATUSES.AVAILABLE)).toBe(true);
    });

    rerender(
      <FloorDisplay
        floor={3}
        rooms={mockRooms}
        reservations={mockReservations}
        onRoomClick={mockOnRoomClick}
        svgComponent={MockSVG}
      />
    );

    await waitFor(() => {
      const room = getByTestId('room-R101');
      expect(room.classList.contains(STATUSES.RESERVED)).toBe(true);
    });
  });

  it('cleans up event listeners on unmount', async () => {
    const { getByTestId, unmount } = render(
      <FloorDisplay
        floor={3}
        rooms={mockRooms}
        reservations={mockReservations}
        onRoomClick={mockOnRoomClick}
        svgComponent={MockSVG}
      />
    );

    const room = getByTestId('room-R101');
    const removeEventListenerSpy = vi.spyOn(room, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });
});