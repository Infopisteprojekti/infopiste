import '../mocks/reactPdf.mock.jsx';

import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

vi.mock('@/services/forms.js', () => ({
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
}));


import { MemoryRouter } from 'react-router-dom';
import BulletinBoard from '../../src/components/BulletinBoard.jsx';

describe('BulletinBoard - Rendering', () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <BulletinBoard />
      </MemoryRouter>
    );
  };


  test('renders bulletin board', async () => {
    setup();

    const addFileButton = await screen.findByText('Add file');
    expect(addFileButton).toBeInTheDocument();
  });

  test('renders loading state', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText('Loading notices...')).toBeInTheDocument();
    });
  });
});
