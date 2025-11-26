import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

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

  test('renders restaurant buttons correctly', async () => {
    setup();

    expect(await screen.findByText('Exactum')).toBeInTheDocument();
    expect(await screen.findByText('Chemicum')).toBeInTheDocument();
  });

  test('renders exactum menu items correctly', async () => {
    setup();

    expect(
      await screen.findByText('Sweet potato and peanut soup')
    ).toBeInTheDocument();
  });

  test('chemicum menu can be accessed', async () => {
    setup();
    const user = userEvent.setup();

    const chemicumButton = await screen.findByText('Chemicum');
    await user.click(chemicumButton);

    expect(await screen.findByText('Berry quark dessert')).toBeInTheDocument();
    expect(
      await screen.findByText('Quinoa balls with paprika sause')
    ).toBeInTheDocument();
  });
});
