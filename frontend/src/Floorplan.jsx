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

    return <FloorplanSVG ref={floorplanRef}></FloorplanSVG>;
};

const getRoomStatus = () => {
    return 'unknown';
};

export default Floorplan;
