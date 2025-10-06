import { useRef, useEffect } from 'react';
import floors from '../constants/floors';
import '../css/Floorplan.css';

const POLLING_INTERVAL = 60 * 1000; // 60 seconds

const roomStatus = {
  UNAVAILABLE: 'unavailable',
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  UNKNOWN: 'unknown',
};

const baseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi';

const FloorDisplay = ({ floor }) => {
  const floorplanRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const roomsRef = useRef([]);

  const checkActive = reservation => {
    if (reservation.start.timeZone !== 'UTC') {
      console.warn('Reservation timezone not in UTC');
    }

    const now = new Date();
    const start = new Date(reservation.start.dateTime + 'Z');
    const end = new Date(reservation.end.dateTime + 'Z');
    return start < now && end > now;
  };

  const addStatus = (room, child, status) => {
    room._status = status;
    child.classList.remove(...Object.values(roomStatus));
    child.classList.add(status);
  };

  useEffect(() => {
    const floorplan = floorplanRef.current;
    if (!floorplan) return;

    const updateStatuses = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/rooms`);
        const data = await response.json();

        for (const room of roomsRef.current) {
          const child = room.querySelector('*');
          const roomId = child?.id;
          if (!roomId) continue;

          const roomData = data.find(e => e.id === roomId);
          if (!roomData || roomData.type === 'office') {
            addStatus(room, child, roomStatus.UNAVAILABLE);
          } else {
            const activeReservations = roomData.reservations.filter(e =>
              checkActive(e)
            );
            const status =
              activeReservations.length > 0
                ? roomStatus.RESERVED
                : roomStatus.AVAILABLE;
            addStatus(room, child, status);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const rooms = Array.from(floorplan.querySelectorAll('g'));
    roomsRef.current = rooms;

    for (const room of rooms) {
      const child = room.querySelector('*');
      const roomId = child?.id;
      if (!roomId) continue;

      child.classList.add('room');
      room.setAttribute('data-room-id', roomId);

      if (!room._clickHandler) {
        const handler = () => {
          alert(`Room ${roomId} status: ${room._status ?? roomStatus.UNKNOWN}`);
        };
        room.addEventListener('click', handler);
        room._clickHandler = handler;
      }
    }

    updateStatuses();
    pollingIntervalRef.current = setInterval(updateStatuses, POLLING_INTERVAL);

    return () => {
      clearInterval(pollingIntervalRef.current);
      for (const room of roomsRef.current) {
        if (room._clickHandler) {
          room.removeEventListener('click', room._clickHandler);
          delete room._clickHandler;
        }
      }
    };
  }, [floor]);

  const FloorSVG = floors.find(f => f.id === floor)?.svg;
  return <FloorSVG ref={floorplanRef} />;
};

export default FloorDisplay;
