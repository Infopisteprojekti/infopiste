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

  test('forms render and can be scrolled', async () => {
    formServiceMock.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          title: 'Form A',
          startDate: '2024-01-01',
          endDate: '2024-01-02',
          fileUrl: '/a.pdf',
        },
        {
          _id: '2',
          title: 'Form B',
          startDate: '2024-02-01',
          endDate: '2024-02-02',
          fileUrl: '/b.pdf',
        },          
      ],
    });

    const user = userEvent.setup();
    setup();

    const formA = await screen.findByText('Form A');

    expect(formA).toBeInTheDocument();
    await user.click(formA)
    await user.click(screen.getByRole('button', { name: 'Next →' }));
    expect(await screen.findByText('Form B')).toBeInTheDocument();
  });

  test('QR popup can be toggled', async () => {
    formServiceMock.mockResolvedValueOnce({ data: [] });
    const user = userEvent.setup();
    setup();

    const btn = await screen.findByRole('button', { name: 'Add file' });
    const popup = document.getElementById('popup');

    await user.click(btn);
    expect(popup.classList.contains('open-popup')).toBe(true);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(popup.classList.contains('open-popup')).toBe(false);
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
