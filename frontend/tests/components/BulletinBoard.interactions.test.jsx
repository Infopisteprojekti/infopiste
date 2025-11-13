import '../mocks/reactPdf.mock.jsx';

vi.mock('@/services/forms.js', () => {
  return {
    default: {
      getForms: vi.fn(() =>
        Promise.resolve({
          data: [
            {
              _id: '1',
              title: 'Form 1',
              startDate: '2025-01-01',
              endDate: '2025-01-31',
              fileUrl: '/form1.pdf',
            },
            {
              _id: '2',
              title: 'Form 2',
              startDate: '2025-02-01',
              endDate: '2025-02-28',
              fileUrl: '/form2.pdf',
            },
          ],
        })
      ),
    },
  };
});

import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BulletinBoard from '../../src/components/BulletinBoard.jsx';

describe('BulletinBoard - Interactions', () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <BulletinBoard />
      </MemoryRouter>
    );
  };

  test('qr code to upload files appears', async () => {
    const user = userEvent.setup();

    setup();

    const addFileButton = await screen.findByText('Add file');
    await user.click(addFileButton);

    const popup = document.getElementById('popup');
    expect(popup.classList.contains('open-popup')).toBe(true);
  });

  test('qr code can be closed', async () => {
    const user = userEvent.setup();

    setup();

    const addFileButton = await screen.findByText('Add file');
    await user.click(addFileButton);

    const closeButton = await screen.findByText('Close');
    await user.click(closeButton);

    const popup = document.getElementById('popup');
    expect(popup.classList.contains('open-popup')).toBe(false);
  });

  test('navigation between forms works', async () => {
    const user = userEvent.setup();

    setup();

    const form1 = await screen.findByText('Form 1');
    await user.click(form1);

    const nextButton = screen.getByText('← Previous');
    const prevButton = screen.getByText('Next →');

    await user.click(nextButton);
    await waitFor(() => screen.getByText('Form 2'));
    expect(screen.getByText('Form 2')).toBeInTheDocument();

    await user.click(prevButton);
    await waitFor(() => screen.getByText('Form 1'));
    expect(screen.getByText('Form 1')).toBeInTheDocument();
  });

  test('grid view can be returned to', async () => {
    const user = userEvent.setup();

    setup();

    const form1 = await screen.findByText('Form 1');
    await user.click(form1);

    const backButton = screen.getByText(/← View all notices/i);
    await user.click(backButton);
    expect(screen.getByText('Available notices')).toBeInTheDocument();
  });
});
