import { Router } from 'express';
import multer from 'multer';
import File from '../models/file.js';

const router = Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.get('/', async (request, response) => {
  try {
    const files = await File.find({});
    response.status(200).json(files);
  } catch (error) {
    response.status(500).json({ error: 'failed to get files' });
  }
});

router.get('/:id', async (request, response) => {
  try {
    const file = await File.findById(request.params.id);
    response.status(200).json(file);
  } catch (error) {
    response.status(500).json({ error: 'failed to get file' });
  }
});

router.post('/', upload.single('file'), async (request, response) => {
  try {
    const file = new File({
      originalName: request.file.originalname,
      filename: request.file.filename,
      path: request.file.path,
    });
    const savedFile = await file.save();
    response.status(201).json(savedFile);
  } catch (error) {
    response.status(500).json({ error: 'failed to upload file' });
  }
});

export default router;