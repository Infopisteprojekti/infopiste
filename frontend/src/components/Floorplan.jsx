import { useState, useEffect, useRef, useCallback } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAppSettings } from '@/hooks/useAppSettings.js';

import FloorDisplay from '@/components/FloorDisplay';
import RoomPopup from '@/components/RoomPopup';

import reservationService from '@/services/reservations.js';
import roomService from '@/services/rooms.js';
import '@/styles/components/Floorplan.css';
import FLOORS from '@/constants/floors';

const POLLING_INTERVAL = 30000; // 30 seconds

const Floorplan = () => {
  const { t } = useTranslation();
  const { settings, setSettings } = useAppSettings();

  const [floor, setFloor] = useState(Number(settings.floor) || 3);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [popUpPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const transformRef = useRef(null);

  useEffect(() => {
    setFloor(settings.floor);
    setSelectedRoom(null);

    if (settings.marker && settings.marker.floor === settings.floor) {
      const { x, y } = settings.marker;

      setTimeout(() => {
        transformRef.current?.zoomToElement('active-marker', 2, 500, 'easeOut');
      }, 100);
    } else {
      transformRef.current?.resetTransform();
    }
  }, [settings.floor, settings.marker, settings.resetToken]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomService.getRooms();
        setRooms(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await reservationService.getReservations();
        setReservations(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([fetchRooms(), fetchReservations()]);

    const interval = setInterval(fetchReservations, POLLING_INTERVAL);
    return () => clearInterval(interval);
  });

  const handleRoomClick = useCallback(
    ({ room, status, currentReservation, roomReservations, position }) => {
      setSelectedRoom({
        ...room,
        status,
        currentReservation: currentReservation,
        roomReservations: roomReservations,
      });
      setPopupPosition(position);
    },
    []
  );

  const handleFloorChange = newFloor => {
    setFloor(newFloor);
    setSelectedRoom(null);
    setSettings({ ...settings, floor: newFloor });
    transformRef.current?.resetTransform();
  };

  const currentFloorSVG = FLOORS.find(f => f.id === floor).svg;

  return (
    <div className="floorplan-container">
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.5}
        maxScale={5}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="zoom-controls">
              <button
                className="zoom-button"
                onClick={() => zoomIn()}
                data-testid="zoom-in-button"
              >
                <Plus size={16} />
              </button>
              <button
                className="zoom-button"
                onClick={() => zoomOut()}
                data-testid="zoom-out-button"
              >
                <Minus size={16} />
              </button>
              <button
                className="zoom-button"
                onClick={() => resetTransform()}
                data-testid="zoom-reset-button"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <div className="room-legend">
              <span className="legend-item available">
                {t('room-status.available')}
              </span>
              <span className="legend-item reserved">
                {t('room-status.reserved')}
              </span>
              <span className="legend-item unavailable">
                {t('room-status.unavailable')}
              </span>
            </div>

            <div className="floor-selector">
              {FLOORS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleFloorChange(id)}
                  className={`floor-button ${id === floor ? 'active' : ''}`}
                >
                  {t('floorplan-toolbar.floor-label', { label })}
                </button>
              ))}
            </div>

            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <FloorDisplay
                floor={floor}
                rooms={rooms}
                reservations={reservations}
                onRoomClick={handleRoomClick}
                svgComponent={currentFloorSVG}
                markerCoords={settings.marker}
              />
            </TransformComponent>

            {selectedRoom && (
              <RoomPopup
                room={selectedRoom}
                position={popUpPosition}
                onClose={() => setSelectedRoom(null)}
              />
            )}
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default Floorplan;
