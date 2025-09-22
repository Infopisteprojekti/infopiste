import { useRef, useEffect } from 'react';
import FloorplanSVG from './assets/exactum-3.svg?react';
import './css/Floorplan.css';

const baseUrl = process.env.NODE_ENV === 'test' ? 'http://localhost:1234' : 'https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi';

const Floorplan = () => {
    const floorplanRef = useRef(null);

    const checkActive = reservation => {
        const now = new Date();
        const start = new Date(reservation.start.dateTime);
        const end = new Date(reservation.end.dateTime);
        return start < now && end > now;
    };

    useEffect(() => {
        const floorplan = floorplanRef.current;
        if (floorplan) {
            fetch(`${baseUrl}/api/rooms`).then(response => response.json().then(data => {
                const rooms = floorplan.querySelectorAll('g');
                for (const room of rooms) {
                    const child = room.querySelector('*');
                    const roomId = child?.id;
                    if (roomId) {
                        child.classList.add('room');
                        room.setAttribute('data-room-id', roomId);

                        const roomData = data.find(e => e.id === roomId);
                        if (roomData) {
                            room._status = 'available';
                            if (roomData.type === 'office') {
                                child.classList.add('unavailable');
                                room._status = 'unavailable';
                            }
                            const reservations = roomData.reservations;
                            const activeReservations = reservations.filter(e => checkActive(e));
                            if (activeReservations.length > 0) {
                                child.classList.add('reserved');
                                room._status = 'reserved';
                            }
                        }
                        else {
                            child.classList.add('unavailable');
                        }

                        const handler = () => {
                            alert(`Room ${roomId} status: ${room._status ?? 'unknown'}`);
                        };

                        if (!room._clickHandler) {
                            room.addEventListener('click', handler);
                            room._clickHandler = handler;
                        }
                    }
                }

                return () => {
                    for (const room of rooms) {
                        room.removeEventListener('click', room._clickHandler);
                    }
                };
            }));
        }
    }, []);

    return <FloorplanSVG ref={floorplanRef}></FloorplanSVG>;
};

export default Floorplan;
