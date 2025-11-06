import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';

import reservationService from '@/services/reservations.js';
import roomService from '@/services/rooms.js';

import floors from '@/constants/floors';
import statuses from '@/constants/roomStatus';
import '@/styles/components/Floorplan.css'

import RoomPopUp from './RoomPopUp';

const POLLING_INTERVAL = 300000; // 5 min

const FloorDisplay = ({ floor, initialFloor, markerCoords }) => {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null);
  const floorplanRef = useRef(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomService.getRooms();
        setRooms(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    const fetchReservations = async () => {
      try {
        const response = await reservationService.getReservations();
        setReservations(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchRooms();
    fetchReservations();

    const interval = setInterval(fetchReservations, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const getRoomStatus = (room) => {
    const now = new Date();
    const reservation = reservations.find(r =>
      r.room.displayId === room.displayId &&
      new Date(r.start) <= now &&
      new Date(r.end) >= now
    );

    return reservation ? statuses.RESERVED : statuses.AVAILABLE;
  };

  useEffect(() => {
    if (!floorplanRef.current) return;

    const svg = floorplanRef.current.querySelector('svg');
    if (!svg) return;

    const roomRects = svg.querySelectorAll('g > rect');

    const cleanup = [];

    roomRects.forEach(rect => {
      const roomId = rect.id;
      if (!roomId) return;

      const room = rooms.find(r => r.displayId === roomId);
      const status = room ? getRoomStatus(room) : statuses.UNKNOWN;

      rect.classList.remove(...Object.values(statuses));
      rect.classList.add('room', status);

      const handleClick = () => {
        if (room) setSelectedRoom(room);
      };

      rect.addEventListener('click', handleClick);

      cleanup.push({ rect, handleClick });
    });

    return () => {
      cleanup.forEach(({ rect, handleClick }) => {
        rect.removeEventListener('click', handleClick);
      });
    };
  }, [floor, rooms, reservations])

  const FloorSVG = floors.find(f => f.id === floor).svg;

  return (
    <div className="floorplan-wrapper" ref={floorplanRef}>
      {FloorSVG ? <FloorSVG /> : <p>{t("Floorplan not found")}</p>} 

      {selectedRoom && (
        <RoomPopUp
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};

export default FloorDisplay;
