import { useEffect, useRef, useState } from 'react';
import roomStatus from '@/constants/roomStatus';

const useRoomsSetup = (floorElement, ready, t, statusMapRef) => {
  const [rooms, setRooms] = useState([]);
  const listenersRef = useRef(new WeakMap());

  useEffect(() => {
    if (!ready || !floorElement) return;

    const allGroups = Array.from(floorElement.querySelectorAll('g'));
    const roomGroups = allGroups.filter(g => g.querySelector('*')?.id);

    for (const room of roomGroups) {
      const child = room.querySelector('*');
      const roomId = child?.id;
      if (!roomId || !child) continue;

      child.classList.add('room');
      room.setAttribute('data-room-id', roomId);

      if (!listenersRef.current.has(room)) {
        const handler = () => {
          const currentStatus =
            statusMapRef.current.get(room) ?? roomStatus.UNKNOWN;
          alert(
            t('room-status-message', {
              roomId,
              status: t(`room-status.${currentStatus}`),
            })
          );
        };
        room.addEventListener('click', handler);
        listenersRef.current.set(room, handler);
      }
    }

    setRooms(roomGroups);

    const listenersSnapshot = listenersRef.current;
    const roomsSnapshot = [...roomGroups];

    return () => {
      for (const room of roomsSnapshot) {
        const handler = listenersSnapshot.get(room);
        if (handler) {
          room.removeEventListener('click', handler);
          listenersSnapshot.delete(room);
        }
      }
    };
  }, [ready, floorElement, t, statusMapRef]);

  return rooms;
};

export default useRoomsSetup;
