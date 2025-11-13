import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('react-pdf', () => import('../mocks/reactPdf.mock.jsx'));
vi.mock('@/assets/form.svg', () => ({ default: 'data://qr-mock' }));

import BulletinBoard from '@/components/BulletinBoard.jsx';
import formService from '@/services/forms.js';

let formServiceMock;
beforeEach(() => {
  formServiceMock = vi.fn();
  vi.spyOn(formService, 'getForms').mockImplementation(() => formServiceMock());
});
afterEach(() => vi.restoreAllMocks());

describe('BulletinBoard unit tests', () => {
  const setup = () => {
    render(<BulletinBoard />);
  };

  test('board loads to an empty state', async () => {
    formServiceMock.mockResolvedValueOnce({ data: [] });
    setup();
    expect(screen.getByText('Loading notices...')).toBeInTheDocument();
    expect(await screen.findByText('No notices available')).toBeInTheDocument();
  });

  test('empty state is shown on fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    formServiceMock.mockRejectedValueOnce(new Error('Network error'));

    setup();
    await waitFor(() => expect(consoleSpy).toHaveBeenCalled());
    expect(await screen.findByText('No notices available')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
