import { vi } from 'vitest';

vi.mock('react-pdf', () => {
  return {
    Document: ({ children }) => <div data-testid="document">{children}</div>,
    Page: () => <div data-testid="page">PDF Page</div>,
    pdfjs: { GlobalWorkerOptions: { workerSrc: '' } },
  };
});
