import { vi } from 'vitest';

export const clickMock = vi.fn();

vi.mock('../../src/assets/exactum-3.svg?react', () => ({
  default: ({ ref }) => (
    <svg ref={ref}>
      <g data-room-id="A346" _status="available" onClick={clickMock}>
        <rect id="A346" />
      </g>
      <g data-room-id="A348" _status="reserved">
        <rect id="A348" />
      </g>
      <g data-room-id="A311" _status="unavailable">
        <rect id="A311" />
      </g>
    </svg>
  ),
}));
