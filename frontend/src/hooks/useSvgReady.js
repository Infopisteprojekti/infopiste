import { useCallback, useState } from 'react';
import { waitForPaint } from '@/utils/floorplan';

const useSvgReady = () => {
  const [floorElement, setFloorElement] = useState(null);
  const [ready, setReady] = useState(false);

  const floorRef = useCallback(async node => {
    setReady(false);
    if (!node) {
      setFloorElement(null);
      return;
    }
    const svg =
      node.tagName?.toLowerCase() === 'svg'
        ? node
        : node.querySelector?.('svg') || null;

    setFloorElement(svg);

    if (svg) {
      await waitForPaint();
      setReady(true);
    }
  }, []);

  return { floorElement, ready, floorRef };
};

export default useSvgReady;
