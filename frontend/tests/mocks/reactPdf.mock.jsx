import React from 'react';

export const Document = ({ children }) => (
  <div data-testid="pdf-doc">{children}</div>
);
export const Page = () => <div data-testid="pdf-page" />;
export const pdfjs = {
  version: '3.11.174',
  GlobalWorkerOptions: { workerSrc: '' },
};
