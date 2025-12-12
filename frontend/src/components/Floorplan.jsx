import { useState, useEffect, useRef, useCallback } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAppSettings } from '@/hooks/useAppSettings.js';
import { fetchWithRetry } from '@/utils/floorplan_helper';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [floorMenuStatus, setfloorMenuStatus] = useState(false);

  const transformRef = useRef(null);
  const currentFloorSVG = FLOORS.find(f => f.id === floor).svg;

  useEffect(() => {
    setFloor(settings.floor);
    setSelectedRoom(null);

    if (settings.marker && settings.marker.floor === settings.floor) {
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
        const response = await fetchWithRetry(() => roomService.getRooms());
        setRooms(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await fetchWithRetry(() =>
          reservationService.getReservations()
        );
        setReservations(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchInitialData = async () => {
      setSettings(s => ({ ...s, loading: true }));

      try {
        await Promise.all([fetchRooms(), fetchReservations()]);
      } catch (err) {
        console.error(err);
      } finally {
        setSettings(s => ({ ...s, loading: false }));
      }
    };

    fetchInitialData();

    const interval = setInterval(fetchReservations, POLLING_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (newFloor === floor) return;

    setIsTransitioning(true);
    setSelectedRoom(null);

    setTimeout(() => {
      setFloor(newFloor);
      setSettings({ ...settings, floor: newFloor });
      transformRef.current?.resetTransform();

      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 200);
  };

  const handleFloorsMenu = () => {
    setfloorMenuStatus(!floorMenuStatus);
  };

  return (
    <div className="floorplan-container">
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.5}
        maxScale={5}
        centerOnInit={true}
        centerZoomedOut={true}
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
                onClick={() => {
                  const marker = document.getElementById('active-marker');
                  if (marker)
                    transformRef.current?.zoomToElement(
                      'active-marker',
                      2,
                      500,
                      'easeOut'
                    );
                  else resetTransform();
                }}
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

            <button
              className={`media-floor-button ${floorMenuStatus ? 'active' : ''}`}
              onClick={() => handleFloorsMenu()}
            >
              ☰ {t('floorplan-toolbar.floor-menu')}
            </button>
            <div
              className={`floor-selector ${floorMenuStatus ? 'active' : ''}`}
            >
              {FLOORS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleFloorChange(id)}
                  className={`floor-button ${id === floor ? 'active' : ''}`}
                  disabled={isTransitioning}
                >
                  {t('floorplan-toolbar.floor-label', { label })}
                </button>
              ))}
            </div>

            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '100%',
                opacity: isTransitioning ? 0 : 1,
                transition: 'opacity 200ms ease-in-out',
              }}
              contentStyle={{
                width: 'auto',
                height: 'auto',
                // display: 'inline-block',
                padding: '100px',
              }}
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
