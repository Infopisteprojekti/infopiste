import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';

import UnicafeMenu from '@/components/UnicafeMenu.jsx';
import mockData from '../mocks/data/mockMenuData.json';

vi.mock('@/services/unicafe.js', () => ({
  default: {
    getMenus: vi.fn(() => Promise.resolve({ data: mockData.data })),
  },
}));

describe('UnicafeMenu unit tests', () => {
  const setup = () => {
    render(<UnicafeMenu />);
  };

  test('renders restaurant names correctly', async () => {
    setup();

    expect(await screen.findByText('Exactum')).toBeInTheDocument();
    expect(await screen.findByText('Chemicum')).toBeInTheDocument();
  });

  test('renders menu items correctly', async () => {
    setup();

    expect(
      await screen.findByText('Sweet potato and peanut soup')
    ).toBeInTheDocument();

    expect(await screen.findByText('Berry quark dessert')).toBeInTheDocument();
  });
});
