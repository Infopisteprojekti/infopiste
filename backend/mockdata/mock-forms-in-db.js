import Form from '../models/form.js';

const mockForms = [
  {
    title: 'Best notice',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-02'),
    fileUrl: 'https://pdfobject.com/pdf/sample.pdf',
  },
  {
    title: 'Second best notice',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-02'),
    fileUrl:
      'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf',
  },
  {
    title: 'Third best notice',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-02'),
    fileUrl: 'https://nlsblog.org/wp-content/uploads/2020/06/image-based-pdf-sample.pdf',
  },
  {
    title: 'Fourth best notice',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-02'),
    fileUrl: 'https://www.colorpilot.com/files-html2pdfx/html2pdfx_Report_sample.pdf',
  },
  {
    title: 'Fifth best notice',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-02'),
    fileUrl: 'https://www.colorpilot.com/files-html2pdfx/html2pdfx_Novella_sample.pdf',
  },
];

export async function insertMockData() {
  try {
    await Form.deleteMany({});
    await Form.insertMany(mockForms);
    console.log('mock data inserted to db successfully');
  } catch (err) {
    console.error('error inserting mock data:', err);
  }/flyer/
}
