import { useEffect, useRef } from 'react';
import roomStatus from '@/constants/roomStatus';
import { addStatusToChild, checkActive } from '@/utils/floorplan';
import roomService from '@/services/rooms';

const POLLING_INTERVAL_SECONDS = 60;

const useRoomStatuses = (floorElement, ready, rooms, statusMapRef) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!ready || !floorElement || rooms.length === 0) return;

    const updateStatuses = async () => {
      let data = null;
      try {
        data = await roomService.getRooms();
      } catch (error) {
        console.error(error);
      }

      for (const room of rooms) {
        const child = room.querySelector('*');
        const roomId = child?.id;
        if (!roomId || !child) continue;

        if (!data) {
          addStatusToChild(child, roomStatus.UNAVAILABLE);
          statusMapRef.current.set(room, roomStatus.UNAVAILABLE);
          continue;
        }

        const roomData = data.find(
          e => e.id?.toLowerCase() === roomId.toLowerCase()
        );
        if (!roomData || roomData.type === 'office') {
          addStatusToChild(child, roomStatus.UNAVAILABLE);
          statusMapRef.current.set(room, roomStatus.UNAVAILABLE);
          continue;
        }

        const activeReservations = (roomData.reservations || []).filter(
          checkActive
        );
        const status =
          activeReservations.length > 0
            ? roomStatus.RESERVED
            : roomStatus.AVAILABLE;

        addStatusToChild(child, status);
        statusMapRef.current.set(room, status);
      }
    };

    updateStatuses();
    intervalRef.current = setInterval(
      updateStatuses,
      POLLING_INTERVAL_SECONDS * 1000
    );

    return () => clearInterval(intervalRef.current);
  }, [ready, floorElement, rooms, statusMapRef]);

  return statusMapRef;
};

export default useRoomStatuses;
