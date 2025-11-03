export const getForms = vi.fn(() =>
  Promise.resolve({
    data: [
      { _id: '1', title: 'Form 1', startDate: '2025-01-01', endDate: '2025-01-31', fileUrl: '/form1.pdf' },
      { _id: '2', title: 'Form 2', startDate: '2025-02-01', endDate: '2025-02-28', fileUrl: '/form2.pdf' },
    ],
  })
);

export default { getForms };