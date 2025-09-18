const router = require('express').Router()
const multer = require('multer')
const File = require('../models/file')

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

router.get('/', async (request, response) => {
  try {
    const files = await File.find()
    response.status(200).json(files)
  } catch (error) {
    response.status(500).json({ error: 'failed to get files' })
  }
})

router.post('/', upload.single('file'), async (request, response) => {
  try {
    const file = new File({
      originalName: request.file.originalname,
      filename: request.file.filename,
      path: request.file.path
    })
    const savedFile = await file.save()
    response.status(201).json(savedFile)  
  } catch (error) {
    response.status(500).json({ error: 'failed to upload file' })
  }
})

module.exports = router