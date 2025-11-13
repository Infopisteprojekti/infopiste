import React from 'react';

const FloorDisplay = ({ floor, initialFloor, markerCoords }) => {
  return (
    <div data-testid="floor-props" data-floor={floor}>
      <div data-room-id="B233">Room B233</div>
    </div>
  );
};

export default FloorDisplay;