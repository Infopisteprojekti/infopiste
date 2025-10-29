import { useCallback, useEffect, useRef } from 'react';
import roomStatus from '@/constants/roomStatus';
import { addStatusToChild, checkActive } from '@/utils/floorplan';

const POLLING_INTERVAL_SECONDS = 60;

const baseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi';

const useRoomStatuses = (floorElement, ready, rooms, statusMapRef) => {
  const intervalRef = useRef(null);
  const abortRef = useRef(null);

  const fetchRoomData = useCallback(async signal => {
    const res = await fetch(`${baseUrl}/api/rooms`, { signal });
    if (!res.ok) throw new Error(`Error fetching room data: ${res.status}`);
    const data = await res.json();
    if (data?.error) throw new Error(data.error);
    return data;
  }, []);

  const updateStatuses = useCallback(
    async signal => {
      if (!ready || !floorElement) return;

      let data = null;
      try {
        data = await fetchRoomData(signal);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
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
    },
    [fetchRoomData, ready, rooms, floorElement]
  );

  useEffect(() => {
    if (!ready || !floorElement || rooms.length === 0) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    updateStatuses(abortRef.current.signal);

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      updateStatuses(abortRef.current.signal);
    }, POLLING_INTERVAL_SECONDS * 1000);

    return () => {
      clearInterval(intervalRef.current);
      abortRef.current?.abort();
    };
  }, [ready, floorElement, rooms, updateStatuses]);

  return statusMapRef;
};

export default useRoomStatuses;
