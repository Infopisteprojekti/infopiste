import { useMemo, useRef } from 'react';
import floors from '@/constants/floors';
import '@/styles/components/Floorplan.css';
import { useTranslation } from 'react-i18next';

import useSvgReady from '@/hooks/useSvgReady';
import useRoomsSetup from '@/hooks/useRoomsSetup';
import useRoomStatuses from '@/hooks/useRoomStatuses';
import useLocationMarker from '@/hooks/useLocationMarker';

const FloorDisplay = ({ floor, initialFloor, markerCoords }) => {
  const { t } = useTranslation();
  const { floorElement, ready, floorRef } = useSvgReady();

  const statusMapRef = useRef(new WeakMap());
  const rooms = useRoomsSetup(floorElement, ready, t, statusMapRef);
  useRoomStatuses(floorElement, ready, rooms, statusMapRef);

  const isInitialFloor = useMemo(
    () => floor === initialFloor,
    [floor, initialFloor]
  );
  useLocationMarker(floorElement, ready, isInitialFloor, markerCoords);

  const FloorSVG = floors.find(f => f.id === floor)?.svg;

  return FloorSVG ? (
    <FloorSVG ref={floorRef} data-testid="floorplan-svg" />
  ) : null;
};

export default FloorDisplay;
