import { useEffect, useRef, useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { MapPin } from 'lucide-react';

import STATUSES from '@/constants/roomStatus';
import '@/styles/components/FloorDisplay.css';

dayjs.extend(utc);

const FloorDisplay = ({
  floor,
  rooms,
  reservations,
  onRoomClick,
  svgComponent: FloorSVG,
  markerCoords,
}) => {
  const floorplanRef = useRef(null);

  const roomStatusMap = useMemo(() => {
    const now = dayjs().utc();
    const statusMap = new Map();

    rooms.forEach(room => {
      const roomReservations = reservations.filter(
        r => r.room.displayId.toLowerCase() === room.displayId.toLowerCase()
      );

      const currentReservation = roomReservations.find(
        r => dayjs.utc(r.start).isBefore(now) && dayjs.utc(r.end).isAfter(now)
      );

      statusMap.set(room.displayId, {
        status: currentReservation ? STATUSES.RESERVED : STATUSES.AVAILABLE,
        currentReservation: currentReservation || {},
        roomReservations: roomReservations,
      });
    });

    return statusMap;
  }, [rooms, reservations]);

  useEffect(() => {
    const svg = floorplanRef.current.querySelector('svg');
    if (!svg) return;

    const roomElements = svg.querySelectorAll(
      '#overlay > rect[id], #overlay > path[id]'
    );
    const handlers = [];

    roomElements.forEach(element => {
      const roomId = element.id;
      const room = rooms.find(
        r => r.displayId.toLowerCase() === roomId.toLowerCase()
      );
      const statusInfo = roomStatusMap.get(roomId) || {
        status: STATUSES.UNAVAILABLE,
        currentReservation: {},
        roomReservations: [],
      };

      // update svg rect status
      element.classList.remove(...Object.values(STATUSES));
      element.classList.add('room', statusInfo.status);

      const handleClick = () => {
        const rectBounds = element.getBoundingClientRect();

        onRoomClick({
          room: room || {
            displayId: roomId,
            displayName: roomId,
          },
          status: statusInfo.status,
          currentReservation: statusInfo.currentReservation,
          roomReservations: statusInfo.roomReservations,
          position: {
            x: rectBounds.left,
            y: rectBounds.top,
          },
        });
      };

      element.addEventListener('click', handleClick);
      handlers.push({ element, handleClick });
    });

    return () => {
      handlers.forEach(({ element, handleClick }) => {
        element.removeEventListener('click', handleClick);
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

      {markerCoords && markerCoords.floor === floor && (
        <div
          id="active-marker"
          style={{
            position: 'absolute',
            left: `${markerCoords.x}%`,
            top: `${markerCoords.y}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <MapPin color="#ff0000" fill="#ff0000" />
        </div>
      )}
    </div>
  );
};

export default FloorDisplay;
