import React from 'react';

const FloorDisplay = ({ floor, initialFloor, markerCoords }) => {
  return (
    <div
      data-testid="floor-props"
      data-floor={String(floor)}
      data-initial-floor={String(initialFloor)}
      data-marker-coords={
        Array.isArray(markerCoords) ? markerCoords.join(',') : ''
      }
    />
  );
};

export default FloorDisplay;
