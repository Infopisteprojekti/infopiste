import { Form } from '../models/formModel.js';

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
    fileUrl: 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf',
  },
];

export async function insertMockData() {
  try {
    await Form.deleteMany({});
    await Form.insertMany(mockForms);
    console.log('mock data inserted to db successfully');
  } catch (err) {
    console.error('error inserting mock data:', err);
  }
}
