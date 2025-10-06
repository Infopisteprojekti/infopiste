import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useState } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import FloorDisplay from './FloorDisplay';
import floors from '../constants/floors';
import '../css/Floorplan.css';

const DEFAULT_FLOOR = 3;

const Floorplan = () => {
  const [floor, setFloor] = useState(DEFAULT_FLOOR);

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
            <FloorDisplay floor={floor} />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

export default Floorplan;
