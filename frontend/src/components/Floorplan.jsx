import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useSearchParams } from 'react-router-dom';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import FloorDisplay from './FloorDisplay';
import floors from '../constants/floors';
import '../css/Floorplan.css';

const Floorplan = () => {
  const [searchParams] = useSearchParams();
  const floorParam = Number(searchParams.get('floor'));
  const defaultFloor =
    !isNaN(floorParam) && floors.some(f => f.id === floorParam)
      ? floorParam
      : 3;
  const [floor, setFloor] = useState(defaultFloor);
  const markerCoords = searchParams.get('marker')?.split(',').map(Number);

  return (
    <TransformWrapper initialScale={1} minScale={0.5} maxScale={5}>
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <div className="floorplan-toolbar toolbar__transform">
            <button onClick={() => zoomIn()}>
              Zoom In <Plus size={16} />
            </button>
            <button onClick={() => zoomOut()}>
              Zoom Out <Minus size={16} />
            </button>
            <button onClick={() => resetTransform()}>
              Reset <RotateCcw size={16} />
            </button>
          </div>

          <div className="floorplan-toolbar toolbar__floor-switch">
            {floors.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  setFloor(id);
                  resetTransform();
                }}
              >
                Floor {label}
              </button>
            ))}
          </div>

          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100vh' }}
            contentStyle={{ width: '100%', height: '100%' }}
          >
            <FloorDisplay
              floor={floor}
              initialFloor={floorParam}
              markerCoords={markerCoords}
            />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

export default Floorplan;
