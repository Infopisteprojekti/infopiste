import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useRef, useEffect } from 'react';
import FloorplanSVG from './assets/exactum-3.svg?react';
import './css/Floorplan.css';

const Floorplan = () => {
  const floorplanRef = useRef(null);

  useEffect(() => {
    const floorplan = floorplanRef.current;
    if (floorplan) {
      const rooms = floorplan.querySelectorAll('g');
      for (const room of rooms) {
        const child = room.querySelector('*');
        const roomId = child?.id;
        if (roomId) {
          child.classList.add('room');
          room.setAttribute('data-room-id', roomId);

          const handler = () => {
            const status = getRoomStatus();
            alert(`Room ${roomId} status: ${status}`);
          };

          room.addEventListener('click', handler);
          room._clickHandler = handler;
        }
      }

      return () => {
        for (const room of rooms) {
          room.removeEventListener('click', room._clickHandler);
        }
      };
    }
  });

  return (
    <TransformWrapper initialScale={1} minScale={0.5} maxScale={5}>
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <div className="floorplan-toolbar">
            <button onClick={() => zoomIn()}>Zoom In ➕</button>
            <button onClick={() => zoomOut()}>Zoom Out ➖</button>
            <button onClick={() => resetTransform()}>Reset</button>
          </div>

          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100vh',
            }}
            contentStyle={{
              width: '100%',
              height: '100%',
            }}
          >
            <FloorplanSVG ref={floorplanRef} />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

const getRoomStatus = () => {
  return 'unknown';
};

export default Floorplan;
