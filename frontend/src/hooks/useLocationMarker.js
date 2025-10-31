import { useEffect } from 'react';

const useLocationMarker = (
  floorElement,
  ready,
  isInitialFloor,
  markerCoords
) => {
  useEffect(() => {
    if (!ready || !floorElement) return;

    const prevMarker = floorElement.querySelector('.location-marker');
    if (prevMarker) prevMarker.remove();

    if (!isInitialFloor) return;
    if (!Array.isArray(markerCoords) || markerCoords.length !== 2) return;

    const [posx, posy] = markerCoords;
    const marker = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    marker.setAttribute('cx', String(posx));
    marker.setAttribute('cy', String(posy));
    marker.setAttribute('r', '20');
    marker.classList.add('location-marker');
    floorElement.appendChild(marker);

    return () => {
      marker.remove();
    };
  }, [ready, floorElement, isInitialFloor, markerCoords]);
};

export default useLocationMarker;
