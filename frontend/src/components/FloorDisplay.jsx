import { useRef, useEffect, useState } from 'react';
import floors from '../constants/floors';
import roomStatus from '../constants/roomStatus';
import RoomPopUp from './RoomPopUp';
import '../styles/components/Floorplan.css';
import { useTranslation } from 'react-i18next';

const POLLING_INTERVAL = 60 * 1000; // 60 seconds

const baseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi';

const FloorDisplay = ({ floor, initialFloor, markerCoords }) => {
  const { t } = useTranslation();

  const floorplanRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const roomsRef = useRef([]);
  const roomStatuses = useRef(new Map());
  const [roomPopUp, setRoomPopUp] = useState(null);

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
    roomStatuses.current.set(child.id, status);
    child.classList.remove(...Object.values(roomStatus));
    child.classList.add(status);
  };

  useEffect(() => {
    const floorplan = floorplanRef.current;
    if (!floorplan) return;

    const prevMarker = floorplan.querySelector('.location-marker');
    if (prevMarker) prevMarker.remove();

    const fetchRoomData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/rooms`);
        if (!response.ok)
          throw new Error(`Error fetching room data: ${response.status}`);

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const updateStatuses = async () => {
      const data = await fetchRoomData();

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

    const handleRoomClick = event => {
      const child = event.currentTarget.querySelector('*');
      const roomId = child?.id;
      const status = roomStatuses.current.get(roomId) ?? roomStatus.UNKNOWN;

      setRoomPopUp({
        roomId,
        status,
      });
    };

    for (const room of rooms) {
      const child = room.querySelector('*');
      const roomId = child?.id;
      if (!roomId) continue;

      child.classList.add('room');
      room.setAttribute('data-room-id', roomId);
      room.addEventListener('click', handleRoomClick);
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
        room.removeEventListener('click', handleRoomClick);
      }
      roomsRef.current = [];
    };
  }, [floor, initialFloor, markerCoords, t]);

  const FloorSVG = floors.find(f => f.id === floor)?.svg;

  return (
    <div className="floorplan-wrapper">
      <FloorSVG ref={floorplanRef} data-testid="floorplan-svg" />

      {roomPopUp && (
        <RoomPopUp
          roomId={roomPopUp.roomId}
          status={roomPopUp.status}
          onClose={() => setRoomPopUp(null)}
        />
      )}
    </div>
  );
};

export default FloorDisplay;
