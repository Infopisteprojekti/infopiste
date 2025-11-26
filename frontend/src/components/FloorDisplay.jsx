import { useEffect, useRef, useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

import STATUSES from '@/constants/roomStatus';
import '@/styles/components/FloorDisplay.css';

dayjs.extend(utc);

const FloorDisplay = ({
  floor,
  rooms,
  reservations,
  onRoomClick,
  svgComponent: FloorSVG,
}) => {
  const floorplanRef = useRef(null);

  const roomStatusMap = useMemo(() => {
    const now = dayjs().utc();
    const statusMap = new Map();

    rooms.forEach(room => {
      const roomReservations = reservations.filter(
        r => r.room.displayId === room.displayId
      );

      const currentReservation = roomReservations.find(
        r => dayjs.utc(r.start).isBefore(now) && dayjs.utc(r.end).isAfter(now)
      );

      statusMap.set(room.displayId, {
        status: currentReservation ? STATUSES.RESERVED : STATUSES.AVAILABLE,
        currentReservation,
        roomReservations: roomReservations,
      });
    });

    return statusMap;
  }, [rooms, reservations]);

  useEffect(() => {
    const svg = floorplanRef.current.querySelector('svg');
    if (!svg) return;

    const roomRects = svg.querySelectorAll('g > rect[id]');
    const handlers = [];

    roomRects.forEach(rect => {
      const roomId = rect.id;
      const room = rooms.find(r => r.displayId === roomId);
      const statusInfo = roomStatusMap.get(roomId) || {
        status: STATUSES.UNAVAILABLE,
        currentReservation: {},
        roomReservations: [],
      };

      // update svg rect status
      rect.classList.remove(...Object.values(STATUSES));
      rect.classList.add('room', statusInfo.status);

      const handleClick = () => {
        const rectBounds = rect.getBoundingClientRect();

        onRoomClick({
          room: room || {
            displayId: roomId,
            displayName: roomId,
            status: STATUSES.UNKNOWN,
          },
          status: statusInfo.status,
          currentReservation: statusInfo.currentReservation,
          roomReservations: statusInfo.roomReservations,
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
  }, [floor, rooms, reservations, roomStatusMap, onRoomClick]);

  return (
    <div
      className="floorplan-wrapper"
      ref={floorplanRef}
      data-testid="floorplan-svg"
    >
      <FloorSVG />
    </div>
  );
};

export default FloorDisplay;
