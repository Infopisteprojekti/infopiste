import { useEffect, useRef } from 'react';

import STATUSES from '@/constants/roomStatus';
import '@/styles/components/FloorDisplay.css';

const FloorDisplay = ({
  floor,
  rooms,
  reservations,
  onRoomClick,
  svgComponent: FloorSVG,
}) => {
  const floorplanRef = useRef(null);

  useEffect(() => {
    const svg = floorplanRef.current.querySelector('svg');
    if (!svg) return;

    const roomRects = svg.querySelectorAll('g > rect[id]');
    const handlers = [];

    const getRoomStatus = roomDisplayId => {
      const now = new Date();
      const reservation = reservations.find(
        r =>
          r.room.displayId === roomDisplayId &&
          new Date(r.start) <= now &&
          new Date(r.end) >= now
      );

      const room = rooms.find(r => r.displayId === roomDisplayId);

      if (reservation && room) {
        return { status: STATUSES.RESERVED, reservation };
      }
      return { status: room ? STATUSES.AVAILABLE : STATUSES.UNAVAILABLE };
    };

    roomRects.forEach(rect => {
      const roomId = rect.id;
      const { status, reservation } = getRoomStatus(roomId);
      const room = rooms.find(r => r.displayId === roomId);

      rect.classList.remove(...Object.values(STATUSES));
      rect.classList.add('room', status);

      const handleClick = event => {
        const rectBounds = rect.getBoundingClientRect();

        onRoomClick({
          room: room || {
            displayId: roomId,
            displayName: roomId,
            status: STATUSES.UNKNOWN,
          },
          status,
          currentReservation: reservation || {},
          position: {
            x: rectBounds.left + rectBounds.width / 2,
            y: rectBounds.top,
          },
        });
      };

      rect.addEventListener('click', handleClick);
      handlers.push({ rect, handleClick });
    });

    return () => {
      handlers.forEach(({ rect, handleClick }) => {
        rect.removeEventListener('click', handleClick);
      });
    };
  }, [floor, rooms, reservations, onRoomClick]);

  return (
    <div className="floorplan-wrapper" ref={floorplanRef}>
      <FloorSVG />
    </div>
  );
};

export default FloorDisplay;
