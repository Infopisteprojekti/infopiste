import { useRef, useEffect } from 'react';
import FloorplanSVG from './assets/exactum-3.svg?react';
import './css/Floorplan.css';

const baseUrl = 'https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi';
const statuses = ['unavailable', 'available', 'reserved'];

const Floorplan = () => {
    const floorplanRef = useRef(null);

    const checkActive = reservation => {
        const now = new Date();
        const start = new Date(reservation.start.dateTime);
        const end = new Date(reservation.end.dateTime);
        return start < now && end > now;
    };

    const addStatus = (room, child, status) => {
        room._status = status;
        child.classList.remove(...statuses);
        child.classList.add(status);
    };

    useEffect(() => {
        const floorplan = floorplanRef.current;
        let rooms = [];
        if (floorplan) {
            const fetchStatuses = async () => {
                try {
                    const response = await fetch(`${baseUrl}/api/rooms`);
                    const data = await response.json();

                    rooms = Array.from(floorplan.querySelectorAll('g'));
                    for (const room of rooms) {
                        const child = room.querySelector('*');
                        const roomId = child?.id;
                        if (!roomId) continue;

                        child.classList.add('room');
                        room.setAttribute('data-room-id', roomId);

                        const roomData = data.find(e => e.id === roomId);
                        if (!roomData || roomData.type === 'office') {
                            addStatus(room, child, 'unavailable');
                        }
                        else {
                            const reservations = roomData.reservations;
                            const activeReservations = reservations.filter(e => checkActive(e));
                            if (activeReservations.length > 0) {
                                addStatus(room, child, 'reserved');
                            }
                            else {
                                addStatus(room, child, 'available');
                            }
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
                catch (error) {
                    console.log(error);
                }
            };

            fetchStatuses();
        }

        return () => {
            for (const room of rooms) {
                if (room._clickHandler) {
                    room.removeEventListener('click', room._clickHandler);
                    delete room._clickHandler;
                }
            }
        };
    }, []);

    return <FloorplanSVG ref={floorplanRef}></FloorplanSVG>;
};

export default Floorplan;
