import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('react-pdf', () => import('../mocks/reactPdf.mock.jsx'));
vi.mock('@/assets/form.svg', () => ({ default: 'data://qr-mock' }));

import BulletinBoard from '@/components/BulletinBoard.jsx';

let fetchMock;
beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('BulletinBoard unit tests', () => {
  const setup = () => {
    render(<BulletinBoard />);
  };

  test('board loads to an empty state', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => [] });
    setup();
    expect(screen.getByText('Loading PDFs...')).toBeInTheDocument();
    expect(await screen.findByText('No PDFs were found')).toBeInTheDocument();
  });

  test('forms render and can be scrolled', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
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
      }),
    });

    const user = userEvent.setup();
    setup();

    expect(await screen.findByText('Form A')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next →' }));
    expect(await screen.findByText('Form B')).toBeInTheDocument();
  });

  test('QR popup can be toggled', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => [] });
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
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });

    setup();
    await waitFor(() => expect(consoleSpy).toHaveBeenCalled());
    expect(await screen.findByText('No PDFs were found')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
