import { useRef, useEffect, useState } from 'react';
import FloorplanSVG from './assets/exactum-3.svg?react';
import './css/Floorplan.css';
import Pdfview from './Pdfview.jsx';

const Floorplan = () => {
    const floorplanRef = useRef(null);
    const [active, setactive] = useState(1);

    const handleClick = () => {
        setactive(!active);
    };

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

    return (<>
            <button onClick={handleClick}>pdfs</button>
            {active ? <FloorplanSVG ref={floorplanRef}></FloorplanSVG> : <Pdfview />}
            </>);
};

const getRoomStatus = () => {
    return 'unknown';
};

export default Floorplan;
