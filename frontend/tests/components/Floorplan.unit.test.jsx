import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Floorplan from '@/components/Floorplan';
import reservationService from '@/services/reservations';
import roomService from '@/services/rooms';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => params ? `${key}-${params.label}` : key,
  }),
}));

vi.mock('@/services/reservations');
vi.mock('@/services/rooms');
vi.mock('@/constants/floors', () => ({
  default: [
    { id: 3, label: '3', svg: () => <svg data-testid="floor-3-svg" /> },
    { id: 4, label: '4', svg: () => <svg data-testid="floor-4-svg" /> },
  ],
}));

vi.mock('@/hooks/useAppSettings', () => ({
  useAppSettings: () => ({
    settings: {
      lang: 'en',
      floor: 3,
      marker: null,
    },
    setSettings: vi.fn(),
  }),
}));


vi.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: ({ children }) => (
    <div data-testid="transform-wrapper">
      {children({
        zoomIn: vi.fn(),
        zoomOut: vi.fn(),
        resetTransform: vi.fn(),
      })}
    </div>
  ),
  TransformComponent: ({ children }) => (
    <div data-testid="transform-component">{children}</div>
  ),
}));

vi.mock('@/components/FloorDisplay', () => ({
  default: ({ floor, onRoomClick, svgComponent: SVG }) => (
    <div data-testid="floor-display" data-floor={floor}>
      <SVG />
      <button
        data-testid="mock-room-click"
        onClick={() =>
          onRoomClick({
            room: { id: 1, displayName: 'Test Room' },
            status: 'available',
            currentReservation: {},
            roomReservations: [],
            position: { x: 100, y: 100 },
          })
        }
      >
        Click Room
      </button>
    </div>
  ),
}));

vi.mock('@/components/RoomPopup', () => ({
  default: ({ room, onClose }) => (
    <div data-testid="room-popup">
      <p>{room.displayName}</p>
      <button data-testid="close-popup" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

describe('Floorplan', () => {
  const mockRooms = [
    { id: 1, displayId: 'R101', displayName: 'Room 101', floorNumber: 3 },
  ];

  const mockReservations = [
    { id: 1, room: { displayId: 'R101' }, start: '2025-11-13T10:00:00Z' },
  ];

  beforeEach(() => {
    roomService.getRooms.mockResolvedValue({ data: mockRooms });
    reservationService.getReservations.mockResolvedValue({
      data: mockReservations,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders floorplan with controls', async () => {
    render(<Floorplan />);

    await waitFor(() => {
      expect(screen.getByTestId('zoom-in-button')).toBeInTheDocument();
    });

    expect(screen.getByTestId('zoom-out-button')).toBeInTheDocument();
    expect(screen.getByTestId('zoom-reset-button')).toBeInTheDocument();
  });

  it('fetches rooms and reservations on mount', async () => {
    render(<Floorplan />);

    await waitFor(() => {
      expect(roomService.getRooms).toHaveBeenCalled();
      expect(reservationService.getReservations).toHaveBeenCalled();
    });
  });

  it('changes floor when floor button is clicked', async () => {
    render(<Floorplan />);

    await waitFor(() => {
      expect(screen.getByTestId('floor-display')).toHaveAttribute('data-floor', '3');
    });

    const floor4Button = screen.getByText('floorplan-toolbar.floor-label-4');
    fireEvent.click(floor4Button);

    expect(screen.getByTestId('floor-display')).toHaveAttribute('data-floor', '4');
  });

  it('displays room popup when room is clicked', async () => {
    render(<Floorplan />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-room-click')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('mock-room-click'));

    expect(screen.getByTestId('room-popup')).toBeInTheDocument();
    expect(screen.getByText('Test Room')).toBeInTheDocument();
  });

  it('closes popup when close button is clicked', async () => {
    render(<Floorplan />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-room-click')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('mock-room-click'));
    expect(screen.getByTestId('room-popup')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-popup'));
    expect(screen.queryByTestId('room-popup')).not.toBeInTheDocument();
  });

  it('renders legend with room statuses', async () => {
    render(<Floorplan />);

    await waitFor(() => {
      expect(screen.getByText('room-status.available')).toBeInTheDocument();
    });

    expect(screen.getByText('room-status.reserved')).toBeInTheDocument();
    expect(screen.getByText('room-status.unavailable')).toBeInTheDocument();
  });
});