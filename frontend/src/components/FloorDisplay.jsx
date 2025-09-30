import { useRef, useEffect } from 'react';
import Floor1SVG from '../assets/exactum-1.svg?react';
import Floor2SVG from '../assets/exactum-2.svg?react';
import Floor3SVG from '../assets/exactum-3.svg?react';
import '../css/Floorplan.css';

const statuses = {
  UNAVAILABLE: 'unavailable',
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  UNKNOWN: 'unknown',
};
const baseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi';

const floors = {
  1: Floor1SVG,
  2: Floor2SVG,
  3: Floor3SVG,
};

const FloorDisplay = ({ floor }) => {
  const floorplanRef = useRef(null);
  const FloorSVG = floors[floor];

  useEffect(() => {
    const floorplan = floorplanRef.current;
    let rooms = [];

    const checkActive = reservation => {
      const now = new Date();
      const start = new Date(reservation.start.dateTime);
      const end = new Date(reservation.end.dateTime);
      return start < now && end > now;
    };

    const addStatus = (room, child, status) => {
      room._status = status;
      child.classList.remove(...Object.values(statuses));
      child.classList.add(status);
    };

    const fetchStatuses = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/rooms`);
        const data = await response.json();

        rooms = Array.from(floorplan.querySelectorAll('g'));
        for (const room of rooms) {
          const child = room.querySelector('*');
          const roomId = child?.id;
          if (!roomId) continue;

          child.classList.add('room');
          room.setAttribute('data-room-id', roomId);

          const roomData = data.find(e => e.id === roomId);
          if (!roomData || roomData.type === 'office') {
            addStatus(room, child, statuses.UNAVAILABLE);
          } else {
            const reservations = roomData.reservations;
            const activeReservations = reservations.filter(e => checkActive(e));
            const status =
              activeReservations.length > 0
                ? statuses.RESERVED
                : statuses.AVAILABLE;
            addStatus(room, child, status);
          }

          const handler = () => {
            alert(`Room ${roomId} status: ${room._status ?? statuses.UNKNOWN}`);
          };

          if (!room._clickHandler) {
            room.addEventListener('click', handler);
            room._clickHandler = handler;
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (floorplan) fetchStatuses();

    return () => {
      for (const room of rooms) {
        if (room._clickHandler) {
          room.removeEventListener('click', room._clickHandler);
          delete room._clickHandler;
        }
      }
    };
  }, [floor]);

  return <FloorSVG ref={floorplanRef} data-testid='floorplan-svg'/>;
};

export default FloorDisplay;
