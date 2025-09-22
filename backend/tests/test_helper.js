const File = require('../models/file');

const initialFiles = [
  {
    filename: '1758211568342-test.pdf',
    originalName: 'test.pdf',
    path: 'uploads/1758211568342-test.pdf',
    uploadDate: '2025-09-18T16:06:08.344Z',
    id: '68cc2df024bdde3d461b1a08',
  },
  {
    filename: '1758212057649-test2.pdf',
    originalName: 'test2.pdf',
    path: 'uploads/1758212057649-test2.pdf',
    uploadDate: '2025-09-18T16:14:17.651Z',
    id: '68cc2fd924bdde3d461b1a0b',
  },
];

filesInDb = async () => {
  const files = await File.find({});
  return files.map(file => file.toJSON());
};

module.exports = {
  initialFiles, filesInDb,
};
