import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import FloorDisplay from './FloorDisplay';
import floors from '../constants/floors';
import { useAppSettings } from '../context/AppSettingsContext.jsx';

import '../styles/components/Floorplan.css';
import '../styles/components/Toolbar.css';
import '../styles/components/Button.css';

const Floorplan = () => {
  const { t } = useTranslation();
  const { settings } = useAppSettings();

  const defaultFloor = Number(settings.floor) || 1;
  const [floor, setFloor] = useState(defaultFloor);

  const markerCoords = settings.marker
    ? settings.marker.split(',').map(Number)
    : undefined;

  return (
    <TransformWrapper initialScale={1} minScale={0.5} maxScale={5}>
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <div className="toolbar toolbar__floorplan-transform">
            <button className="button" onClick={() => zoomIn()}>
              {t('floorplan-toolbar.zoom-in')} <Plus size={16} />
            </button>
            <button className="button" onClick={() => zoomOut()}>
              {t('floorplan-toolbar.zoom-out')} <Minus size={16} />
            </button>
            <button className="button" onClick={() => resetTransform()}>
              {t('floorplan-toolbar.reset')} <RotateCcw size={16} />
            </button>
          </div>

          <div className="toolbar toolbar__floorplan-floor-switch">
            {floors.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  setFloor(id);
                  resetTransform();
                }}
                className={`button ${id === floor ? 'active' : ''}`}
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
              initialFloor={defaultFloor}
              markerCoords={markerCoords}
            />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

export default Floorplan;
