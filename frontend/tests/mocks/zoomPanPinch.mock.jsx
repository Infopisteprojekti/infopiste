import React from 'react';
import { vi } from 'vitest';

let controls;
export const getZoomControls = () => controls;

export const TransformWrapper = React.forwardRef(({ children }, ref) => {
  controls = {
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    resetTransform: vi.fn(),
  };
  if (ref) ref.current = { resetTransform: controls.resetTransform };
  return (
    <div>{typeof children === 'function' ? children(controls) : children}</div>
  );
});

export const TransformComponent = ({ children }) => <div>{children}</div>;
