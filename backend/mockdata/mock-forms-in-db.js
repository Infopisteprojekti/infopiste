import mongoose from 'mongoose';
import { MONGO_DB_URL } from '../utils/config.js';
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
    fileUrl: 'https://pdfobject.com/pdf/sample.pdf',
  },
];

async function insertMockData() {
  if (!MONGO_DB_URL.includes('test_db')) {
    console.log(
      'MONGO_DB_URL not pointing to test database - exiting function'
    );
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_DB_URL);

    await Form.deleteMany({});
    await Form.insertMany(mockForms);

    console.log('mock data inserted to db successfully');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

insertMockData();
