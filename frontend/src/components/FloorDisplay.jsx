import { useRef, useEffect } from 'react';
import roomService from '../services/rooms.js';
import floors from '../constants/floors';
import roomStatus from '../constants/roomStatus';
import '../styles/components/Floorplan.css';
import { useTranslation } from 'react-i18next';

const POLLING_INTERVAL = 60 * 1000; // 60 seconds

const FloorDisplay = ({ floor, initialFloor, markerCoords }) => {
  const { t } = useTranslation();

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

    const prevMarker = floorplan.querySelector('.location-marker');
    if (prevMarker) prevMarker.remove();

    const updateStatuses = async () => {
      const data = await roomService.getRooms();

      for (const room of roomsRef.current) {
        const child = room.querySelector('*');
        const roomId = child?.id;
        if (!roomId) continue;

        if (!data) {
          addStatus(room, child, roomStatus.UNAVAILABLE);
          continue;
        }

        const roomData = data?.find(
          e => e.id.toLowerCase() === roomId.toLowerCase()
        );
        if (!roomData || roomData.type === 'office') {
          addStatus(room, child, roomStatus.UNAVAILABLE);
          continue;
        }

        const activeReservations = roomData.reservations.filter(e =>
          checkActive(e)
        );
        const status =
          activeReservations.length > 0
            ? roomStatus.RESERVED
            : roomStatus.AVAILABLE;
        addStatus(room, child, status);
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
          alert(
            t('room-status-message', {
              roomId,
              status: t(`room-status.${room._status ?? roomStatus.UNKNOWN}`),
            })
          );
        };
        room.addEventListener('click', handler);
        room._clickHandler = handler;
      }
    }

    updateStatuses();
    pollingIntervalRef.current = setInterval(updateStatuses, POLLING_INTERVAL);

    if (floor === initialFloor && markerCoords?.length === 2) {
      const [posx, posy] = markerCoords;

      const marker = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      );
      marker.setAttribute('cx', posx);
      marker.setAttribute('cy', posy);
      marker.setAttribute('r', 20);
      marker.classList.add('location-marker');

      floorplanRef.current.appendChild(marker);
    }

    return () => {
      clearInterval(pollingIntervalRef.current);
      for (const room of roomsRef.current) {
        if (room._clickHandler) {
          room.removeEventListener('click', room._clickHandler);
          delete room._clickHandler;
        }
      }
    };
  }, [floor, initialFloor, markerCoords, t]);

  const FloorSVG = floors.find(f => f.id === floor)?.svg;
  return <FloorSVG ref={floorplanRef} data-testid="floorplan-svg" />;
};

export default FloorDisplay;
